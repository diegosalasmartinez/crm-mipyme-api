const { Discount } = require('../models/index');
const moment = require('moment')
const { BadRequestError } = require('../errors');
const ProductService = require('./ProductService')
const productService = new ProductService()

class DiscountService {
  async addDiscount(idCampaign, idCompany, data, type) {
    try {
      for (const row of data) {
        const startDate = moment(row['Inicio'], "DD/MM/YYYY")
        const endDate = moment(row['Fin'], "DD/MM/YYYY")

        const product = await productService.getProductBySku(idCompany, row['SKU'])
        await Discount.create({
          idCampaign,
          idProduct: product.id,
          type,
          discount: row['Descuento'],
          startDate: startDate,
          endDate: endDate
        })
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DiscountService;
