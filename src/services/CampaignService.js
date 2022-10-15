const {
  Campaign,
  Program,
  Discount,
  Product,
  Plan,
  Company,
  User,
  sequelize,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const DiscountService = require('./DiscountService');
const discountService = new DiscountService();
const CAMPAIGN_STEP_SEND_TO_PENDING = 5;

class CampaignService {
  async getCampaigns(idCompany, status) {
    try {
      const { rows: data = [], count } = await Campaign.findAndCountAll({
        include: [
          {
            model: Program,
            as: 'program',
            attributes: ['id', 'name', 'idPlan'],
            required: true,
            include: [
              {
                model: Plan,
                as: 'plan',
                attributes: [],
                required: true,
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: [],
                    where: { id: idCompany },
                  },
                ],
              },
            ],
          },
          {
            model: User,
            as: 'assigned',
            attributes: ['name', 'lastName'],
          },
          {
            model: User,
            as: 'creator',
            attributes: ['name', 'lastName'],
          },
        ],
        where: {
          status,
          active: true,
        },
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getCampaignsByUser(idUser, idCompany, status) {
    try {
      const { rows: data = [], count } = await Campaign.findAndCountAll({
        include: [
          {
            model: Program,
            as: 'program',
            attributes: ['id', 'name', 'idPlan'],
            required: true,
            include: [
              {
                model: Plan,
                as: 'plan',
                attributes: [],
                required: true,
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: [],
                    where: { id: idCompany },
                  },
                ],
              },
            ],
          },
          {
            model: User,
            as: 'creator',
            attributes: ['name', 'lastName'],
          },
        ],
        where: {
          createdBy: idUser,
          status,
          active: true,
        },
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getAssignedCampaignsByUser(idUser, idCompany, status) {
    try {
      const { rows: data = [], count } = await Campaign.findAndCountAll({
        include: [
          {
            model: Program,
            as: 'program',
            attributes: ['id', 'name', 'idPlan'],
            required: true,
            include: [
              {
                model: Plan,
                as: 'plan',
                attributes: [],
                required: true,
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: [],
                    where: { id: idCompany },
                  },
                ],
              },
            ],
          },
          {
            model: User,
            as: 'assigned',
            attributes: ['name', 'lastName'],
          },
          {
            model: User,
            as: 'creator',
            attributes: ['name', 'lastName'],
          },
        ],
        where: {
          createdBy: idUser,
          status,
          active: true,
        },
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  } 

  async getCampaignById(id) {
    try {
      const campaign = await Campaign.findOne({
        include: [
          {
            model: Discount,
            as: 'discounts',
            attributes: [
              [sequelize.literal('"discounts"."discount"'), 'discount'],
              [sequelize.literal('"discounts"."startDate"'), 'startDate'],
              [sequelize.literal('"discounts"."endDate"'), 'endDate'],
              [sequelize.literal('"discounts->product"."code"'), 'code'],
              [sequelize.literal('"discounts->product"."name"'), 'name'],
            ],
            include: [
              {
                model: Product,
                as: 'product',
                attributes: [],
              },
            ],
          },
          {
            model: User,
            as: 'creator',
            attributes: ['name', 'lastName'],
          },
        ],
        where: {
          id,
          active: true,
        },
      });
      return campaign;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addCampaign(idUser, idCompany, idProgram, campaignDTO) {
    try {
      let status = 'CREATED';
      if (campaignDTO.step === CAMPAIGN_STEP_SEND_TO_PENDING) {
        status = 'PENDING';
      }

      const campaign = await Campaign.create({
        name: campaignDTO.name,
        lists: campaignDTO.lists ?? [],
        segments: campaignDTO.segments ?? [],
        step: campaignDTO.step ?? 0,
        html: campaignDTO.html ?? '',
        goal: campaignDTO.goal,
        budget: campaignDTO.budget,
        startDate: campaignDTO.startDate,
        endDate: campaignDTO.endDate,
        createdBy: idUser,
        status,
        idProgram,
      });
      await discountService.addDiscounts(
        campaign.id,
        idCompany,
        campaignDTO.discounts,
        'MARKETING'
      );
      return campaign;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateCampaign(idCompany, campaignDTO) {
    try {
      const id = campaignDTO.id;
      let status = 'CREATED';
      if (campaignDTO.step === CAMPAIGN_STEP_SEND_TO_PENDING) {
        status = 'PENDING';
      }
      await Campaign.update(
        {
          name: campaignDTO.name,
          lists: campaignDTO.lists ?? [],
          segments: campaignDTO.segments ?? [],
          step: campaignDTO.step ?? 0,
          html: campaignDTO.html ?? '',
          goal: campaignDTO.goal,
          budget: campaignDTO.budget,
          startDate: campaignDTO.startDate,
          endDate: campaignDTO.endDate,
          status,
        },
        { where: { id } }
      );
      await discountService.updateDiscounts(
        idCompany,
        campaignDTO,
        'MARKETING'
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async approveCampaign(campaignDTO) {
    try {
      await Campaign.update(
        {
          name: campaignDTO.name,
          lists: campaignDTO.lists ?? [],
          segments: campaignDTO.segments ?? [],
          step: campaignDTO.step ?? 0,
          html: campaignDTO.html ?? '',
          goal: campaignDTO.goal,
          budget: campaignDTO.budget,
          startDate: campaignDTO.startDate,
          endDate: campaignDTO.endDate,
          status: 'APPROVED',
        },
        { where: { id: campaignDTO.id } }
      );
      if (campaignDTO.assigned && campaignDTO.assigned.length > 0) {
        await this.addUsersToCampaign(campaignDTO.id, campaignDTO.assigned);
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addUsersToCampaign(idCampaign, assigned = []) {
    const t = await sequelize.transaction();
    const campaign = await Campaign.findOne({ id: idCampaign })

    try {
      for (const idUser of assigned) {
        await campaign.addUser(idUser, { transaction: t});
      }

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

}

module.exports = CampaignService;
