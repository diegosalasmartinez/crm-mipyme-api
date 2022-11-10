const { StatusCodes } = require('http-status-codes');
const ListService = require('../services/ListService');
const listService = new ListService();

const getLists = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await listService.getLists(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const getListDetail = async (req, res) => {
  const { idList } = req.params;
  const list = await listService.getListById(idList);
  const stats = await listService.getListStats(list);
  res.status(StatusCodes.OK).json({ list, stats });
};

const getAvailableLeads = async (req, res) => {
  const { idList } = req.params;
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await listService.getAvailableLeads(idCompany, idList, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const getLeadsOfList = async (req, res) => {
  const { idList } = req.params;
  const { page, rowsPerPage } = req.query;
  const leads = await listService.getLeadsByList(idList, page, rowsPerPage);
  res.status(StatusCodes.OK).json(leads);
};

const addList = async (req, res) => {
  const { id: idUser } = req.user;
  const list = req.body;
  await listService.addList(idUser, list);
  res.status(StatusCodes.OK).json({ message: `La lista ${list.name} ha sido registrada` });
};

const addLeadsToList = async (req, res) => {
  const { idList, leadsId } = req.body;
  await listService.addLeadsToList(idList, leadsId);
  res.status(StatusCodes.OK).json({
    message: 'Se agregaron los clientes potenciales a la lista',
  });
};

const removeLeadFromList = async (req, res) => {
  const { idList, idLead } = req.body;
  await listService.removeLeadFromList(idList, idLead);
  res.status(StatusCodes.OK).json({
    message: 'El cliente se retiró de la lista',
  });
};

module.exports = {
  getLists,
  getAvailableLeads,
  getListDetail,
  getLeadsOfList,
  addList,
  addLeadsToList,
  removeLeadFromList,
};
