const { Campaign, Program, Plan, User } = require('../models/index');
const { BadRequestError } = require('../errors');

class CampaignService {
  async getCampaignsByCompany(idCompany) {
    try {
      const campaigns = await Campaign.findAndCountAll({
        include: [
          {
            model: Program,
            as: 'program',
            include: [
              {
                model: Plan,
                as: 'plan',
                include: [
                  {
                    model: User,
                    as: 'user',
                    where: { idCompany },
                  },
                ],
              },
            ],
          },
        ],
        where: {
          active: true,
        },
      });
      return campaigns;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addCampaign(idProgram, campaignDTO) {
    try {
      const campaign = await Campaign.create({
        ...campaignDTO,
        idProgram
      });
      return campaign;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = CampaignService;
