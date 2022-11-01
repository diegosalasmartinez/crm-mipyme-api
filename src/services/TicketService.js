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
  Contact,
  Lead,
  Note,
  sequelize,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const DealService = require('./DealService');
const dealService = new DealService();
const TicketTypeService = require('./TicketTypeService');
const ticketTypeService = new TicketTypeService();
const TicketPriorityService = require('./TicketPriorityService');
const ticketPriorityService = new TicketPriorityService();
const TicketStatusService = require('./TicketStatusService');
const ticketStatusService = new TicketStatusService();

class TicketService {
  async getTickets(idCompany) {
    try {
      const { rows: data = [], count } = await Ticket.findAndCountAll({
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
        },
        order: [['createdAt', 'DESC']],
      });
      return { data, count };
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

  async updateStatus(idTicket, statusValue) {
    try {
      const status = await ticketStatusService.get(statusValue);
      const updateValues = {};
      if (statusValue === 'pending') {
        updateValues.startDate = new Date();
      } else if (statusValue === 'closed') {
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
}

module.exports = TicketService;
