import os
from dotenv import load_dotenv

from src.constants import AIs
#import openai


def openai_key_provided():
    load_dotenv()

    baseline = 12
    return len(os.getenv("OPENAI_API_KEY")) > baseline


# whisper_pretrained_model_name: str
def validate_whisper_pretrained_model_name(whisper_pretrained_model_name):
    if whisper_pretrained_model_name in AIs.VALID_WHISPER_PRETRAINED_MODELS:
        return whisper_pretrained_model_name
    else:
        raise Exception("Not a valid whisper pretrained model name")