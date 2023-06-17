import dotenv from 'dotenv';
dotenv.config();

export default class App {
    public test(): void {
        console.log(process.env.DB_HOST);
    }
}