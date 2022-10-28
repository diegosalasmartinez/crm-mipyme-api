const { decode } = require('html-entities');
const { Op } = require('sequelize');
const cron = require('node-cron');
const {
  Campaign,
  CampaignStatus,
  Program,
  Discount,
  Product,
  Lead,
  Plan,
  Company,
  User,
  ClassificationMarketing,
  Rejection,
  sequelize,
} = require('../models/index');
const { transporter } = require('../config/MailConfig');
const { BadRequestError } = require('../errors');
const CampaignStatusService = require('./CampaignStatusService');
const campaignStatusService = new CampaignStatusService();
const DiscountService = require('./DiscountService');
const discountService = new DiscountService();
const LeadService = require('./LeadService');
const leadService = new LeadService();
const QuotationService = require('./QuotationService');
const quotationService = new QuotationService();

const CAMPAIGN_STEP_SEND_TO_PENDING = 5;

cron.schedule(
  '15 0 * * *',
  async function () {
    const campaignService = new CampaignService();
    await campaignService.runCampaigns();
  },
  {
    scheduled: true,
    timezone: 'America/Lima',
  }
);

cron.schedule(
  '0 10 * * *',
  async function () {
    const campaignService = new CampaignService();
    await campaignService.sendCampaigns();
  },
  {
    scheduled: true,
    timezone: 'America/Lima',
  }
);

