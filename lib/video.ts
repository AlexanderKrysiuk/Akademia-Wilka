import ffmpeg from 'fluent-ffmpeg';

export function getVideoDurationFromURL(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(url, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const duration = metadata.format.duration;
                if (typeof duration === 'number') {
                    resolve(duration);
                } else {
                    reject(new Error('Unable to determine video duration.'));
                }
            }
        });
    });
}
