const { faker } = require('@faker-js/faker');
const moment = require('moment');
const {
  Deal,
  DealStep,
  DealOrigin,
  DealPriority,
  User,
  Contact,
  ClassificationSales,
  Lead,
  Activity,
  ActivityType,
  ActivityStatus,
  Quotation,
  QuotationDetail,
  QuotationStatus,
  LostType,
  Note,
  sequelize,
} = require('../models/index');
const { generateChartLabels, truncateText } = require('../utils');
const { validateRoles } = require('../utils/permissions');
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
const ActivityStatusService = require('./ActivityStatusService');
const activityStatusService = new ActivityStatusService();

class DealService {
  async getDeals(idUser, idCompany, roles) {
    try {
      const assignedRules = {};
      if (!validateRoles(roles, ['admin', 'admin_sales'])) {
        assignedRules['$contact.assigned.id$'] = idUser;
      }

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
                  required: Object.keys(assignedRules).length !== 0,
                  where: {
                    idCompany,
                    ...assignedRules,
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
          order: [['expectedCloseDate', 'ASC']],
        });
        data.push(deals);
      }
      return data;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getDealsSimple(idCompany) {
    try {
      const deals = await Deal.findAll({
        include: [
          {
            model: Contact,
            as: 'contact',
            attributes: ['id'],
            required: true,
            include: [
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
            model: Activity,
            as: 'activities',
            include: [
              {
                model: ActivityStatus,
                as: 'status',
              },
            ],
          },
          {
            model: LostType,
            as: 'lostType',
          },
          {
            model: DealOrigin,
            as: 'origin',
          },
          {
            model: Quotation,
            as: 'quotations',
            include: [
              {
                model: QuotationDetail,
                as: 'detail',
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
            model: Note,
            as: 'notes',
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'lastName'],
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
          { model: DealOrigin, as: 'origin' },
        ],
        order: [[{ model: Quotation, as: 'quotations' }, 'createdAt', 'DESC']],
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
        attributes: ['id', 'name', 'idCampaign', 'idTicket'],
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
              {
                model: ClassificationSales,
                as: 'classificationSales',
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

  async addDeal(idUser, idContact, dealDTO, idCampaign, idTicket, t) {
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
          idTicket,
          idCampaign,
          createdBy: idUser,
        },
        { transaction: t }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateDeal(dealDTO) {
    try {
      const priority = await dealPriorityService.get(dealDTO.priority);

      await Deal.update(
        {
          name: dealDTO.name,
          expectedAmount: dealDTO.expectedAmount,
          expectedCloseDate: dealDTO.expectedCloseDate,
          description: dealDTO.description,
          idPriority: priority.id,
        },
        { where: { id: dealDTO.id } }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async rejectQuotation(idQuotation) {
    const t = await sequelize.transaction();
    try {
      const step = await dealStepService.get('rejected');
      const deal = await quotationService.rejectQuotation(idQuotation, t);
      await Deal.update({ idStep: step.id }, { where: { id: deal.id }, transaction: t });
      t.commit();
    } catch (e) {
      t.rollback();
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
        await this.setTotalAmount(deal.id, t);
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

  async setTotalAmount(idDeal, t) {
    try {
      const total = await quotationService.getTotalSalesAcceptedQuotation(idDeal);
      await Deal.update(
        { realAmount: total, realCloseDate: new Date() },
        { where: { id: idDeal }, transaction: t }
      );
    } catch (e) {
      t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async dashboard(idCompany) {
    try {
      const deals = await this.getDealsSimple(idCompany);

      // Sales stats
      const numDeals = deals.length;
      const winStep = await dealStepService.get('won');
      const lostStep = await dealStepService.get('lost');
      let wonQty = 0;
      let wonAmount = 0;
      let lostQty = 0;
      let lostAmount = 0;
      const originSales = await dealOriginService.get('sales');
      const originTicket = await dealOriginService.get('ticket');
      const salesOriginSales = generateChartLabels();
      const salesOriginMarketing = generateChartLabels();
      const salesOriginTicket = generateChartLabels();

      // Deal generation
      const dealsChartLabels = generateChartLabels();
      const salesChartLabels = generateChartLabels();

      // Products
      const topProducts = {};

      // Activity stats
      let numActivities = 0;
      let avgTime = 0;
      let onTime = 0;
      let late = 0;
      let closedStatus = await activityStatusService.get('closed');

      // Rejection stats
      const rejectionValues = {};

      for (const deal of deals) {
        const k = moment(deal.createdAt).format('YYYY-MM').slice(0, 7);
        // Group by created at
        if (dealsChartLabels[k]) {
          dealsChartLabels[k] = {
            value: dealsChartLabels[k].value + 1,
            name: dealsChartLabels[k].name,
          };
        }

        if (deal.realCloseDate) {
          const kAux = moment(deal.realCloseDate).format('YYYY-MM').slice(0, 7);
          if (salesChartLabels[kAux]) {
            salesChartLabels[kAux] = {
              value: salesChartLabels[kAux].value + 1,
              name: salesChartLabels[kAux].name,
            };
          }
        }

        // Group by win or lost
        if (deal.idStep === winStep.id) {
          wonQty++;
          wonAmount += deal.realAmount;
          const dateKey = moment(deal.realCloseDate).format('YYYY-MM').slice(0, 7);
          if (deal.idOrigin === originSales.id && salesOriginSales[dateKey]) {
            salesOriginSales[dateKey] = {
              value: salesOriginSales[dateKey].value + deal.realAmount,
              name: salesOriginSales[dateKey].name,
            };
          } else if (deal.idOrigin === originTicket.id && salesOriginTicket[dateKey]) {
            salesOriginTicket[dateKey] = {
              value: salesOriginTicket[dateKey].value + deal.realAmount,
              name: salesOriginTicket[dateKey].name,
            };
          } else if (salesOriginMarketing[dateKey]) {
            salesOriginMarketing[dateKey] = {
              value: salesOriginMarketing[dateKey].value + deal.realAmount,
              name: salesOriginMarketing[dateKey].name,
            };
          }
          const products = await quotationService.getProductsOfQuotationAccepted(deal.id);
          products.forEach((product) => {
            if (topProducts[product.code]) {
              topProducts[product.code] = {
                value: topProducts[product.code].value + 1,
                name: topProducts[product.code].name,
              };
            } else {
              topProducts[product.code] = {
                value: 1,
                name: product.name,
              };
            }
          });
        } else if (deal.idStep === lostStep.id) {
          lostQty++;
          lostAmount += deal.expectedAmount ?? 0;
          if (rejectionValues[deal.lostType.name]) {
            rejectionValues[deal.lostType.name] = rejectionValues[deal.lostType.name] + 1;
          } else {
            rejectionValues[deal.lostType.name] = 1;
          }
        }
        // Group by activity
        numActivities += deal.activities.length;
        deal.activities.map((activity) => {
          const startDate = moment(activity.startDate);
          const endDate = moment(activity.endDate);
          avgTime += moment.duration(endDate.diff(startDate)).asDays();
          if (activity.idStatus === closedStatus.id) onTime++;
        });
      }

      const data = Object.entries(dealsChartLabels)
        .map((entry) => entry[1].value)
        .reverse();
      const data2 = Object.entries(salesChartLabels)
        .map((entry) => entry[1].value)
        .reverse();
      const label = Object.entries(dealsChartLabels)
        .map((entry) => entry[1].name)
        .reverse();
      const dealGeneration = { data, data2, label };

      const rejections = {
        data: Object.entries(rejectionValues).map((entry) => entry[1]),
        label: Object.entries(rejectionValues).map((entry) => entry[0]),
      };

      const originLabels = Object.entries(dealsChartLabels)
        .map((entry) => entry[1].name)
        .reverse();
      const originSalesData = Object.entries(salesOriginSales)
        .map((entry) => Math.round(entry[1].value * 100) / 100)
        .reverse();

      const originMarketingData = Object.entries(salesOriginMarketing)
        .map((entry) => Math.round(entry[1].value * 100) / 100)
        .reverse();
      const originTicketsData = Object.entries(salesOriginTicket)
        .map((entry) => Math.round(entry[1].value * 100) / 100)
        .reverse();

      const origins = {
        label: originLabels,
        series: [
          {
            name: 'Captación de ventas',
            data: originSalesData,
          },
          {
            name: 'Campañas de marketing',
            data: originMarketingData,
          },
          {
            name: 'Solicitudes de servicio',
            data: originTicketsData,
          },
        ],
      };

      const topProductsFiltered = Object.entries(topProducts)
        .map((entry) => ({ code: entry[0], ...entry[1] }))
        .sort((a, b) => (b.value > a.value ? 1 : a.value > b.value ? -1 : 0))
        .slice(0, 10);

      const sales = {
        numDeals,
        wonQty,
        wonAmount,
        lostQty,
        lostAmount,
      };

      const activities = {
        numActivities,
        avgTime,
        onTime,
        late,
      };

      return {
        sales,
        dealGeneration,
        activities,
        rejections,
        origins,
        topProducts: topProductsFiltered,
      };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async seed_addDeals(idUser, number, contacts) {
    try {
      const origin = await dealOriginService.get('sales');
      const step = await dealStepService.getDefault();
      const contactsIds = contacts.map((contact) => contact.id);

      for (let i = 0; i < number; i++) {
        const priority = await dealPriorityService.get(
          faker.helpers.arrayElement(['low', 'medium', 'high'])
        );

        await Deal.create({
          name: truncateText(faker.commerce.productDescription()),
          expectedAmount: faker.finance.amount(),
          expectedCloseDate: faker.date.past(),
          description: '',
          idOrigin: origin.id,
          idStep: step.id,
          idPriority: priority.id,
          idContact: faker.helpers.arrayElement(contactsIds),
          createdBy: idUser,
          createdAt: faker.date.past(),
        });
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DealService;
