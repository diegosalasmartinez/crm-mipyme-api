const { Op } = require('sequelize');
const moment = require('moment');
const {
  Ticket,
  TicketType,
  TicketPriority,
  TicketStatus,
  Activity,
  ActivityStatus,
  ActivityType,
  Deal,
  DealStep,
  DealPriority,
  User,
  Company,
  Contact,
  Lead,
  Note,
  sequelize,
} = require('../models/index');
const { generateChartLabels } = require('../utils');
const { validateRoles } = require('../utils/permissions');
const { BadRequestError } = require('../errors');
const DealService = require('./DealService');
const dealService = new DealService();
const DealStepService = require('./DealStepService');
const dealStepService = new DealStepService();
const TicketTypeService = require('./TicketTypeService');
const ticketTypeService = new TicketTypeService();
const TicketPriorityService = require('./TicketPriorityService');
const ticketPriorityService = new TicketPriorityService();
const TicketStatusService = require('./TicketStatusService');
const ticketStatusService = new TicketStatusService();
const UserService = require('./UserService');
const userService = new UserService();
const MailService = require('./MailService');
const mailService = new MailService();

class TicketService {
  async getTickets(idCompany, page = 0, rowsPerPage = 10, finished = false) {
    try {
      const status = await ticketStatusService.get('closed');
      const whereRules = {};
      if (finished === 'true') {
        whereRules.idStatus = {
          [Op.eq]: status.id,
        };
      } else {
        whereRules.idStatus = {
          [Op.ne]: status.id,
        };
      }

      const { rows: data = [], count } = await Ticket.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        required: false,
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
            model: Contact,
            as: 'contact',
            include: [
              {
                model: Lead,
                as: 'lead',
              },
            ],
          },
          {
            model: TicketType,
            as: 'type',
          },
          {
            model: TicketPriority,
            as: 'priority',
          },
          {
            model: TicketStatus,
            as: 'status',
          },
        ],
        where: {
          active: true,
          ...whereRules,
        },
        order: [['limitDate', 'ASC']],
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getTicketsSimple(idCompany) {
    try {
      const tickets = await Ticket.findAll({
        required: false,
        include: [
          {
            model: User,
            as: 'creator',
            required: false,
            attributes: ['id', 'name', 'lastName'],
            where: {
              idCompany,
            },
          },
          {
            model: Activity,
            as: 'activities',
            attributes: ['startDate', 'realStartDate', 'endDate', 'realEndDate', 'createdAt'],
          },
          {
            model: Deal,
            as: 'deal',
            include: [
              {
                model: Activity,
                as: 'activities',
                attributes: ['startDate', 'realStartDate', 'endDate', 'realEndDate', 'createdAt'],
              },
            ],
          },
          {
            model: TicketType,
            as: 'type',
          },
          {
            model: TicketStatus,
            as: 'status',
          },
        ],
        where: {
          active: true,
        },
      });
      return tickets;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getTicketById(id) {
    try {
      const ticket = await Ticket.findOne({
        required: true,
        include: [
          {
            model: User,
            as: 'creator',
          },
          {
            model: User,
            as: 'assigned',
          },
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
          {
            model: TicketType,
            as: 'type',
          },
          {
            model: TicketPriority,
            as: 'priority',
          },
          {
            model: TicketStatus,
            as: 'status',
          },
          {
            model: Deal,
            as: 'deal',
            include: [
              {
                model: Contact,
                as: 'contact',
                attributes: ['id'],
                required: true,
                include: [
                  {
                    model: Lead,
                    as: 'lead',
                    attributes: ['id', 'name', 'lastName'],
                  },
                ],
              },
              {
                model: DealStep,
                as: 'step',
              },
              {
                model: DealPriority,
                as: 'priority',
              },
            ],
          },
          {
            model: Activity,
            as: 'activities',
            include: [
              {
                model: ActivityType,
                as: 'type',
              },
              {
                model: ActivityStatus,
                as: 'status',
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
        ],
        where: {
          id,
          active: true,
        },
        order: [['createdAt', 'DESC']],
      });
      return ticket;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addTicket(idUser, ticketDTO) {
    const t = await sequelize.transaction();

    try {
      const type = await ticketTypeService.get(ticketDTO.type);
      const priority = await ticketPriorityService.get(ticketDTO.priority);
      const status = await ticketStatusService.getDefault();

      const ticket = await Ticket.create(
        {
          name: ticketDTO.name,
          description: ticketDTO.description,
          limitDate: ticketDTO.limitDate,
          idType: type.id,
          idPriority: priority.id,
          idStatus: status.id,
          createdBy: idUser,
          assignedTo: ticketDTO.assignedTo,
          idContact: ticketDTO.idContact,
        },
        { transaction: t }
      );

      if (ticketDTO.type === 'quotation') {
        const deal = {
          origin: 'ticket',
          priority: ticketDTO.priority,
          name: ticketDTO.name,
          expectedCloseDate: ticketDTO.limitDate,
          description: ticketDTO.description,
        };
        await dealService.addDeal(idUser, ticketDTO.idContact, deal, null, ticket.id, t);
      }

      t.commit();

      return ticket;
    } catch (e) {
      t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async getTicketInfoToEmail(idTicket) {
    try {
      const tickets = await Ticket.findOne({
        required: false,
        attributes: ['id', 'name'],
        include: [
          {
            model: User,
            as: 'creator',
            required: false,
            attributes: ['id', 'name', 'lastName'],
            include: [{ model: Company, as: 'company', attributes: ['name', 'email'] }],
          },
          {
            model: User,
            as: 'assigned',
            required: false,
            attributes: ['id', 'name', 'lastName'],
          },
          {
            model: Contact,
            as: 'contact',
            required: false,
            include: [{ model: Lead, as: 'lead', attributes: ['name', 'email'] }],
          },
        ],
        where: {
          id: idTicket,
          active: true,
        },
      });
      return tickets;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateStatus(idTicket, statusValue) {
    try {
      const status = await ticketStatusService.get(statusValue);
      const updateValues = {};
      if (statusValue === 'pending') {
        const ticket = await this.getTicketInfoToEmail(idTicket);
        await mailService.sendInfoToUser(ticket, false);
        updateValues.startDate = new Date();
      } else if (statusValue === 'closed') {
        const ticket = await this.getTicketInfoToEmail(idTicket);
        await mailService.sendInfoToUser(ticket, true);
        updateValues.endDate = new Date();
      }
      await Ticket.update({ idStatus: status.id, ...updateValues }, { where: { id: idTicket } });
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateStatusInBaseOfDeal(idDeal, stepValue) {
    try {
      const deal = await dealService.getDealByIdSimple(idDeal);
      if (deal.idTicket) {
        if (stepValue === 'quoted') {
          await this.updateStatus(deal.idTicket, 'pending');
        } else if (stepValue === 'won' || stepValue === 'lost') {
          await this.updateStatus(deal.idTicket, 'closed');
        }
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async dashboard(idCompany) {
    try {
      const tickets = await this.getTicketsSimple(idCompany);

      // Sales stats
      const numTickets = tickets.length;
      const winStep = await dealStepService.get('won');
      let numQuestions = 0;
      let numQuotations = 0;
      let wonAmount = 0;

      // Ticket generation
      const chartLabels = generateChartLabels();

      // Ticket stats
      let timeToStart = 0;
      let numStarted = 0;
      let timeToFinish = 0;
      let numFinished = 0;

      // Origins
      const originTypes = {};

      for (const ticket of tickets) {
        const k = moment(ticket.createdAt).format('YYYY-MM').slice(0, 7);

        // Group by created at
        if (chartLabels[k]) {
          chartLabels[k] = { value: chartLabels[k].value + 1, name: chartLabels[k].name };
        }

        // Group by win or lost
        if (ticket.deal && ticket.deal.idStep === winStep.id) {
          wonAmount += ticket.deal.realAmount;
        }

        const createdAt = moment(ticket.createdAt);
        if (ticket.startDate) {
          numStarted++;
          const startDate = moment(ticket.startDate);
          timeToStart += moment.duration(startDate.diff(createdAt)).asSeconds();
        }
        if (ticket.endDate) {
          numFinished++;
          const startDate = moment(ticket.startDate);
          const endDate = moment(ticket.endDate);
          timeToFinish += moment.duration(endDate.diff(startDate)).asSeconds();
        }

        // Group by type
        if (originTypes[ticket.type.name]) {
          originTypes[ticket.type.name] = originTypes[ticket.type.name] + 1;
        } else {
          originTypes[ticket.type.name] = 1;
        }

        if (ticket.type.key === 'question') {
          numQuestions++;
        } else {
          numQuotations++;
        }
      }

      const data = Object.entries(chartLabels)
        .map((entry) => entry[1].value)
        .reverse();
      const label = Object.entries(chartLabels)
        .map((entry) => entry[1].name)
        .reverse();
      const ticketGeneration = { data, label };

      const origins = {
        data: Object.entries(originTypes).map((entry) => entry[1]),
        label: Object.entries(originTypes).map((entry) => entry[0]),
      };

      const events = {
        numTickets,
        numQuotations,
        wonAmount,
        numQuestions,
      };

      const performance = {
        numStarted,
        timeToStart: numStarted > 0 ? timeToStart / numStarted : 0,
        numFinished,
        timeToFinish: numFinished > 0 ? timeToFinish / numFinished : 0,
      };

      return {
        events,
        ticketGeneration,
        performance,
        origins,
      };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async performanceUsers(idCompany) {
    try {
      const arrUsers = [];
      const users = await userService.getAllUsers(idCompany);
      for (const user of users) {
        const tickets = await user.getTickets({
          include: [
            { model: TicketType, as: 'type' },
            { model: Activity, as: 'activities' },
            {
              model: Deal,
              as: 'deal',
              include: [
                {
                  model: Activity,
                  as: 'activities',
                  attributes: ['startDate', 'realStartDate', 'endDate', 'realEndDate', 'createdAt'],
                },
              ],
            },
          ],
        });

        if (
          tickets.length === 0 &&
          !validateRoles(user.roles, ['admin', 'admin_services', 'services'])
        ) {
          continue;
        }

        let numTickets = tickets.length;
        let timeToStart = 0;
        let timeToFinish = 0;
        let numPending = 0;
        let numStarted = 0;
        let numFinished = 0;
        let numLate = 0;
        let numQuestions = 0;
        let numQuotations = 0;
        let numActivities = 0;

        for (const ticket of tickets) {
          const createdAt = moment(ticket.createdAt);
          if (ticket.startDate) {
            numStarted++;
            const startDate = moment(ticket.startDate);
            timeToStart += moment.duration(startDate.diff(createdAt)).asSeconds();
          } else {
            numPending++;
          }
          if (ticket.endDate) {
            numFinished++;
            const startDate = moment(ticket.startDate);
            const endDate = moment(ticket.endDate);
            timeToFinish += moment.duration(endDate.diff(startDate)).asSeconds();
          }
          if (ticket.startDate && !ticket.endDate) {
            numLate += moment(ticket.limitDate).isBefore(ticket.endDate) ? 1 : 0;
          }

          if (ticket.type.key === 'question') {
            numQuestions++;
          } else {
            numQuotations++;
          }

          let activities = ticket.deal ? ticket.deal.activities : ticket.activities;
          numActivities = activities.length;
        }

        const userJSON = user.toJSON();
        userJSON.numTickets = numTickets;
        userJSON.numPending = numPending;
        userJSON.numStarted = numStarted;
        userJSON.numFinished = numFinished;
        userJSON.numLate = numLate;
        userJSON.numQuestions = numQuestions;
        userJSON.numQuotations = numQuotations;
        userJSON.timeToStart = numStarted > 0 ? timeToStart / numStarted : numStarted;
        userJSON.timeToFinish = numFinished > 0 ? timeToFinish / numFinished : numFinished;
        userJSON.numActivities = numActivities;
        arrUsers.push(userJSON);
      }
      return arrUsers;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async reassignTicket(idTicket, idUser) {
    try {
      await Ticket.update(
        {
          assignedTo: idUser,
        },
        { where: { id: idTicket } }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = TicketService;
