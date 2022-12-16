const VALID_YOUTUBE_URL_PREFIXES = ["https://www.youtube.com", 
                                    "http://www.youtube.com",
                                    "youtube.com",
                                    "www.youtube.com",
                                    "https://youtu.be",
                                    "http://youtu.be",
                                    "https://www.youtu.be", 
                                    "youtu.be"];

const TLDW_Model = {
    DEFAULT_WHISPER_PRETRAINED_MODEL: "base",
    VALID_WHISPER_PRETRAINED_MODELS: ["base", "tiny", "small", "medium"],
    NO_VISUALIZATION_KEY: "NO VISUALIZATION"
};

export { VALID_YOUTUBE_URL_PREFIXES, TLDW_Model };