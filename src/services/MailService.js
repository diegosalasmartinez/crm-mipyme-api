const { transporter } = require('../config/MailConfig');
const { decode } = require('html-entities');
const { BadRequestError } = require('../errors');
require('dotenv').config();

class MailService {
  async sendCampaign(campaign, company) {
    try {
      const htmlDecoded = decode(campaign.htmlTemplate);

      for (const lead of campaign.leads) {
        await transporter.sendMail({
          from: `${company.name} <${company.email}>`,
          to: lead.email,
          subject: campaign.name,
          html: htmlDecoded,
        });
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async sendInfoToUser(ticket, finished) {
    try {
      const company = ticket.creator.company;
      const lead = ticket.contact.lead;
      const text = finished
        ? `Estimado ${lead.name}, su solicitud se ha procesado satisfactoriamente. Un colaborador se comunicará con usted en breve.`
        : `Estimado ${lead.name}, su solicitud está siendo revisada. Cuando finalice el proceso le notificaremos.`;

      await transporter.sendMail({
        from: `${company.name} <${company.email}>`,
        to: lead.email,
        subject: `Actualización de la solicitud ${ticket.name}`,
        text
      });
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = MailService;
