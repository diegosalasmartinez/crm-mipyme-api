const moment = require('moment');
const {
  Plan,
  Program,
  Campaign,
  Company,
  Lead,
  ClassificationMarketing,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const ProgramService = require('./ProgramService');
const programService = new ProgramService();
const LeadService = require('./LeadService');
const leadService = new LeadService();
const { generateChartLabels } = require('../utils');

class PlanService {
  async getPlan(idCompany) {
    try {
      const plan = await Plan.findOne({
        required: true,
        include: [
          {
            model: Company,
            as: 'company',
            attributes: [],
            where: { id: idCompany },
          },
          {
            model: Program,
            as: 'programs',
            attributes: ['id', 'name', 'createdAt'],
            include: [
              {
                model: Campaign,
                as: 'campaigns',
                attributes: ['id', 'numConversions'],
                include: [
                  {
                    model: Lead,
                    as: 'leads',
                    attributes: ['id'],
                    include: [
                      {
                        model: ClassificationMarketing,
                        as: 'classificationMarketing',
                      },
                    ],
                  },
                ],
              },
            ],
            order: [['updatedAt', 'DESC']],
          },
        ],
        where: {
          active: true,
        },
      });
      return plan;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addPlan(idCompany, planDTO) {
    try {
      const plan = await Plan.create({
        ...planDTO,
        idCompany,
      });
      return plan;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getPlanStats(plan) {
    try {
      let numConversions = 0;
      let numDeals = 0;
      let sales = 0;
      let distribution = [0, 0, 0, 0];
      let numCampaigns = 0;

      for (let program of plan.programs) {
        const stats = await programService.getProgramStats(program);
        numConversions += stats.numConversions;
        numDeals += stats.numDeals;
        sales += stats.sales;
        numCampaigns += stats.numCampaigns;
        distribution = distribution.map(function (num, idx) {
          return num + stats.distribution[idx];
        });
      }
      return { numConversions, numDeals, sales, numCampaigns, distribution };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async dashboard(idCompany) {
    try {
      const company = await this.getPlan(idCompany);
      const { numCampaigns, numDeals, numConversions, sales } = await this.getPlanStats(company);

      // Lead generation
      const chartLabels = generateChartLabels();
      const leads = await leadService.getAllLeads(idCompany);

      // Lead distribution
      const distributionKeys = {
        started: 0,
        ready_marketing: 0,
        marketing_engaged: 0,
        ready_sales: 0,
      };

      leads.forEach((lead) => {
        const k = moment(lead.createdAt).format('YYYY-MM').slice(0, 7);
        const classification = lead.classificationMarketing.key;
        distributionKeys[classification] = (distributionKeys[classification] || 0) + 1;
        if (chartLabels[k]) {
          chartLabels[k] = { value: chartLabels[k].value + 1, name: chartLabels[k].name };
        }
      });

      const distribution = Object.keys(distributionKeys).map((key) => distributionKeys[key]);

      const data = Object.entries(chartLabels)
        .map((entry) => entry[1].value)
        .reverse();
      const label = Object.entries(chartLabels)
        .map((entry) => entry[1].name)
        .reverse();
      const leadGeneration = { data, label };

      const opportunities = {
        numCampaigns,
        numDeals,
        numConversions,
        sales,
      };

      return { opportunities, distribution, leadGeneration };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = PlanService;
