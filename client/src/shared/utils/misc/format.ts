export function formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let value = bytes
    let unitIndex = 0

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024
        unitIndex++
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`
}
