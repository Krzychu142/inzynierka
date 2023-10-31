import { Request, Response, NextFunction } from 'express';
import { Operation } from '../types/operation.enum';
import RequestLoggerService from '../services/RequestLogger.service';
import ErrorsHandlers from './helpers/ErrorsHandlers';

// that is instead of interceptor
class RequestLogger {
    
    private static logLoginOperation(req: Request): void {
        try {
            RequestLoggerService.saveLogOfLogIn({
                nameOfOperation: Operation.LOGGING,
                dateExecution: new Date(),
                operationPerformedBy: req.body.email
            });
        } catch (error) {
            console.log(ErrorsHandlers.errorMessageHandler(error));
        }
    }

    static logRequest(req: Request, res: Response, next: NextFunction) {

        res.on('finish', () => {
            if (req.path === "/auth/login" && req.body.email && res.statusCode === 200) {
                this.logLoginOperation(req);
            }
        });

        next();
    }
}

export default RequestLogger;
