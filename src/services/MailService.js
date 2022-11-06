const { transporter } = require('../config/MailConfig');
const { decode } = require('html-entities');
const { BadRequestError } = require('../errors');
require('dotenv').config();

class MailService {
  async sendMail(campaign, company) {
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
}

module.exports = MailService;
