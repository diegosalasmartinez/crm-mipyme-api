const { Campaign, Program, Plan, Company, User } = require('../models/index');
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
            include: [
              {
                model: Plan,
                as: 'plan',
                attributes: ['id'],
                include: [
                  {
                    model: Company,
                    as: 'company',
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

  async getCampaignsById(id) {
    try {
      const campaign = await Campaign.findAndCountAll({
        include: [
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
      return campaign
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
      await discountService.addDiscount(
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
}

module.exports = CampaignService;
