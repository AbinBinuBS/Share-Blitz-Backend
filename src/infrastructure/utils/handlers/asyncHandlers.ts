import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../../domain/interface/controllers/userControllerInterface';

const asyncHandlers = (fn: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    };

export default asyncHandlers;
 