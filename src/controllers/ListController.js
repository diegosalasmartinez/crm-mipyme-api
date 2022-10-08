const { StatusCodes } = require('http-status-codes');
const ListService = require('../services/ListService');

const getLists = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query;
  const { companyId } = req.user;
  const listService = new ListService();
  const { lists, count } = await listService.getLists(
    companyId,
    page,
    rowsPerPage
  );
  res.status(StatusCodes.OK).json({ data: lists, count });
};

const getListDetail = async (req, res) => {
  console.log(req);
  const { idList } = req.params;
  const listService = new ListService();
  const list = await listService.getListById(idList);
  res.status(StatusCodes.OK).json(list);
};

const addList = async (req, res) => {
  const { companyId } = req.user;
  const list = req.body;
  const listService = new ListService(companyId, list);
  const listCreated = await listService.addList(companyId, list);
  res.status(StatusCodes.OK).json(listCreated);
};

module.exports = {
  getLists,
  getListDetail,
  addList,
};
