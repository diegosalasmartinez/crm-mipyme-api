const { Activity, Deal } = require('../models/index');
const { BadRequestError } = require('../errors');
const ActivityTypeService = require('./ActivityTypeService');
const activityTypeService = new ActivityTypeService();

class ActivityService {
  async getActivities(idDeal) {
    try {
      const types = await activityTypeService.getAll();
      const data = [];
      for (const step of types) {
        const activities = await Activity.findAll({
          required: true,
          include: [
            {
              model: Deal,
              as: 'deal',
              required: true,
              where: {
                id: idDeal,
              },
            },
          ],
          where: {
            idStep: step.id,
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

  async addActivity(idDeal, activityDTO) {
    try {
      const type = await activityTypeService.get(activityDTO.type);
      await Activity.create({
        name: activityDTO.name,
        startDate: activityDTO.startDate,
        endDate: activityDTO.endDate,
        notes: activityDTO.notes,
        idType: type.id,
        idDeal,
      });
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ActivityService;
