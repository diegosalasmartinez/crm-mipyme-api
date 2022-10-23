const { StatusCodes } = require('http-status-codes');
const ActivityService = require('../services/ActivityService');
const activityService = new ActivityService();

// const getActivities = async (req, res) => {
//   const { id: idUser, idCompany } = req.user;
//   // Cambiar a get all activities by user
//   const data = await activityService.getActivities()
//   res.status(StatusCodes.OK).json(data);
// };

const addActivity = async (req, res) => {
  const { idDeal, activity } = req.body;
  await activityService.addActivity(idDeal, activity);
  res.status(StatusCodes.OK).json({
    message: `La actividad ${activity.name} ha sido registrada`,
  });
};

module.exports = {
  addActivity,
};
