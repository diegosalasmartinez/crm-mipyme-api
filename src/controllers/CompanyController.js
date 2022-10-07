const { StatusCodes } = require("http-status-codes");
const CompanyService = require("../services/CompanyService")

const getCompanyByAdmin = async (req, res) => {
  const { companyId } = req.user
  const companyService = new CompanyService();
  const company = await companyService.getCompanyById(companyId)
  res.status(StatusCodes.OK).json(company)
}

module.exports = {
  getCompanyByAdmin,
}
