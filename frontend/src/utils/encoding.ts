
export function truncateYouTubeURL(ytURL: string) {
    let videoID = ytURL.substring(ytURL.lastIndexOf("/") + 1);
    const blacklisted = "watch?v=";

    if (videoID.startsWith(blacklisted)) {
        videoID = videoID.substring(blacklisted.length); 
    }

    return videoID;
}