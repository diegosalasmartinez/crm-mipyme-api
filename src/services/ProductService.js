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
