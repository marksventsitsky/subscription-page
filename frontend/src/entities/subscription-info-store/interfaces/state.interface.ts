import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'

export interface IDevice {
    hwid: string
    userUuid: string
    platform: string
    osVersion: string
    deviceModel: string
    userAgent: string
    createdAt: string
    updatedAt: string
}

export interface IDevicesResponse {
    total: number
    devices: IDevice[]
}

export interface IDevicesData {
    response: IDevicesResponse
}

export interface IState {
    subscription: GetSubscriptionInfoByShortUuidCommand.Response['response'] | null
    devices: IDevicesData | null
}
