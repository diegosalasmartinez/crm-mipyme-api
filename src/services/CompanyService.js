const { Company } = require('../models/index');
const { BadRequestError } = require('../errors');

class CompanyService {
  async addCompany(companyDTO, t) {
    const company = await Company.create(
      {
        name: companyDTO.name,
        email: companyDTO.email,
        address: companyDTO.address,
      },
      { transaction: t }
    );
    return company;
  }

  async getCompanyById(id) {
    try {
      const company = await Company.findOne({
        where: { id, active: true },
      });
      return company;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateCompany(id, companyDTO) {
    try {
      const { name, email, address, quotationRules } = companyDTO;
      await Company.update(
        {
          name,
          email,
          address,
          quotationRules,
        },
        {
          where: { id },
        }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = CompanyService;
