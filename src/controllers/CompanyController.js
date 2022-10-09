const { StatusCodes } = require("http-status-codes");
const CompanyService = require("../services/CompanyService")

const getCompanyByAdmin = async (req, res) => {
  const { idCompany } = req.user
  const companyService = new CompanyService();
  const company = await companyService.getCompanyById(idCompany)
  res.status(StatusCodes.OK).json(company)
}

module.exports = {
  getCompanyByAdmin,
}
