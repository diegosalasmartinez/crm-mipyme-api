const { BadRequestError } = require('../errors');
const { sequelize } = require('../models/index');
const { Company, User } = require('../models/index');

class CompanyService {
  async registerCompanyAccount(companyDTO, userDTO) {
    const t = await sequelize.transaction();
    try {
      const company = await Company.create(
        {
          name: companyDTO.name,
          email: companyDTO.email,
          address: companyDTO.address,
        },
        { transaction: t }
      );
      const userBulk = await User.build({
        name: userDTO.name,
        lastName: userDTO.lastName,
        email: userDTO.email,
        password: userDTO.password,
        companyId: company.id,
      });
      await userBulk.setPassword();
      const user = await userBulk.save({ transaction: t });
      await t.commit();

      return user;
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(
        'No se pudo registrar la empresa correctamente.'
      );
    }
  }
}

module.exports = CompanyService;
