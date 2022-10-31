const cron = require('node-cron');
const { Op } = require('sequelize');
const { Discount, Product, Campaign, User, Lead } = require('../models/index');
const { BadRequestError } = require('../errors');
const DiscountTypeService = require('./DiscountTypeService');
const discountTypeService = new DiscountTypeService();
const ProductService = require('./ProductService');
const productService = new ProductService();
const DealService = require('./DealService');
const dealService = new DealService();

cron.schedule(
  '45 12 * * *',
  async function () {
    try {
      const discountService = new DiscountService();
      await discountService.updateDiscountsStatus();
    } catch (e) {
      console.error(e.message);
    }
  },
  {
    scheduled: true,
    timezone: 'America/Lima',
  }
);

class DiscountService {
  async getDiscounts(idCompany, page = 0, rowsPerPage = 10) {
    try {
      const { rows: data = [], count } = await Discount.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        required: true,
        include: [
          {
            model: Product,
            as: 'product',
          },
          {
            model: Campaign,
            as: 'campaign',
            attributes: ['id', 'name'],
          },
        ],
        where: {
          status: '1',
          '$product.idCompany$': idCompany,
        },
        order: [['createdAt', 'DESC']],
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addDiscounts(idCampaign, idCompany, data, typeKey) {
    try {
      const type = await discountTypeService.get(typeKey);

      for (const row of data) {
        const startDate = row.startDate;
        const endDate = row.endDate;

        const product = await productService.getProductBySku(idCompany, row.code);
        if (product) {
          await Discount.create({
            idCampaign,
            idProduct: product.id,
            idType: type.id,
            discount: row.discount,
            startDate: startDate,
            endDate: endDate,
          });
        }
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateDiscounts(idCompany, campaign, typeKey) {
    try {
      const idCampaign = campaign.id;
      const discounts = campaign.discounts;

      await Discount.destroy({ where: { idCampaign } });
      await this.addDiscounts(idCampaign, idCompany, discounts, typeKey);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getAvailableDiscountsByDeal(idDeal, idCompany) {
    try {
      const deal = await dealService.getDealByIdSimple(idDeal);
      const discounts = await Discount.findAll({
        required: true,
        include: [
          {
            model: Product,
            as: 'product',
          },
          {
            model: Campaign,
            as: 'campaign',
            attributes: ['id', 'name'],
            include: [
              {
                model: User,
                as: 'creator',
                attributes: [],
              },
              {
                model: Lead,
                as: 'leads',
                attributes: [],
              },
            ],
          },
        ],

        where: {
          status: '1',
          '$campaign.creator.idCompany$': idCompany,
          '$campaign.leads.id$': deal.contact.lead.id,
        },
        order: [['createdAt', 'DESC']],
      });
      return discounts;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateDiscountsStatus() {
    try {
      await Discount.update(
        { status: '2' },
        {
          where: {
            status: '1',
            endDate: {
              [Op.lt]: new Date(),
            },
          },
        }
      );
      await Discount.update(
        { status: '1' },
        {
          where: {
            status: '0',
            startDate: {
              [Op.lte]: new Date(),
            },
          },
        }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DiscountService;
