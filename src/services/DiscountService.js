const { Discount } = require('../models/index');
const { BadRequestError } = require('../errors');
const DiscountTypeService = require('./DiscountTypeService');
const discountTypeService = new DiscountTypeService();
const ProductService = require('./ProductService');
const productService = new ProductService();

class DiscountService {
  async addDiscounts(idCampaign, idCompany, data, typeKey) {
    try {
      const type = await discountTypeService.get(typeKey);

      for (const row of data) {
        const startDate = row.startDate;
        const endDate = row.endDate;

        const product = await productService.getProductBySku(
          idCompany,
          row.code
        );
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
}

module.exports = DiscountService;
