import {
    IconAlertCircle,
    IconArrowsUpDown,
    IconCalendar,
    IconCheck,
    IconDevices,
    IconUser,
    IconX,
    IconDeviceMobile,
    IconDeviceDesktop,
    IconDeviceTablet
} from '@tabler/icons-react'
import { Accordion, Badge, Group, rgba, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import {
    formatDate,
    getExpirationTextUtil
} from '@shared/utils/time-utils/get-expiration-text/get-expiration-text.util'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { InfoBlockShared } from '@shared/ui/info-block/info-block.shared'

dayjs.extend(relativeTime)
export const SubscriptionInfoWidget = () => {
    const { t, i18n } = useTranslation()
    const { subscription, devices } = useSubscriptionInfoStoreInfo()

    if (!subscription) return null

    const { user } = subscription

    const getStatusAndIcon = (): {
        color: string
        icon: React.ReactNode
        status: string
    } => {
        if (user.userStatus === 'ACTIVE' && user.daysLeft > 0) {
            return {
                color: 'teal',
                icon: <IconCheck size={20} />,
                status: t('subscription-info.widget.active')
            }
        }
        if (
            (user.userStatus === 'ACTIVE' && user.daysLeft === 0) ||
            (user.daysLeft >= 0 && user.daysLeft <= 3)
        ) {
            return {
                color: 'orange',
                icon: <IconAlertCircle size={20} />,
                status: t('subscription-info.widget.active')
            }
        }

        return {
            color: 'red',
            icon: <IconX size={20} />,
            status: t('subscription-info.widget.inactive')
        }
    }

    return (
        <Accordion
            styles={(theme) => ({
                item: {
                    boxShadow: `0 4px 12px ${rgba(theme.colors.gray[5], 0.1)}`
                }
            })}
            variant="separated"
        >
            <Accordion.Item value="subscription-info">
                <Accordion.Control
                    icon={
                        <ThemeIcon color={getStatusAndIcon().color} size="lg" variant="light">
                            {getStatusAndIcon().icon}
                        </ThemeIcon>
                    }
                >
                    <Stack gap={3}>
                        <Text fw={500} size="md" truncate>
                            {user.username}
                        </Text>
                        <Text c={user.daysLeft === 0 ? 'red' : 'dimmed'} size="xs">
                            {getExpirationTextUtil(user.expiresAt, t, i18n)}
                        </Text>
                    </Stack>
                </Accordion.Control>
                <Accordion.Panel>
                    <SimpleGrid cols={{ base: 1, sm: 2, xs: 2 }} spacing="xs" verticalSpacing="sm">
                        <InfoBlockShared
                            color="blue"
                            icon={<IconUser size={20} />}
                            title={t('subscription-info.widget.name')}
                            value={user.username}
                        />

                        <InfoBlockShared
                            color={user.userStatus === 'ACTIVE' ? 'green' : 'red'}
                            icon={
                                user.userStatus === 'ACTIVE' ? (
                                    <IconCheck size={20} />
                                ) : (
                                    <IconX size={20} />
                                )
                            }
                            title={t('subscription-info.widget.status')}
                            value={
                                user.userStatus === 'ACTIVE'
                                    ? t('subscription-info.widget.active')
                                    : t('subscription-info.widget.inactive')
                            }
                        />

                        <InfoBlockShared
                            color="red"
                            icon={<IconCalendar size={20} />}
                            title={t('subscription-info.widget.expires')}
                            value={formatDate(user.expiresAt, t, i18n)}
                        />

                        <InfoBlockShared
                            color="yellow"
                            icon={<IconArrowsUpDown size={20} />}
                            title={t('subscription-info.widget.bandwidth')}
                            value={`${user.trafficUsed} / ${user.trafficLimit === '0' ? '∞' : user.trafficLimit}`}
                        />

                        {devices && devices.response?.devices && devices.response.devices.length > 0 && (
                            <InfoBlockShared
                                color="cyan"
                                icon={<IconDevices size={20} />}
                                title={t('subscription-info.widget.devices')}
                                value={`${devices.response.devices.length} / ${!user.hwidDeviceLimit || user.hwidDeviceLimit === 0 ? '∞' : user.hwidDeviceLimit}`}
                            />
                        )}
                    </SimpleGrid>

                    {devices && devices.response?.devices && devices.response.devices.length > 0 && (
                        <Stack gap="xs" mt="md">
                            <Text fw={500} size="sm" c="dimmed">
                                {t('subscription-info.widget.device-list')}:
                            </Text>
                            <Stack gap="xs">
                                {devices.response.devices.map((device) => {
                                    const getDeviceIcon = () => {
                                        const platform = device.platform.toLowerCase()
                                        if (platform.includes('ios') || platform.includes('iphone') || platform.includes('ipad')) {
                                            return <IconDeviceMobile size={18} />
                                        }
                                        if (platform.includes('android')) {
                                            return <IconDeviceMobile size={18} />
                                        }
                                        if (platform.includes('windows') || platform.includes('macos') || platform.includes('linux')) {
                                            return <IconDeviceDesktop size={18} />
                                        }
                                        if (platform.includes('tablet')) {
                                            return <IconDeviceTablet size={18} />
                                        }
                                        return <IconDevices size={18} />
                                    }

                                    return (
                                        <Group
                                            key={device.hwid}
                                            gap="sm"
                                            p="sm"
                                            style={(theme) => ({
                                                backgroundColor: rgba(theme.colors.cyan[6], 0.05),
                                                border: `1px solid ${rgba(theme.colors.cyan[6], 0.2)}`,
                                                borderRadius: theme.radius.md,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: rgba(theme.colors.cyan[6], 0.1),
                                                    borderColor: rgba(theme.colors.cyan[6], 0.3),
                                                }
                                            })}
                                        >
                                            <ThemeIcon
                                                size="lg"
                                                radius="md"
                                                variant="light"
                                                color="cyan"
                                            >
                                                {getDeviceIcon()}
                                            </ThemeIcon>
                                            <Stack gap={2} style={{ flex: 1 }}>
                                                <Text fw={600} size="sm">
                                                    {device.deviceModel}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {device.platform}
                                                </Text>
                                            </Stack>
                                        </Group>
                                    )
                                })}
                            </Stack>
                        </Stack>
                    )}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
