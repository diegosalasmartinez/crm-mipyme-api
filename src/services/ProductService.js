const { Product } = require('../models/index');
const { BadRequestError } = require('../errors');
const { faker } = require('@faker-js/faker');

class ProductService {
  async getProducts(idCompany, page = 0, rowsPerPage = 10) {
    try {
      const { rows: data = [], count } = await Product.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        where: {
          idCompany,
          active: true,
        },
        order: [['createdAt', 'DESC']],
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getProductBySku(idCompany, sku) {
    try {
      const product = await Product.findOne({
        where: {
          idCompany,
          code: sku,
          active: true,
        },
      });
      return product;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getProductsByLead(quotations) {
    try {
      const topProductsMap = {};
      for (const quotation of quotations) {
        for (const item of quotation.detail) {
          const product = item.product;
          if (topProductsMap[product.code]) {
            topProductsMap[product.code] = {
              ...topProductsMap[product.code],
              qty: topProductsMap[product.code].value + 1,
            };
          } else {
            topProductsMap[product.code] = {
              qty: 1,
              value: product.toJSON(),
            };
          }
        }
      }
      const topProducts = Object.entries(topProductsMap)
        .map((entry) => ({ qty: entry[1].qty, ...entry[1].value }))
        .sort((a, b) => (b.qty > a.qty ? 1 : a.qty > b.qty ? -1 : 0))
        .slice(0, 10);

      return topProducts;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addProduct(idCompany, productDTO) {
    try {
      const product = await Product.create({
        ...productDTO,
        idCompany,
      });
      return product;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async seed_addLeads(idCompany, number) {
    try {
      const productsInfo = [];
      for (let i = 0; i < number; i++) {
        const info = {
          name: faker.commerce.productName(),
          code: faker.random.alphaNumeric(7),
          unitPrice: faker.commerce.price(),
          stock: faker.random.numeric(3),
          idCompany,
        };
        productsInfo.push(info);
      }
      await Product.bulkCreate(productsInfo);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ProductService;
