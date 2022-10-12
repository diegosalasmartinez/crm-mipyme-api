const { StatusCodes } = require('http-status-codes');
const ListService = require('../services/ListService');
const listService = new ListService();

const getLists = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await listService.getLists(
    idCompany,
    page,
    rowsPerPage
  );
  res.status(StatusCodes.OK).json({ data, count });
};

const getListDetail = async (req, res) => {
  const { idList } = req.params;
  const list = await listService.getListById(idList);
  res.status(StatusCodes.OK).json(list);
};

const addList = async (req, res) => {
  const { id: idUser } = req.user;
  const list = req.body;
  const listCreated = await listService.addList(idUser, list);
  res.status(StatusCodes.OK).json(listCreated);
};

const addLeadsToList = async (req, res) => {
  const { idList, leadsId } = req.body;
  await listService.addLeadsToList(idList, leadsId);
  res.status(StatusCodes.OK).json({
    message: 'Se agregaron los clientes potenciales a la lista',
  });
};

module.exports = {
  getLists,
  getListDetail,
  addList,
  addLeadsToList,
};
