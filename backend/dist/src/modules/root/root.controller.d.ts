import { Request, Response } from 'express';
import { RootService } from './root.service';
export declare class RootController {
    private readonly rootService;
    private readonly logger;
    constructor(rootService: RootService);
    root(clientIp: string, request: Request, response: Response, shortUuid: string, clientType: string): Promise<void>;
}
