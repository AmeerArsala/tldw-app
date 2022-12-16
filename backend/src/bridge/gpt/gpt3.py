import openai
from src.constants import AIs


# all 3 of these parameters are strings
def gpt3complete(text, model_type, prompt_type):
    response = openai.Completion.create(
        model=AIs.GPT3_MODEL.name[model_type],
        prompt=(AIs.GPT3_MODEL.prompt[prompt_type] + text),
        temperature=0.7,
        max_tokens=calculate_tokens(text),
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    return response

def embed(text, model_type):
    text = text.replace("\n", " ")  # replace new lines with spaces
    return openai.Embedding.create(input=[text], model=AIs.GPT3_EMBEDDER[model_type])

def calculate_tokens(text):
    return 256