const PDFDocument = require('pdfkit');
const MailService = require('./MailService');
const mailService = new MailService();
const QuotationPdfReport = require('../reports/QuotationPdfReport');

class PdfService {
  async generateQuotationPDF(quotation, contact, company, dataCallback, endCallback) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    const quotationReport = new QuotationPdfReport(doc, quotation, contact, company);
    quotationReport.generate();
    doc.end();
  }

  async sendQuotationPDF(quotation, contact, company) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      await mailService.sendPDFToContact(pdfData, contact, company);
    });

    const quotationReport = new QuotationPdfReport(doc, quotation, contact, company);
    quotationReport.generate();
    doc.end();
  }
}

module.exports = PdfService;
