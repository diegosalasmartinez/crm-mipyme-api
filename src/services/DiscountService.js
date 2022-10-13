const { Discount } = require('../models/index');
const { BadRequestError } = require('../errors');
const ProductService = require('./ProductService')
const productService = new ProductService()

class DiscountService {
  async addDiscount(idCampaign, idCompany, data, type) {
    try {
      for (const row of data) {
        console.log(new Date(row['Inicio']))
        const product = await productService.getProductBySku(idCompany, row['SKU'])
        await Discount.create({
          idCampaign,
          idProduct: product.id,
          type,
          discount: row['Descuento'],
          // startDate: new Date(row['Inicio']),
          // endDate: new Date(row['Fin']),
        })
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DiscountService;
