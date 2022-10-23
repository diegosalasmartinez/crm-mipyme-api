const { QuotationDetail } = require('../models/index');
const { BadRequestError } = require('../errors');
const ProductService = require('./ProductService');
const productService = new ProductService();

class QuotationService {
  async addQuotationDetail(idCompany, idQuotation, detail, t) {
    try {
      for (const item of detail) {
        const product = await productService.getProductBySku(idCompany, item.code);
        await QuotationDetail.create(
          {
            idQuotation: idQuotation,
            idProduct: product.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            discount: item.discount,
            finalPrice: item.finalPrice,
          },
          { transaction: t }
        );
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateQuotationDetail(idCompany, idQuotation, detail, t) {
    try {
      await QuotationDetail.destroy({ where: { idQuotation }, transaction: t });
      await this.addQuotationDetail(idCompany, idQuotation, detail, t);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = QuotationService;
