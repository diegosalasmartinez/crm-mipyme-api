const { StatusCodes } = require('http-status-codes');
const FormService = require('../services/FormService');
const formService = new FormService();

const getForms = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await formService.getForms(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const getFormDetail = async (req, res) => {
  const { idForm } = req.params;
  const form = await formService.getFormById(idForm);
  res.status(StatusCodes.OK).json(form);
};

const getFormSimple = async (req, res) => {
  const { idForm } = req.params;
  const form = await formService.getFormSimple(idForm);
  res.status(StatusCodes.OK).json(form);
};

const addForm = async (req, res) => {
  const { idCompany } = req.user;
  const form = req.body;
  await formService.addForm(idCompany, form);
  res.status(StatusCodes.OK).json({ message: `El formulario ${form.name} ha sido registrado` });
};

const updateForm = async (req, res) => {
  const form = req.body;
  await formService.updateForm(form);
  res.status(StatusCodes.OK).json({ message: `El formulario ${form.name} ha sido actualizado` });
};

const seed_addForms = async (req, res) => {
  const { idCompany } = req.user;
  const { forms } = req.body;
  await formService.seed_addForms(idCompany, forms);
  res.status(StatusCodes.OK).json({ message: 'Done' });
};

const seed_addLeadsByForm = async (req, res) => {
  const { idForm, number } = req.query;
  await formService.seed_addLeadsByForm(idForm, number);
  res.status(StatusCodes.OK).json({ message: 'Done' });
};

module.exports = {
  getForms,
  getFormDetail,
  getFormSimple,
  addForm,
  updateForm,
  seed_addForms,
  seed_addLeadsByForm,
};
