const { Campaign, Program, Plan, User } = require('../models/index');
const { BadRequestError } = require('../errors');

class CampaignService {
  async getCampaignsByCompany(idCompany) {
    try {
      const { rows: data, count } = await Campaign.findAndCountAll({
        include: [
          {
            model: Program,
            as: 'program',
            attributes: ['id', 'name', 'idPlan'],
            include: [
              {
                model: Plan,
                as: 'plan',
                attributes: ['createdBy'],
                include: [
                  {
                    model: User,
                    as: 'user',
                    attributes: ['idCompany'],
                    where: { idCompany },
                  },
                ],
              },
            ],
          },
          {
            model: User,
            as: 'user',
            attributes: ['name', 'lastName'],
          }
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

  async addCampaign(idUser, idProgram, campaignDTO) {
    try {
      const campaign = await Campaign.create({
        ...campaignDTO,
        createdBy: idUser,
        idProgram,
      });
      return campaign;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = CampaignService;
