import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

export async function getVideoDurationFromBuffer(buffer: Buffer): Promise<number> {
    return new Promise((resolve, reject) => {
        const stream = Readable.from(buffer);

        ffmpeg(stream)
            .ffprobe((err, metadata) => {
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
