import os

import numpy as np
import pandas as pd

import torch

# Whisper
import whisper
from src.bridge.whisper import transcribing

# GPT-3
import openai
from src.bridge.gpt import gpt3
from dotenv import load_dotenv

from src.video_utils import VideoManager
from src.constants import Vid
from src.math_utils import pad_or_trim_ndarray

# DALL-E 2
from src.bridge.dalle import dalle2


load_dotenv()


# TLDW instance: URL -> (TLDW) -> SummarizedVideoText
class TLDW:
    # pretrained_whisper_model: str | WhisperModel - it can be anything in constants.AIs.VALID_WHISPER_PRETRAINED_MODELS
    def __init__(self, pretrained_whisper_model="base"):
        super().__init__()
        
        DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

        self.pretrained_whisper_model = pretrained_whisper_model
        self.whisper_model = whisper.load_model(self.pretrained_whisper_model, device=DEVICE)  # load whisper model

        openai.api_key = os.getenv("OPENAI_API_KEY")
    
    # @params
    # yt_video_url: str
    def summarize_yt_video(self,
                           yt_video_url,
                           visualize=False,
                           deep_transcribe=True, remote_transcribe=False,
                           num_highlights=5, include_highlight_scores=False):
        # Track the video
        video_manager = VideoManager(yt_video_url, output_path=Vid.OUTPUT_PATH)

        # Download video
        print("Loading video...")
        try: 
            video_manager.download_video()
            print("Downloaded video as " + video_manager.video_filename)
        except:
            print("Not a valid link.")
            return

        # Load audio of video
        print("Preparing audio...")
        try:
            video_manager.load_audio()  # whisper loads the audio
            print("Video converted to " + Vid.AUDIO_FORMAT)
        except:
            print("Error converting video to mp3")
            return

        # Transcribe, summarize, and index video
        output = self.inference(video_manager,
                                deep_transcribe=deep_transcribe, remote_transcribe=remote_transcribe,
                                num_highlights=num_highlights, include_highlight_scores=include_highlight_scores)
        output_text = output.gpt3_summarization_text

        visualization = None
        visualization_img_url = "NO VISUALIZATION"
        if visualize:
            # Visualize summary (DALL-E 2)
            print("Visualizing...")
            try:
                visualization = dalle2.visualize(output_text)
                visualization_img_url = visualization["data"][0]["url"]
            except:
                print("Visualization Rejected")

        # Remove the files
        print("Cleaning up cache...")
        video_manager.delete_files()

        return {
            "output": output,                               # Inference - full output
            "output_text": output_text,                     # str - summary text
            "visualization": visualization,                 # DALL-E 2 visualization object
            "visualization_img_url": visualization_img_url  # str - image url for DALL-E 2 visualization
        }

    # "Model" pipeline; (loaded video + audio data) -> inference() -> summary of video
    # @params
    # video_manager: VideoManager
    # num_highlights: int
    # deep_transcribe: bool
    # remote_transcribe: bool
    def inference(self,
                  video_manager,
                  num_highlights, include_highlight_scores, deep_transcribe=True, remote_transcribe=False):
        # Transcribe audio (Whisper)
        print("Transcribing...")
        transcription_result = transcribing.Result(self.transcribe(video_manager, deep_transcribe=deep_transcribe, remote=remote_transcribe))
        
        # Summarize transcript (GPT-3)
        print("Summarizing...")
        gpt3_summarization = self.summarize(transcription_result)
        gpt3_summarization_text = gpt3_summarization["choices"][0]["text"]

        # Compute similarity between transcript and summary to find key points (GPT-3)
        print("Indexing...")
        highlights = self.highlights(transcription_result, gpt3_summarization_text,
                                     num_highlights=num_highlights, include_scores=include_highlight_scores)

        return Inference(transcription_result, gpt3_summarization, gpt3_summarization_text, highlights)
    
    # @params
    # video_manager: VideoManager
    # deep_transcribe: bool
    def transcribe(self, video_manager, deep_transcribe=True, remote=False):
        if deep_transcribe:
            return transcribing.deep_transcribe(self.whisper_model, video_manager, remote=remote)
        else:
            return transcribing.simple_transcribe(self.whisper_model, video_manager.get_audio_filepath(), remote=remote)

    # @params
    # transcription_result: transcribing.Result
    def summarize(self, transcription_result):
        # TODO: something
        return gpt3.gpt3complete(transcription_result.text, "MAIN", "summary")

    # @params
    # transcription_result: transcribing.Result
    # gpt3_summarization_text: str
    # num_highlights: int
    @staticmethod
    def highlights(transcription_result, gpt3_summarization_text, num_highlights=5, include_scores=False):
        # embed function
        def embed_text(text):  # text: str
            embedding_result = gpt3.embed(text, "BABBAGE_SIMILARITY")  # Best: "ADA_EMBEDDING"
            embedding = np.array(embedding_result["data"][0]["embedding"])  # np.array(<list>)

            return embedding_result, embedding

        # Create embeddings
        summary_embedding_result, summary_embedding = embed_text(gpt3_summarization_text)
        summary_embedding_norm = np.linalg.norm(summary_embedding)

        #transcript_embedding_result, transcript_embedding = embed_text(transcription_result.text)

        #transcript_embeddings = []
        best_highlights = [(None, 0)] * num_highlights  # (segment, similarity_score)

        def attempt_add_to_best_highlights(segment, score):
            for i, highlight in enumerate(best_highlights):
                highlight_score = highlight[1]
                if score > highlight_score:
                    best_highlights[i] = (segment, score)
                    return True

            return False

        for transcript_segment in transcription_result.segments:
            _, transcript_segment_embedding = embed_text(transcript_segment.text)
            #transcript_embeddings.append(transcript_embedding)

            # Reformat segment vector for use
            transcript_segment_embedding = pad_or_trim_ndarray(transcript_segment_embedding, target=summary_embedding)

            # Compute similarity scores using embedding
            cosine_similarity = np.matmul(summary_embedding.T, transcript_segment_embedding) / (np.linalg.norm(transcript_segment_embedding) * summary_embedding_norm)

            # Select the num_highlights best highlights
            attempt_add_to_best_highlights(transcript_segment, cosine_similarity)

        if include_scores:
            return sorted(best_highlights,
                          key=lambda best_highlight: best_highlight[0].start)
        else:
            return sorted([best_highlight[0] for best_highlight in best_highlights],
                          key=lambda best_highlight: best_highlight.start)


class Inference:
    # @params
    # transcription_result: transcribing.Result
    # gpt3_summarization: GPT-3 Summarization object
    # gpt3_summarization_text: str
    # gpt3_highlights: transcribing.Segment[]
    def __init__(self, transcription_result, gpt3_summarization, gpt3_summarization_text, gpt3_highlights):
        super().__init__()
        self.transcription_result = transcription_result
        self.gpt3_summarization = gpt3_summarization
        self.gpt3_summarization_text = gpt3_summarization_text
        self.gpt3_highlights = gpt3_highlights


