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
}

module.exports = CompanyService;
