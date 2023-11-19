import PDFDocument from 'pdfkit';
import { PdfData } from '../../types/pdfData.interface';

class PdfGenerator {
    static async createPdfDocument(data: PdfData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            let buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', reject);

            doc.fontSize(25).text(data.title, { align: 'center' });
            doc.fontSize(12);
            data.items.forEach(item => {
                doc.text(item);
                doc.moveDown(0.5);
            });

            doc.end();
        });
    }
}

export default PdfGenerator