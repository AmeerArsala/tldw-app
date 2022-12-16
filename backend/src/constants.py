class RemoteAPIs:
    WHISPER_URL = "https://whisper.lablab.ai"
    WHISPER_ASR_URL = "https://whisper.lablab.ai/asr"  # ASR = Automatic Speech Recognition


class Vid:
    ITAG = 18
    
    VIDEO_FORMAT = "mp4"
    AUDIO_FORMAT = "mp3"

    DOT_VIDEO_FORMAT = "." + VIDEO_FORMAT
    DOT_AUDIO_FORMAT = "." + AUDIO_FORMAT

    OUTPUT_PATH = "../cache"


class AIs:
    class OPEN_AI_NLP_MODEL:
        def __init__(self, name, prompt):  # both strings
            super().__init__()
            self.name = name
            self.prompt = prompt

    VALID_WHISPER_PRETRAINED_MODELS = ["base", "tiny", "small", "medium"]

    GPT3_MODEL = OPEN_AI_NLP_MODEL(
        name={
            "MAIN": "text-davinci-003"
        },
        prompt={
            # MAIN
            "summary": "Write a summary of this video: ",
            "summary2": "Summarize this: ",
            "summary3": "Summarize this video: ",
            "visualize": "Describe this text as if it is a visual depiction: ",
            "keypoints": "Summarize this into 5 key points: "
        }
    )

    GPT3_EMBEDDER = {
        "ADA_EMBEDDING": "text-embedding-ada-002",
        "ADA_SIMILARITY": "text-similarity-ada-001",
        "BABBAGE_SIMILARITY": "text-similarity-babbage-001",
        "CURIE_SIMILARITY": "text-similarity-curie-001",
        "DAVINCI_SIMILARITY": "text-similarity-davinci-001"
    }
