import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TRequestTemplateTypeKeys } from '@remnawave/backend-contract';
import { AxiosService } from '@common/axios/axios.service';
export declare class RootService {
    private readonly configService;
    private readonly jwtService;
    private readonly axiosService;
    private readonly logger;
    private readonly isMarzbanLegacyLinkEnabled;
    private readonly marzbanSecretKey?;
    constructor(configService: ConfigService, jwtService: JwtService, axiosService: AxiosService);
    serveSubscriptionPage(clientIp: string, req: Request, res: Response, shortUuid: string, clientType?: TRequestTemplateTypeKeys): Promise<void>;
    private generateJwtForCookie;
    private isBrowser;
    private isGenericPath;
    private returnWebpage;
    private decodeMarzbanLink;
    private checkSubscriptionValidity;
}
