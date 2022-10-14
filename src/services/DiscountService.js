const { Discount } = require('../models/index');
const moment = require('moment');
const { BadRequestError } = require('../errors');
const ProductService = require('./ProductService');
const productService = new ProductService();

class DiscountService {
  async addDiscounts(idCampaign, idCompany, data, type) {
    try {
      for (const row of data) {
        // console.log(row['Inicio'])
        // console.log(moment(row['Inicio'], 'DD/MM/YYYY'))
        // console.log(moment(row['Inicio'], 'DD/MM/YYYY').toDate());

        // const startDate = moment(row['Inicio'], 'DD/MM/YYYY').toDate();
        // const endDate = moment(row['Fin'], 'DD/MM/YYYY').toDate();
        const startDate = row.startDate;
        const endDate = row.endDate;

        const product = await productService.getProductBySku(
          idCompany,
          row.code
        );
        await Discount.create({
          idCampaign,
          idProduct: product.id,
          type,
          discount: row.discount,
          startDate: startDate,
          endDate: endDate,
        });
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateDiscounts(idCompany, campaign, type) {
    try {
      const idCampaign = campaign.id;
      const discounts = campaign.discounts;

      await Discount.destroy({ where: { idCampaign } });
      await this.addDiscounts(idCampaign, idCompany, discounts, type)

    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DiscountService;
