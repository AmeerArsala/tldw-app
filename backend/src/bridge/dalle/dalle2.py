import openai
from src.bridge.gpt import gpt3

# @params
# summary: string
# num_images: int
# img_size: string
def visualize(summary, num_images=1, img_size="512x512"):
    dalle2_prompt = gpt3.gpt3complete(summary, "MAIN", "visualize")
    dalle2_prompt_text = dalle2_prompt["choices"][0]["text"]

    visualization = openai.Image.create(
        prompt=dalle2_prompt_text,
        n=num_images,
        size=img_size
    )

    return visualization