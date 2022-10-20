const {
  Deal,
  DealStep,
  User,
  Contact,
  Lead,
  Activity,
  ActivityType
} = require('../models/index');
const { BadRequestError } = require('../errors');
const DealOriginService = require('./DealOriginService');
const dealOriginService = new DealOriginService();
const DealStepService = require('./DealStepService');
const dealStepService = new DealStepService();
const DealPriorityService = require('./DealPriorityService');
const dealPriorityService = new DealPriorityService();

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
              include: [
                {
                  model: Lead,
                  as: 'lead',
                },
                {
                  model: User,
                  as: 'assigned',
                  required: true,
                  where: {
                    idCompany,
                  },
                },
              ],
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
          },
          {
            model: Contact,
            as: 'contact',
            include: [
              {
                model: Lead,
                as: 'lead',
              },
              {
                model: User,
                as: 'assigned',
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
            ],
          },
          {
            model: DealStep,
            as: 'step',
          },
        ],
        where: {
          id,
          active: true,
        },
        order: [['createdAt', 'DESC']],
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
      const origin = await dealOriginService.get('campaign');
      const step = await dealStepService.getDefault();
      const priority = await dealPriorityService.getDefault();

      await Deal.create(
        {
          ...dealDTO,
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
}

module.exports = DealService;
