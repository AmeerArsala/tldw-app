import { VALID_YOUTUBE_URL_PREFIXES } from "./constants";

export function isYouTubeURL(url: string) {
    for (var i = 0; i < VALID_YOUTUBE_URL_PREFIXES.length; ++i) {
        if (url.startsWith(VALID_YOUTUBE_URL_PREFIXES[i])) {
            return true;
        }
    }

    return false;
}