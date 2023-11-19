import PDFDocument from 'pdfkit';
import { PdfData } from '../../types/pdfData.interface';
import { PdfOrderData } from '../../types/pdfORderData.interface';
import fs from 'fs';
import path from 'path';

class PdfGenerator {
    private doc: PDFKit.PDFDocument;

    constructor(fontName: string) {
        const fontPath = path.join(__dirname, `../../resources/fonts/${fontName}.ttf`);
        this.doc = new PDFDocument({font: fontPath});
    }

    public async createOrderPdf(data: PdfOrderData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                let buffers: Buffer[] = [];

                this.doc.on('data', buffers.push.bind(buffers));
                this.doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });
                this.doc.on('error', reject);

                this.preparePdfContent(data);

                this.doc.end();
            } catch (error: unknown) {
                console.log(error);
                reject(error);
            }
        });
    }

    private preparePdfContent(data: PdfOrderData): void {
        this.doc.fontSize(15).text(data.title, { align: 'center' });
        this.doc.fontSize(12);
        this.doc.text("Client: ")
        this.doc.moveDown()
        this.doc.text(data.order.client.name + " " + data.order.client.surname);
        this.doc.moveDown()
    }
}

export default PdfGenerator