const path = require('path');
const moment = require('moment');

class QuotationPdfReport {
  constructor(doc, quotation, contact, company) {
    this.y = 0;
    this.doc = doc;
    this.quotation = quotation;
    this.contact = contact;
    this.company = company;
  }

  generate() {
    this.generateHeader();
    this.generateContactInfo();
    this.generateQuotationsTable();
    this.generateRules();
    this.generateFooter();
  }

  generateHeader() {
    this.doc
      .image(path.join(__dirname, '..', 'assets', 'logo.png'), 50, 35, { width: 40 })
      .fillColor('#444444')
      .font('Times-Bold')
      .fontSize(18)
      .text(this.company.name, 110, 45)
      .font('Helvetica')
      .fontSize(10)
      .text(`Cotización: ${this.company.id}`, 200, 50, { align: 'right' })
      .text(this.company.address, 200, 65, { align: 'right' })
      .moveDown();
  }

  generateContactInfo() {
    let x = 50;
    const xGap = 250;
    this.y = 120;

    this.doc
      .fillColor('#444444')
      .font('Times-Bold')
      .fontSize(18)
      .text('Detalle de la cotización', 50, this.y)
      .moveDown();
    this.y += 25;

    this.generateHr(this.doc);

    this.y += 15;
    this.doc
      .font('Helvetica')
      .fontSize(10)
      .text('Contacto:', x, this.y)
      .font('Helvetica-Bold')
      .text(`${this.contact.lead.name} ${this.contact.lead.lastName}`, x + 100, this.y)
      .font('Helvetica')
      .text('Vendedor:', x + xGap, this.y)
      .font('Helvetica-Bold')
      .text(
        `${this.contact.assigned.name} ${this.contact.assigned.lastName}`,
        x + xGap + 100,
        this.y
      )
      .moveDown();

    this.y += 15;
    this.doc
      .font('Helvetica')
      .fontSize(10)
      .text('Válido desde:', x, this.y)
      .font('Helvetica-Bold')
      .text(moment(this.quotation.startDate).format('DD/MM/YYYY'), x + 100, this.y)
      .font('Helvetica')
      .text('Válido hasta:', x + xGap, this.y)
      .font('Helvetica-Bold')
      .text(moment(this.quotation.limitDate).format('DD/MM/YYYY'), x + xGap + 100, this.y)
      .moveDown();
    this.y += 25;

    this.generateHr();
    this.y += 40;
  }

  generateQuotationsTable() {
    this.doc.font('Helvetica-Bold');
    this.generateTableRow(
      'SKU',
      'Producto',
      'Costo unitario',
      'Cantidad',
      'Precio total',
      'Descuento',
      'Total'
    );
    this.y += 17;

    this.generateHr();

    let totalPrice = 0;
    this.doc.font('Helvetica').moveDown();
    for (const item of this.quotation.detail) {
      this.y += 15;
      this.generateTableRow(
        item.product.code,
        item.product.name,
        this.formatCurrency(item.unitPrice),
        item.quantity,
        this.formatCurrency(item.totalPrice),
        `${item.discount} %`,
        this.formatCurrency(item.finalPrice),
      );
      this.y += 17;

      this.generateHr();
      totalPrice += item.finalPrice;
    }

    this.y += 15;
    this.doc.font('Helvetica-Bold').moveDown();
    this.generateTableRow('', '', '', '', '', 'Monto final', this.formatCurrency(totalPrice));
    this.y += 40;
  }

  generateTableRow(code, item, unitCost, quantity, lineTotal, discount, total) {
    this.doc
      .fontSize(10)
      .text(code, 50, this.y)
      .text(item, 110, this.y)
      .text(unitCost, 190, this.y, { width: 90, align: 'right' })
      .text(quantity, 250, this.y, { width: 90, align: 'right' })
      .text(lineTotal, 320, this.y, { width: 90, align: 'right' })
      .text(discount, 390, this.y, { width: 90, align: 'right' })
      .text(total, 0, this.y, { align: 'right' })
      .moveDown();
  }

  generateRules() {
    const rules = this.company?.quotationRules ? this.company.quotationRules : '';
    this.doc.font('Helvetica').fontSize(10).text(rules, 50, this.y, {
      align: 'justify',
    });
  }

  generateFooter() {
    this.doc
      .fontSize(10)
      .text('Generada a través de CRMipyme. Gracias por confiar en nosotros.', 50, 775, {
        align: 'center',
        width: 500,
      });
  }

  formatCurrency(money) {
    return "S/. " + ((money / 100)*100).toFixed(2);
  }

  generateHr() {
    this.doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, this.y)
      .lineTo(550, this.y)
      .stroke()
      .moveDown();
  }
}

module.exports = QuotationPdfReport;
