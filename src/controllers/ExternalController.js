const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const FormService = require('../services/FormService');
const formService = new FormService();

const addLeadByForm = async (req, res) => {
  const { idForm, lead } = req.body;
  await formService.addLead(idForm, lead);
  res.status(StatusCodes.OK).json({ message: 'Ha sido registrado correctamente' });
};

const getFormSimple = async (req, res) => {
  const { idForm } = req.params;
  const form = await formService.getFormSimple(idForm);
  if (!form) {
    throw new NotFoundError('No se puede acceder al formulario');
  }
  res.status(StatusCodes.OK).json(form);
};

module.exports = {
  addLeadByForm,
  getFormSimple,
};
