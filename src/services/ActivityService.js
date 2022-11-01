const {
  Activity,
  ActivityStatus,
  ActivityType,
  Deal,
  Ticket,
  Contact,
  Lead,
  User,
  Note,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const ActivityTypeService = require('./ActivityTypeService');
const activityTypeService = new ActivityTypeService();
const ActivityStatusService = require('./ActivityStatusService');
const { Op } = require('sequelize');
const activityStatusService = new ActivityStatusService();

class ActivityService {
  async getActivities(idUser, idCompany, completed = 'false') {
    try {
      const types = await activityTypeService.getAll();
      const statusClosed = await activityStatusService.get('closed');
      const whereClause = {};
      if (completed === 'true') {
        whereClause[Op.eq] = statusClosed.id;
      } else {
        whereClause[Op.ne] = statusClosed.id;
      }

      const data = [];
      for (const type of types) {
        const activities = await Activity.findAll({
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
              include: [
                {
                  model: Contact,
                  as: 'contact',
                  include: [
                    {
                      model: Lead,
                      as: 'lead',
                    },
                  ],
                },
              ],
            },
            {
              model: Ticket,
              as: 'ticket',
              include: [
                {
                  model: Contact,
                  as: 'contact',
                  include: [
                    {
                      model: Lead,
                      as: 'lead',
                    },
                  ],
                },
              ],
            },
            {
              model: ActivityStatus,
              as: 'status',
            },
          ],
          where: {
            idType: type.id,
            idStatus: whereClause,
            active: true,
          },
          order: [
            ['endDate', 'ASC'],
            ['updatedAt', 'DESC'],
          ],
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
        include: [
          {
            model: User,
            as: 'creator',
            required: true,
          },
          {
            model: Deal,
            as: 'deal',
            include: [
              {
                model: Contact,
                as: 'contact',
                include: [
                  {
                    model: Lead,
                    as: 'lead',
                  },
                ],
              },
            ],
          },
          {
            model: Ticket,
            as: 'ticket',
            include: [
              {
                model: Contact,
                as: 'contact',
                include: [
                  {
                    model: Lead,
                    as: 'lead',
                  },
                ],
              },
            ],
          },
          {
            model: Note,
            as: 'notes',
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'lastName'],
              },
            ],
          },
          {
            model: ActivityStatus,
            as: 'status',
          },
          {
            model: ActivityType,
            as: 'type',
          },
        ],
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

  async addActivity(idUser, idDeal, idTicket, activityDTO) {
    try {
      const type = await activityTypeService.get(activityDTO.type);
      const status = await activityStatusService.getDefault();
      await Activity.create({
        name: activityDTO.name,
        startDate: activityDTO.startDate,
        endDate: activityDTO.endDate,
        createdBy: idUser,
        idType: type.id,
        idStatus: status.id,
        idDeal,
        idTicket,
      });
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateActivity(idActivity, statusValue) {
    try {
      const updateValues = {};
      if (statusValue === 'pending') {
        updateValues.realStartDate = new Date();
      } else if (statusValue === 'closed') {
        updateValues.realEndDate = new Date();
      }

      const status = await activityStatusService.get(statusValue);
      await Activity.update(
        {
          idStatus: status.id,
          ...updateValues,
        },
        { where: { id: idActivity } }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ActivityService;
