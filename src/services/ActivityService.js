const { Activity, ActivityStatus, Deal, User } = require('../models/index');
const { BadRequestError } = require('../errors');
const ActivityTypeService = require('./ActivityTypeService');
const activityTypeService = new ActivityTypeService();
const ActivityStatusService = require('./ActivityStatusService');
const activityStatusService = new ActivityStatusService();

class ActivityService {
  async getActivities(idUser, idCompany) {
    try {
      const types = await activityTypeService.getAll();
      const data = [];
      for (const type of types) {
        const activities = await Activity.findAll({
          required: true,
          include: [
            {
              model: User,
              as: 'creator',
              required: true,
              where: {
                idCompany,
              },
            },
            {
              model: Deal,
              as: 'deal',
              required: true,
            },
            {
              model: ActivityStatus,
              as: 'status',
            },
          ],
          where: {
            idType: type.id,
            active: true,
          },
          order: [['createdAt', 'DESC']],
        });
        data.push(activities);
      }
      return data;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getActivityById(id) {
    try {
      const activity = await Activity.findOne({
        required: true,
        where: {
          id,
          active: true,
        },
        order: [['createdAt', 'DESC']],
      });
      return activity;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addActivity(idUser, idDeal, activityDTO) {
    try {
      const type = await activityTypeService.get(activityDTO.type);
      const status = await activityStatusService.getDefault();
      await Activity.create({
        name: activityDTO.name,
        startDate: activityDTO.startDate,
        endDate: activityDTO.endDate,
        notes: activityDTO.notes,
        createdBy: idUser,
        idType: type.id,
        idStatus: status.id,
        idDeal,
      });
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ActivityService;
