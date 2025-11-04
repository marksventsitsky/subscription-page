import { NextFunction, Request, Response } from 'express';
export declare const getRealIp: (req: {
    clientIp: string;
} & Request, res: Response, next: NextFunction) => void;
