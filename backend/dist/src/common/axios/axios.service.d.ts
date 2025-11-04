import { AxiosInstance, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { ConfigService } from '@nestjs/config';
import { GetSubscriptionInfoByShortUuidCommand, GetUserByUsernameCommand, TRequestTemplateTypeKeys } from '@remnawave/backend-contract';
import { ICommandResponse } from '../types/command-response.type';
export declare class AxiosService {
    private readonly configService;
    axiosInstance: AxiosInstance;
    private readonly logger;
    constructor(configService: ConfigService);
    getUserByUsername(clientIp: string, username: string): Promise<ICommandResponse<GetUserByUsernameCommand.Response>>;
    getSubscriptionInfo(clientIp: string, shortUuid: string): Promise<ICommandResponse<GetSubscriptionInfoByShortUuidCommand.Response>>;
    getSubscription(clientIp: string, shortUuid: string, headers: NodeJS.Dict<string | string[]>, withClientType?: boolean, clientType?: TRequestTemplateTypeKeys): Promise<{
        response: unknown;
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    } | null>;
    getUserDevices(clientIp: string, username: string): Promise<ICommandResponse<any>>;
    private filterHeaders;
}
