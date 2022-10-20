const { Ticket, TicketType, User, Contact, Lead } = require('../models/index');
const { BadRequestError } = require('../errors');
const TicketTypeService = require('./TicketTypeService');
const ticketTypeService = new TicketTypeService();

class TicketService {
  async getTickets(idCompany) {
    try {
      const data = await Ticket.findAll({
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
        ],
        where: {
          active: true,
        },
        order: [['createdAt', 'DESC']],
      });
      return data;
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
          // {
          //   model: Activity,
          //   as: 'activities',
          //   include: [
          //     {
          //       model: ActivityType,
          //       as: 'type',
          //     },
          //   ],
          // },
          {
            model: TicketType,
            as: 'type',
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
    try {
      const type = await ticketTypeService.getDefault();
      const ticket = await Ticket.create({
        name: ticketDTO.name,
        description: ticketDTO.description,
        limitDate: ticketDTO.limitDate,
        idType: type.id,
        createdBy: idUser,
        assignedTo: ticketDTO.assignedTo,
        idContact: ticketDTO.idContact,
      });
      return ticket;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = TicketService;
