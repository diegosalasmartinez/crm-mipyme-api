const { transporter } = require('../config/MailConfig');
const { decode } = require('html-entities');
const { BadRequestError } = require('../errors');

class MailService {
  async sendMail(campaign, company) {
    try {
      console.log(company);
      const htmlDecoded = decode(campaign.htmlTemplate);
      const position = htmlDecoded.indexOf('</body');

      for (const lead of campaign.leads) {
        const imageTag = `<img src="${process.env.MAIL_HOST}/${campaign.id}/${lead.id}">`;
        const htmlFormatted = [
          htmlDecoded.slice(0, position),
          imageTag,
          htmlDecoded.slice(position),
        ].join('');

        await transporter.sendMail({
          from: '"CRM MiPYME" <diesalasmart@gmail.com>',
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
