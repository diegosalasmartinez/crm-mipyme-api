const PDFDocument = require('pdfkit');
const MailService = require('./MailService');
const mailService = new MailService();

class PdfService {
  async generateQuotationPDF(quotation, dataCallback, endCallback) {
    const doc = new PDFDocument();
    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    doc.fontSize(25).text(`Cotizacion ${quotation.id}`, 100, 100);
    doc.end();
  }

  async sendQuotationPDF(quotation, contact, company) {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      await mailService.sendPDFToContact(pdfData, contact, company);
    });

    doc.fontSize(25).text(`Cotizacion ${quotation.id}`, 100, 100);
    doc.end();
  }
}

module.exports = PdfService;