class CampaignService {
  async getCampaigns(idCompany, status) {
    try {
      const { rows: data = [], count } = await Campaign.findAndCountAll({
        required: true,
        attributes: {
          exclude: ['html', 'segments', 'lists'],
        },
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
          {
            model: CampaignStatus,
            as: 'status',
            where: {
              key: status,
            },
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

  async getCampaignsByUser(idUser, idCompany, status) {
    try {
      const { rows: data = [], count } = await Campaign.findAndCountAll({
        required: true,
        attributes: {
          exclude: ['html', 'segments', 'lists'],
        },
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
          {
            model: CampaignStatus,
            as: 'status',
            where: {
              key: status,
            },
          },
        ],
        where: {
          createdBy: idUser,
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
        required: true,
        attributes: {
          exclude: ['html', 'segments', 'lists'],
        },
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
            where: {
              '$assigned.usersxcampaigns.idUser$': idUser,
            },
          },
          {
            model: User,
            as: 'creator',
            attributes: ['name', 'lastName'],
          },
          {
            model: CampaignStatus,
            as: 'status',
            where: {
              key: status,
            },
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
          {
            model: User,
            as: 'approver',
            attributes: ['name', 'lastName'],
          },
          {
            model: Lead,
            as: 'leads',
            attributes: ['id', 'name', 'lastName', 'email', 'birthday', 'phone'],
            include: [
              {
                model: ClassificationMarketing,
                as: 'classificationMarketing',
              },
            ],
          },
          {
            model: CampaignStatus,
            as: 'status',
          },
          {
            model: Rejection,
            as: 'rejections',
            include: [
              {
                model: User,
                as: 'creator',
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
      return campaign;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getCampaignStats(campaign) {
    try {
      const distribution = {
        started: 0,
        ready_marketing: 0,
        marketing_engaged: 0,
        ready_sales: 0,
      };
      campaign.leads.forEach(function (lead) {
        const classification = lead.classificationMarketing.key;
        distribution[classification] = (distribution[classification] || 0) + 1;
      });
      const distributionArray = Object.keys(distribution).map((key) => distribution[key]);

      const deals = await campaign.getDeals();
      const dealsId = deals.map((deal) => deal.id);
      const sales = await quotationService.getSalesOfDeals(dealsId);
      return {
        distribution: distributionArray,
        numConversions: campaign.numConversions,
        numDeals: deals.length,
        sales,
      };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addCampaign(idUser, idCompany, idProgram, campaignDTO) {
    try {
      let statusValue = 'bulk';
      if (campaignDTO.step === CAMPAIGN_STEP_SEND_TO_PENDING) {
        statusValue = 'pending';
      }
      const status = await campaignStatusService.get(statusValue);

      const campaign = await Campaign.create({
        name: campaignDTO.name,
        lists: campaignDTO.lists === null ? [] : campaignDTO.lists,
        segments: campaignDTO.segments === null ? [] : campaignDTO.segments,
        step: campaignDTO.step === null ? 0 : campaignDTO.step,
        html: campaignDTO.html === null ? {} : campaignDTO.html,
        htmlTemplate: campaignDTO.htmlTemplate === null ? {} : campaignDTO.htmlTemplate,
        goal: campaignDTO.goal,
        budget: campaignDTO.budget,
        startDate: campaignDTO.startDate,
        endDate: campaignDTO.endDate,
        createdBy: idUser,
        idStatus: status.id,
        idProgram,
      });

      await discountService.addDiscounts(
        campaign.id,
        idCompany,
        campaignDTO.discounts,
        'marketing'
      );
      return campaign;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateCampaign(idCompany, campaignDTO) {
    try {
      const id = campaignDTO.id;
      let statusValue = 'bulk';
      if (campaignDTO.step === CAMPAIGN_STEP_SEND_TO_PENDING) {
        statusValue = 'pending';
      }
      const status = await campaignStatusService.get(statusValue);

      await Campaign.update(
        {
          name: campaignDTO.name,
          lists: campaignDTO.lists === null ? [] : campaignDTO.lists,
          segments: campaignDTO.segments === null ? [] : campaignDTO.segments,
          step: campaignDTO.step === null ? 0 : campaignDTO.step,
          html: campaignDTO.html === null ? {} : campaignDTO.html,
          htmlTemplate: campaignDTO.htmlTemplate === null ? {} : campaignDTO.htmlTemplate,
          goal: campaignDTO.goal,
          budget: campaignDTO.budget,
          startDate: campaignDTO.startDate,
          endDate: campaignDTO.endDate,
          idStatus: status.id,
        },
        { where: { id } }
      );

      await discountService.updateDiscounts(idCompany, campaignDTO, 'marketing');
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async rejectCampaign(idCampaign) {
    try {
      const status = await campaignStatusService.get('rejected');

      await Campaign.update(
        {
          idStatus: status.id,
        },
        { where: { id: idCampaign } }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async approveCampaign(idUser, idCompany, campaignDTO) {
    const t = await sequelize.transaction();

    try {
      const status = await campaignStatusService.get('approved');

      await Campaign.update(
        {
          name: campaignDTO.name,
          lists: campaignDTO.lists === null ? [] : campaignDTO.lists,
          segments: campaignDTO.segments === null ? [] : campaignDTO.segments,
          step: campaignDTO.step === null ? 0 : campaignDTO.step,
          html: campaignDTO.html === null ? {} : campaignDTO.html,
          htmlTemplate: campaignDTO.htmlTemplate === null ? {} : campaignDTO.htmlTemplate,
          goal: campaignDTO.goal,
          budget: campaignDTO.budget,
          startDate: campaignDTO.startDate,
          endDate: campaignDTO.endDate,
          approvedBy: idUser,
          approvedAt: new Date(),
          idStatus: status.id,
        },
        { where: { id: campaignDTO.id }, transaction: t }
      );

      const campaign = await Campaign.findByPk(campaignDTO.id);
      await this.addUsersToCampaign(campaign, campaignDTO.assigned, t);
      await this.executeSegments(idCompany, campaign, t);

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async addUsersToCampaign(campaign, assigned = [], t) {
    try {
      for (const idUser of assigned) {
        await campaign.addAssigned(idUser, { through: 'usersxcampaigns' }, { transaction: t });
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async executeSegments(idCompany, campaign, t) {
    try {
      const leads = await leadService.executeSegments(idCompany, campaign.segments, campaign.lists);
      for (const idLead of leads) {
        await campaign.addLead(idLead, { through: 'leadsxcampaigns' }, { transaction: t });
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async increaseConvertNumber(idCampaign, t) {
    try {
      await Campaign.increment(
        { numConversions: 1 },
        { where: { id: idCampaign }, transaction: t }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async runCampaigns() {
    try {
      const statusApproved = await campaignStatusService.get('approved');
      const statusRunning = await campaignStatusService.get('running');
      const statusFinished = await campaignStatusService.get('finished');

      await Campaign.update(
        { idStatus: statusFinished.id },
        {
          where: {
            idStatus: statusRunning.id,
            endDate: {
              [Op.lt]: new Date(),
            },
            active: true,
          },
        }
      );

      await Campaign.update(
        { idStatus: statusRunning.id },
        {
          where: {
            idStatus: statusApproved.id,
            startDate: {
              [Op.lte]: new Date(),
            },
            active: true,
          },
        }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async sendCampaigns() {
    try {
      const status = await campaignStatusService.get('running');
      const campaigns = await Campaign.findAll({
        attributes: ['id', 'name', 'html', 'htmlTemplate'],
        include: [
          {
            model: Lead,
            as: 'leads',
            attributes: ['id', 'name', 'lastName', 'email'],
          },
        ],
        where: {
          idStatus: status.id,
          sent: false,
          active: true,
        },
      });

      const campaignsResult = [];
      for (const campaign of campaigns) {
        campaignsResult.push(`Executing: ${campaign.name}`);
        const htmlFormatted = decode(campaign.htmlTemplate);

        for (const lead of campaign.leads) {
          await transporter.sendMail({
            from: '"CRM MiPYME" <diesalasmart@gmail.com>',
            to: lead.email,
            subject: campaign.name,
            html: htmlFormatted,
          });
        }
      }

      const campaignsId = campaigns.map((campaign) => campaign.id);
      await Campaign.update(
        {
          sent: true,
        },
        { where: { id: campaignsId } }
      );
      return campaignsResult;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = CampaignService;
