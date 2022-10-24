const { StatusCodes } = require('http-status-codes');
const ActivityService = require('../services/ActivityService');
const activityService = new ActivityService();

const getActivities = async (req, res) => {
  const { id: idUser, idCompany } = req.user;
  const activities = await activityService.getActivities(idUser, idCompany);
  res.status(StatusCodes.OK).json(activities);
};

const getActivity = async (req, res) => {
  const { idActivity } = req.params;
  const activity = await activityService.getActivityById(idActivity);
  res.status(StatusCodes.OK).json(activity);
};

const addActivity = async (req, res) => {
  const { id: idUser } = req.user;
  const { idDeal, idTicket, activity } = req.body;
  await activityService.addActivity(idUser, idDeal, idTicket, activity);
  res.status(StatusCodes.OK).json({
    message: `La actividad ${activity.name} ha sido registrada`,
  });
};

const updateActivity = async (req, res) => {
  const { idActivity, status } = req.body;
  await activityService.updateActivity(idActivity, status);
  res.status(StatusCodes.OK).json({
    message: `La actividad ha sido actualizada`,
  });
};

module.exports = {
  getActivities,
  getActivity,
  addActivity,
  updateActivity,
};
