// custom.d.ts
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string; // Adjust the type as per your actual usage
        }
    }
}
