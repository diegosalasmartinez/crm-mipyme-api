const {
  Quotation,
  QuotationDetail,
  QuotationStatus,
  Deal,
  Contact,
  Lead,
  User,
  Product,
  sequelize,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const QuotationStatusService = require('./QuotationStatusService');
const quotationStatusService = new QuotationStatusService();
const QuotationDetailService = require('./QuotationDetailService');
const quotationDetailService = new QuotationDetailService();
const DealStepService = require('./DealStepService');
const dealStepService = new DealStepService();

class QuotationService {
  async getQuotations(idCompany, status) {
    try {
      const { rows: data = [], count } = await Quotation.findAndCountAll({
        required: true,
        include: [
          {
            model: Deal,
            as: 'deal',
            include: [
              {
                model: Contact,
                as: 'contact',
                attributes: ['id'],
                include: [
                  { model: Lead, as: 'lead', attributes: ['id', 'name', 'lastName'] },
                  {
                    model: User,
                    as: 'assigned',
                    attributes: ['id', 'name', 'lastName'],
                    where: { idCompany },
                  },
                ],
              },
            ],
          },
          {
            model: QuotationDetail,
            as: 'detail',
            include: [{ model: Product, as: 'product', attributes: ['id', 'code', 'name'] }],
          },
          {
            model: QuotationStatus,
            as: 'status',
            where: {
              key: status,
            },
          },
        ],
        where: {
          active: true,
        },
        order: [['createdAt', 'DESC']],
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

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

  async getQuotationById(id) {
    try {
      const quotation = await Quotation.findOne({
        include: [
          {
            model: Deal,
            as: 'deal',
            include: [
              {
                model: Contact,
                as: 'contact',
                attributes: ['id'],
                include: [
                  { model: Lead, as: 'lead', attributes: ['id', 'name', 'lastName'] },
                  { model: User, as: 'assigned', attributes: ['id', 'name', 'lastName'] },
                ],
              },
            ],
          },
          {
            model: QuotationDetail,
            as: 'detail',
            include: [{ model: Product, as: 'product', attributes: ['id', 'code', 'name'] }],
          },
          {
            model: QuotationStatus,
            as: 'status',
          },
        ],
        where: {
          id,
          active: true,
        },
      });
      return quotation;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

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
      await quotationDetailService.addQuotationDetail(
        idCompany,
        quotation.id,
        quotationDTO.items,
        t
      );
      await t.commit();
      return quotation;
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async updateQuotation(idCompany, quotation) {
    const t = await sequelize.transaction();
    try {
      await Quotation.update(
        {
          startDate: quotation.startDate,
          limitDate: quotation.limitDate,
          notes: quotation.notes,
        },
        { where: { id: quotation.id }, transaction: t }
      );

      await quotationDetailService.updateQuotationDetail(
        idCompany,
        quotation.id,
        quotation.items,
        t
      );
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async sendQuotationsToNewStep(quotationsId, stepValue, t) {
    try {
      const status = await quotationStatusService.get(stepValue);
      await Quotation.update(
        { idStatus: status.id },
        { where: { id: quotationsId }, transaction: t }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async approveQuotation(quotation) {
    const t = await sequelize.transaction();
    try {
      const quotationStatus = await quotationStatusService.get('approved');
      await Quotation.update({ idStatus: quotationStatus.id }, { where: { id: quotation.id }, transaction: t });
      const quotationStored = await Quotation.findByPk(quotation.id)
      const deal = await quotationStored.getDeal()
      const step = await dealStepService.get('negotiations');
      await Deal.update({ idStep: step.id }, { where: { id: deal.id }, transaction: t });
      t.commit();
    } catch (e) {
      t.rollback();
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = QuotationService;
