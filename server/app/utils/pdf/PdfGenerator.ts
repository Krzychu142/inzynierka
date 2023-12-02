import PDFDocument from 'pdfkit';
import { PdfOrderData } from '../../types/pdfOrderData.interface';
import path from 'path';
import { IOrderProduct } from '../../types/orderProduct.interface';
import { IClient } from '../../types/client.interface';

class PdfGenerator {
    private doc: PDFKit.PDFDocument;

    constructor(fontName: string) {
        const fontPath = path.join(__dirname, `../../resources/fonts/${fontName}.ttf`);
        this.doc = new PDFDocument({font: fontPath});
    }

    private registerNewFont(fontName: string) {
        const fontPath = path.join(__dirname, `../../resources/fonts/${fontName}.ttf`);
        this.doc.registerFont(fontName, fontPath)
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
        this.drawClient(data.order.client)
        this.drawProducts(data.order.products)
        this.drawSummary(data.order.products)
    }

    private drawClient(client: IClient): void {
        this.registerNewFont('Roboto-Bold')
        this.doc.fontSize(14).font('Roboto-Bold').text("Client: ")
        this.doc.moveDown()
        this.doc.font('Roboto-Regular')
        this.doc.fontSize(12);
        this.doc.text(client.name + " " + client.surname);
        this.doc.moveDown(0.2)
        this.doc.text(client.email)
        this.doc.moveDown(0.2)
        this.doc.text(client.phoneNumber)
        this.doc.moveDown(0.2)
        const address = client.shippingAddress ? client.shippingAddress : 
                        client.address + " " + client.postalCode + " " + client.city + " " + client.country;
        this.doc.text(address);
        this.doc.moveDown()
    }

    private drawProducts(products: IOrderProduct[]): void {
        this.registerNewFont('Roboto-Bold')
        this.doc.fontSize(14).font('Roboto-Bold').text(products.length > 1 ? "Products:" : "Product:");
        this.doc.moveDown()
        this.doc.fontSize(12);
        this.doc.font('Roboto-Regular')

        products.forEach((product) => {
            this.doc.text(product.product.name )
            this.doc.moveDown(0.2)
            this.doc.text(`Quantity: ${product.quantity.toString()}`)
            this.doc.moveDown(0.2)
            this.doc.text(product.product.sku)
            this.doc.moveDown(0.2)
            this.doc.text("Price per one: " + product.priceAtOrder + ` ${product.currencyAtOrder}`)
            this.doc.moveDown(0.2)
            this.doc.text("Total cost of product: " + (product.priceAtOrder * product.quantity).toFixed(2) + ` ${product.currencyAtOrder}`);
            this.doc.moveDown()
        })
    }

    private getTotalCostOfOrder(products: IOrderProduct[]): string {
        type ICostByCurrency = Record<string, number>;
        const costByCurrency = products.reduce((acc: ICostByCurrency, product) => {
            const { currencyAtOrder, priceAtOrder, quantity } = product;
            if (!acc[currencyAtOrder]) {
                acc[currencyAtOrder] = 0;
            }
            acc[currencyAtOrder] += priceAtOrder * quantity;
            return acc;
        }, {} as ICostByCurrency);

        return Object.entries(costByCurrency)
            .map(([currency, total]) => `${total.toFixed(2)} ${currency}`)
            .join(", ");
    }

    private drawSummary(products: IOrderProduct[]): void {
        this.registerNewFont('Roboto-Bold')
        this.doc.font('Roboto-Bold').text("Total cost of order: ")
        this.doc.moveDown()
        this.doc.font('Roboto-Regular').text(this.getTotalCostOfOrder(products).toString())
    }
}

export default PdfGenerator