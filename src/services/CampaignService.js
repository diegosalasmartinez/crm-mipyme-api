const {
  Campaign,
  Program,
  Discount,
  Product,
  Plan,
  Company,
  User,
  Sequelize,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const DiscountService = require('./DiscountService');
const discountService = new DiscountService();
class CampaignService {
  async getCampaignsByCompany(idCompany) {
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
              [Sequelize.literal('"discounts"."discount"'), 'discount'],
              [Sequelize.literal('"discounts"."startDate"'), 'startDate'],
              [Sequelize.literal('"discounts"."endDate"'), 'endDate'],
              [Sequelize.literal('"discounts->product"."code"'), 'code'],
              [Sequelize.literal('"discounts->product"."name"'), 'name'],
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
      const campaign = await Campaign.update(
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
        },
        { where: { id } }
      );
      await discountService.updateDiscounts(
        idCompany,
        campaignDTO,
        'MARKETING'
      );
      return campaign;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = CampaignService;
