const { transporter } = require('../config/MailConfig');
const { decode } = require('html-entities');
const { BadRequestError } = require('../errors');
require('dotenv').config();

class MailService {
  async sendMail(campaign, company) {
    try {
      const htmlDecoded = decode(campaign.htmlTemplate);
      const position = htmlDecoded.indexOf('</body');

      for (const lead of campaign.leads) {
        const imageTag = `<img src="${process.env.MAIL_HOST}/${campaign.id}/${lead.id}" alt="track_visit" width="1" height="1">`;
        const htmlFormatted = [
          htmlDecoded.slice(0, position),
          imageTag,
          htmlDecoded.slice(position),
        ].join('');

        await transporter.sendMail({
          from: `${company.name} <${company.email}>`,
          to: lead.email,
          subject: campaign.name,
          html: htmlFormatted,
        });
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = MailService;
