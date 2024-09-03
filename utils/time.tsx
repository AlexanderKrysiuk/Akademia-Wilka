export function formatTime(seconds: number | null | undefined): string {
    if (seconds === null || seconds === undefined) {
        return "00:00";
    }

    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format the time as hh:mm:ss or mm:ss
    const formattedTime = [
        hours > 0 ? hours.toString().padStart(2, '0') : null,
        minutes.toString().padStart(2, '0'),
        remainingSeconds.toString().padStart(2, '0'),
    ]
    .filter(Boolean) // Removes null or undefined values
    .join(':');

    return formattedTime;
}