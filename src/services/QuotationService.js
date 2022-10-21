const { Op } = require('sequelize');
const { faker } = require('@faker-js/faker');
const { Quotation, QuotationDetail, Deal, sequelize } = require('../models/index');
const { BadRequestError } = require('../errors');
const QuotationStatusService = require('./QuotationStatusService');
const quotationStatusService = new QuotationStatusService();
const QuotationDetailService = require('./QuotationDetailService');
const quotationDetailService = new QuotationDetailService();

class QuotationService {
  // async getQuotations(idCompany, page = 0, rowsPerPage = 10) {
  //   try {
  //     const { rows: data = [], count } = await Quotation.findAndCountAll({
  //       offset: page * rowsPerPage,
  //       limit: rowsPerPage,
  //       attributes: ['id', 'name', 'lastName', 'email', 'birthday', 'phone', 'birthday', 'companyName', 'createdAt'],
  //       required: true,
  //       include: [
  //         {
  //           model: User,
  //           as: 'creator',
  //           where: { idCompany },
  //           attributes: [],
  //         },
  //         {
  //           model: ClassificationMarketing,
  //           as: 'classificationMarketing',
  //           attributes: ['key', 'name'],
  //         },
  //       ],
  //       where: {
  //         active: true,
  //       },
  //       order: [['createdAt', 'DESC']],
  //     });
  //     return { data, count };
  //   } catch (e) {
  //     throw new BadRequestError(e.message);
  //   }
  // }

  // async getQuotationByIdSimple(id) {
  //   try {
  //     const lead = await Quotation.findOne({
  //       where: {
  //         id,
  //         active: true,
  //       },
  //     });
  //     return lead;
  //   } catch (e) {
  //     throw new BadRequestError(e.message);
  //   }
  // }

  // async getQuotationById(id) {
  //   try {
  //     const lead = await Quotation.findOne({
  //       include: [
  //         {
  //           model: List,
  //           as: 'lists',
  //           include: [{ model: Quotation, as: 'leads', attributes: ['id'] }],
  //         },
  //         {
  //           model: ClassificationMarketing,
  //           as: 'classificationMarketing',
  //           attributes: ['key', 'name'],
  //         },
  //       ],
  //       where: {
  //         id,
  //         active: true,
  //       },
  //     });
  //     return lead;
  //   } catch (e) {
  //     throw new BadRequestError(e.message);
  //   }
  // }

  async addQuotation(idCompany, quotationDTO) {
    const t = await sequelize.transaction();
    try {
      const status = await quotationStatusService.getDefault();
      const quotation = await Quotation.create(
        {
          idDeal: quotationDTO.idDeal,
          idStatus: status.id,
          startDate: quotationDTO.startDate,
          limitDate: quotationDTO.limitDate,
          notes: quotationDTO.notes,
        },
        { transaction: t }
      );
      await quotationDetailService.addQuotationDetail(idCompany, quotation.id, quotationDTO.items, t);
      await t.commit();
      return quotation;
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = QuotationService;
