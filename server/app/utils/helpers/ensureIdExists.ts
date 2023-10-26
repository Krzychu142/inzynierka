import { Request } from 'express'

export default function ensureIdExists(req: Request): void {
    if (!req.params.id) {
        throw new Error('The id parameter is missing');
    }
}