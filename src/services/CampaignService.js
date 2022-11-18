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
  MarketingKPI,
  ClassificationMarketing,
  Rejection,
  sequelize,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const CampaignStatusService = require('./CampaignStatusService');
const campaignStatusService = new CampaignStatusService();
const DiscountService = require('./DiscountService');
const discountService = new DiscountService();
const DealService = require('./DealService');
const dealService = new DealService();
const LeadService = require('./LeadService');
const leadService = new LeadService();
const MailService = require('./MailService');
const mailService = new MailService();
require('dotenv').config();

const CAMPAIGN_STEP_SEND_TO_PENDING = 6;

cron.schedule(
  '15 0 * * *',
  async function () {
    try {
      console.log('Executing job => run campaigns');
      const campaignService = new CampaignService();
      await campaignService.runCampaigns();
    } catch (e) {
      console.error(e);
    }
  },
  {
    scheduled: true,
    timezone: 'America/Lima',
  }
);

cron.schedule(
  '0 10 * * *',
  async function () {
    try {
      console.log('Executing job => send campaigns');
      const campaignService = new CampaignService();
      await campaignService.sendCampaigns();
    } catch (e) {
      console.error(e);
    }
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
        attributes: {
          exclude: ['html', 'segments', 'lists'],
        },
        include: [
          {
            model: Program,
            as: 'program',
            attributes: ['id', 'name', 'idPlan'],
            include: [
              {
                model: Plan,
                as: 'plan',
                attributes: [],
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: [],
                    required: false,
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
        attributes: {
          exclude: ['html', 'segments', 'lists'],
        },
        include: [
          {
            model: Program,
            as: 'program',
            attributes: ['id', 'name', 'idPlan'],
            include: [
              {
                model: Plan,
                as: 'plan',
                attributes: [],
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: [],
                    required: false,
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
            required: false,
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
        attributes: {
          exclude: ['html', 'segments', 'lists'],
        },
        include: [
          {
            model: Program,
            as: 'program',
            attributes: ['id', 'name', 'idPlan'],
            include: [
              {
                model: Plan,
                as: 'plan',
                attributes: [],
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: [],
                    required: false,
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
            required: false,
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
            required: false,
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
        required: false,
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
            required: false,
            attributes: ['id', 'name', 'lastName', 'email', 'birthday', 'phone', 'active'],
            include: [
              {
                model: ClassificationMarketing,
                as: 'classificationMarketing',
              },
            ],
            where: {
              active: true,
            },
          },
          {
            model: MarketingKPI,
            as: 'kpis',
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

  async getCampaignsByLead(idLead) {
    try {
      const status = await campaignStatusService.get('running');
      const campaigns = await Campaign.findAll({
        required: false,
        attributes: {
          exclude: ['html', 'segments', 'lists'],
        },
        include: [
          { model: Lead, as: 'leads', attributes: ['id'] },
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
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: [],
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
          },
        ],
        where: {
          '$leads.id$': idLead,
          idStatus: status.id,
        },
      });
      return campaigns;
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
      let sales = 0;
      deals.forEach((deal) => {
        if (deal.realAmount && deal.realAmount > 0) {
          sales += deal.realAmount;
        }
      });
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
    const t = await sequelize.transaction();
    try {
      let statusValue = 'bulk';
      if (campaignDTO.step === CAMPAIGN_STEP_SEND_TO_PENDING) {
        statusValue = 'pending';
      }
      const status = await campaignStatusService.get(statusValue);

      let htmlTemplate = campaignDTO?.htmlTemplate ? campaignDTO.htmlTemplate : '';
      if (htmlTemplate !== '') {
        htmlTemplate.replace(/(\r\n|\n|\r)/gm, '');
      }

      const campaign = await Campaign.create(
        {
          name: campaignDTO.name,
          lists: campaignDTO.lists === null ? [] : campaignDTO.lists,
          segments: campaignDTO.segments === null ? [] : campaignDTO.segments,
          step: campaignDTO.step === null ? 0 : campaignDTO.step,
          html: campaignDTO.html === null ? {} : campaignDTO.html,
          htmlTemplate,
          goal: campaignDTO.goal,
          budget: campaignDTO.budget,
          startDate: campaignDTO.startDate,
          endDate: campaignDTO.endDate,
          createdBy: idUser,
          idStatus: status.id,
          idProgram,
        },
        { transaction: t }
      );

      const discounts = campaignDTO.discounts;
      await discountService.addDiscounts(campaign.id, idCompany, discounts, 'marketing', t);
      await t.commit();

      await this.registerKpisByCampaign(campaign, campaignDTO.kpis);
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async updateCampaign(idCompany, campaignDTO) {
    const t = await sequelize.transaction();
    try {
      const id = campaignDTO.id;
      let statusValue = 'bulk';
      if (campaignDTO.step === CAMPAIGN_STEP_SEND_TO_PENDING) {
        statusValue = 'pending';
      }
      const status = await campaignStatusService.get(statusValue);

      let htmlTemplate = campaignDTO?.htmlTemplate ? campaignDTO.htmlTemplate : '';
      if (htmlTemplate !== '') {
        htmlTemplate.replace(/(\r\n|\n|\r)/gm, '');
      }

      await Campaign.update(
        {
          name: campaignDTO.name,
          lists: campaignDTO.lists === null ? [] : campaignDTO.lists,
          segments: campaignDTO.segments === null ? [] : campaignDTO.segments,
          step: campaignDTO.step === null ? 0 : campaignDTO.step,
          html: campaignDTO.html === null ? {} : campaignDTO.html,
          htmlTemplate,
          goal: campaignDTO.goal,
          budget: campaignDTO.budget,
          startDate: campaignDTO.startDate,
          endDate: campaignDTO.endDate,
          idStatus: status.id,
        },
        { where: { id }, transaction: t }
      );
      await discountService.updateDiscounts(idCompany, campaignDTO, 'marketing', t);
      await t.commit();

      await this.updateKpisByCampaign(id, campaignDTO.kpis);
    } catch (e) {
      await t.rollback();
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

      let htmlTemplate = campaignDTO?.htmlTemplate ? campaignDTO.htmlTemplate : '';
      if (htmlTemplate !== '') {
        htmlTemplate.replace(/(\r\n|\n|\r)/gm, '');
      }

      await Campaign.update(
        {
          name: campaignDTO.name,
          lists: campaignDTO.lists === null ? [] : campaignDTO.lists,
          segments: campaignDTO.segments === null ? [] : campaignDTO.segments,
          step: campaignDTO.step === null ? 0 : campaignDTO.step,
          html: campaignDTO.html === null ? {} : campaignDTO.html,
          htmlTemplate,
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
      await discountService.updateDiscounts(idCompany, campaignDTO, 'marketing', t);
      await this.addUsersToCampaign(campaign, campaignDTO.assigned, t);
      await this.executeSegments(idCompany, campaign, t);
      await t.commit();

      await this.updateKpisByCampaign(campaignDTO.id, campaignDTO.kpis);
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async registerKpisByCampaign(campaign, kpis) {
    for (const idKPI of kpis) {
      await campaign.addKpi(idKPI, { through: 'campaignsxkpi' });
    }
  }

  async updateKpisByCampaign(idCampaign, kpis) {
    const campaign = await Campaign.findByPk(idCampaign);
    await campaign.setKpis([]);
    await this.registerKpisByCampaign(campaign, kpis);
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
          {
            model: User,
            as: 'creator',
            attributes: ['id'],
            include: [{ model: Company, as: 'company' }],
          },
        ],
        where: {
          idStatus: status.id,
          sent: false,
          active: true,
        },
      });

      for (const campaign of campaigns) {
        await mailService.sendCampaign(campaign, campaign.creator.company);
      }

      const campaignsId = campaigns.map((campaign) => campaign.id);
      await Campaign.update(
        {
          sent: true,
          sentAt: new Date(),
        },
        { where: { id: campaignsId } }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async sendCampaign(idCampaign) {
    try {
      const campaign = await Campaign.findOne({
        attributes: ['id', 'name', 'html', 'htmlTemplate'],
        include: [
          {
            model: Lead,
            as: 'leads',
            attributes: ['id', 'name', 'lastName', 'email'],
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id'],
            include: [{ model: Company, as: 'company' }],
          },
        ],
        where: {
          id: idCampaign,
          active: true,
        },
      });
      await mailService.sendCampaign(campaign, campaign.creator.company);
      await Campaign.update(
        {
          sent: true,
          sentAt: new Date(),
        },
        { id: campaign.id }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async increaseSpendings(idCampaign, amount) {
    try {
      await Campaign.increment({ waste: amount }, { where: { id: idCampaign } });
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async excludeLeadOfCampaign(idCampaign, idLead) {
    try {
      await Campaign.increment({ numRecessions: 1 }, { where: { id: idCampaign } });
      await leadService.excludeLead(idLead);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateFidelization(idDeal) {
    try {
      const deal = await dealService.getDealByIdSimple(idDeal);
      if (deal.idCampaign) {
        const leadPromoted = await leadService.convertClient(deal.contact.lead.id);
        if (leadPromoted) {
          await Campaign.increment(
            { numConversions: 1, clientsGenerated: 1 },
            { where: { id: deal.idCampaign } }
          );
        }
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getCampaignCPL(idCampaign) {
    try {
      const campaign = await Campaign.findByPk(idCampaign);
      const leads = await campaign.getLeads();
      const budget = campaign?.budget ?? 0;
      const waste = campaign?.waste ?? 0;
      const stats = {
        budget,
        waste,
        usagePercentage: budget > 0 ? (waste / budget) * 100 : 0,
        leadsQty: leads.length,
        cpl: waste > 0 ? leads.length / waste : 0,
      };
      return stats;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getCampaignROI(idCampaign) {
    try {
      let amountWon = 0;
      const campaign = await Campaign.findByPk(idCampaign);
      const deals = await campaign.getDeals();
      for (const deal of deals) {
        if (deal.realCloseDate) {
          amountWon += deal.realAmount;
        }
      }

      const waste = campaign?.waste ?? 0;

      const stats = {
        amountWon,
        waste,
        dealsQty: deals.length,
        roi: waste > 0 ? (amountWon - waste) / waste : 0,
      };
      return stats;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getCampaignFidelization(idCampaign) {
    try {
      const campaign = await Campaign.findByPk(idCampaign);
      const leads = await campaign.getLeads();
      const numLeads = leads.length;
      const numConversions = campaign?.numConversions ?? 0;
      const numRecessions = campaign?.numRecessions ?? 0;

      const stats = {
        numLeads,
        numConversions,
        numRecessions,
        clientsGenerated: campaign?.clientsGenerated ?? 0,
        conversionsPercentage: numLeads > 0 ? (numConversions / numLeads) * 100 : 0,
        recessionsPercentage: numLeads > 0 ? (numRecessions / numLeads) * 100 : 0,
      };
      return stats;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = CampaignService;
