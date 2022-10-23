const {
  Deal,
  DealStep,
  DealPriority,
  User,
  Contact,
  Lead,
  Activity,
  ActivityType,
  ActivityStatus,
  Quotation,
  QuotationDetail,
  QuotationStatus,
  LostType,
  sequelize,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const DealOriginService = require('./DealOriginService');
const dealOriginService = new DealOriginService();
const DealStepService = require('./DealStepService');
const dealStepService = new DealStepService();
const DealPriorityService = require('./DealPriorityService');
const dealPriorityService = new DealPriorityService();
const QuotationService = require('./QuotationService');
const quotationService = new QuotationService();
const LostTypeService = require('./LostTypeService');
const lostTypeService = new LostTypeService();

class DealService {
  async getDeals(idCompany) {
    try {
      const steps = await dealStepService.getAll();
      const data = [];
      for (const step of steps) {
        const deals = await Deal.findAll({
          required: true,
          include: [
            {
              model: Contact,
              as: 'contact',
              attributes: ['id'],
              required: true,
              include: [
                {
                  model: Lead,
                  as: 'lead',
                  attributes: ['id', 'name', 'lastName'],
                },
                {
                  model: User,
                  as: 'assigned',
                  attributes: ['id', 'name', 'lastName'],
                  required: true,
                  where: {
                    idCompany,
                  },
                },
              ],
            },
            {
              model: DealPriority,
              as: 'priority',
            },
          ],
          where: {
            idStep: step.id,
            active: true,
          },
          order: [['createdAt', 'DESC']],
        });
        data.push(deals);
      }
      return data;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getDealById(id) {
    try {
      const deal = await Deal.findOne({
        required: true,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'lastName'],
          },
          {
            model: Contact,
            as: 'contact',
            attributes: ['id'],
            include: [
              {
                model: Lead,
                as: 'lead',
                attributes: ['id', 'name', 'lastName'],
              },
              {
                model: User,
                as: 'assigned',
                attributes: ['id', 'name', 'lastName'],
              },
            ],
          },
          {
            model: Activity,
            as: 'activities',
            include: [
              {
                model: ActivityType,
                as: 'type',
              },
              {
                model: ActivityStatus,
                as: 'status',
              },
            ],
          },
          {
            model: Quotation,
            as: 'quotations',
            attributes: ['id', 'startDate', 'limitDate'],
            include: [
              {
                model: QuotationDetail,
                as: 'detail',
              },
              {
                model: QuotationStatus,
                as: 'status',
              },
            ],
          },
          {
            model: DealStep,
            as: 'step',
          },
          {
            model: DealPriority,
            as: 'priority',
          },
          {
            model: LostType,
            as: 'lostType',
          },
        ],
        where: {
          id,
          active: true,
        },
      });
      return deal;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getDealsOfLeads(leadsId) {
    try {
      const deals = await Deal.findAll({
        required: true,
        include: [
          {
            model: Contact,
            as: 'contact',
            attributes: ['id'],
            include: [
              {
                model: Lead,
                as: 'lead',
                attributes: ['id', 'name', 'lastName'],
                where: {
                  id: leadsId,
                },
              },
            ],
          },
        ],
        where: {
          active: true,
        },
      });
      return deals;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getDealByIdSimple(id) {
    try {
      const deal = await Deal.findOne({
        required: true,
        attributes: ['id', 'name'],
        include: [
          {
            model: Contact,
            as: 'contact',
            attributes: ['id'],
            include: [
              {
                model: Lead,
                attributes: ['id', 'name', 'lastName'],
                as: 'lead',
              },
              {
                model: User,
                as: 'assigned',
                attributes: ['id', 'name', 'lastName'],
              },
            ],
          },
        ],
        where: {
          id,
          active: true,
        },
      });
      return deal;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addDeal(idLead, dealDTO, t) {
    try {
      await Deal.create(
        {
          ...dealDTO,
          idLead,
        },
        { transaction: t }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addDealThroughCampaign(idUser, idContact, dealDTO, idCampaign, t) {
    try {
      const origin = await dealOriginService.get(dealDTO.origin);
      const priority = await dealPriorityService.get(dealDTO.priority);
      const step = await dealStepService.getDefault();

      await Deal.create(
        {
          name: dealDTO.name,
          expectedAmount: dealDTO.expectedAmount,
          expectedCloseDate: dealDTO.expectedCloseDate,
          description: dealDTO.description,
          idOrigin: origin.id,
          idStep: step.id,
          idPriority: priority.id,
          idContact,
          idCampaign,
          createdBy: idUser,
        },
        { transaction: t }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateStep(deal, stepValue, data) {
    const t = await sequelize.transaction();
    try {
      const step = await dealStepService.get(stepValue);
      await Deal.update({ idStep: step.id }, { where: { id: deal.id }, transaction: t });
      if (stepValue === 'quoted') {
        const quotationsId = deal.quotations
          .filter((quotation) => quotation.status.key === 'created')
          .map((quotation) => quotation.id);
        await quotationService.sendQuotationsToNewStep(quotationsId, 'pending', t);
      } else if (stepValue === 'won') {
        const quotationsId = deal.quotations
          .filter((quotation) => quotation.status.key === 'approved')
          .map((quotation) => quotation.id);
        await quotationService.sendQuotationsToNewStep(quotationsId, 'accepted', t);
      } else if (stepValue === 'lost') {
        const quotationsId = deal.quotations
          .filter((quotation) => quotation.status.key === 'approved')
          .map((quotation) => quotation.id);
        await quotationService.sendQuotationsToNewStep(quotationsId, 'expired', t);
        const lostType = await lostTypeService.get(data.reason);
        await Deal.update({ idLostType: lostType.id }, { where: { id: deal.id }, transaction: t });
      }
      t.commit();
    } catch (e) {
      t.rollback();
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DealService;
