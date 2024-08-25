import { VideoSource } from '@prisma/client'; // Assuming VideoSource is an enum or similar
import Player from 'next-video/player';

// Helper function to convert a standard YouTube link to an embed link
const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.split("v=")[1];
  const ampersandPosition = videoId ? videoId.indexOf("&") : -1;
  if (ampersandPosition !== -1) {
    return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
  }
  return `https://www.youtube.com/embed/${videoId}`;
};

interface VideoPlayerProps {
  source: VideoSource;
  url: string;
}

// Main video player component
const VideoPlayer = ({ source, url }: VideoPlayerProps) => {
  switch(source) {
    case VideoSource.youtube:
        return (
          <iframe
            className="w-full h-full"
            src={getYouTubeEmbedUrl(url)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
    case VideoSource.internal:
      return (
        <video 
          controls
          src={url}/>
      );
    default:
      return null;
  }
};

export default VideoPlayer;
