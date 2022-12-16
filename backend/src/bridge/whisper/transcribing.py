import whisper
import requests
from src.video_utils import VideoManager
from src.constants import RemoteAPIs


def transcribe_from_remote(audio_filepath):
    audio_filename = audio_filepath[audio_filepath.rindex("/")+1:]  # {audio_filename}.mp3

    payload={}
    files=[
        ("audio_file", (audio_filename, open(audio_filepath, "rb"), "audio/mpeg"))
    ]

    response = requests.request("POST", RemoteAPIs.WHISPER_ASR_URL, data=payload, files=files)
    print(response.text)
    return response


def simple_transcribe_local(whisper_model, audio_filepath):
    result = whisper_model.transcribe(audio_filepath)
    print(result["text"])
    return result


def simple_transcribe(whisper_model, audio_filepath, remote=False):
    if remote:
        return transcribe_from_remote(audio_filepath)
    else:
        return simple_transcribe_local(whisper_model, audio_filepath)


def deep_transcribe(whisper_model, video_manager, remote=False):
    mel = whisper.log_mel_spectrogram(video_manager.audio).to(whisper_model.device)

    _, probs = whisper_model.detect_language(mel)
    print(f"Detected languages: {max(probs, key=probs.get)}")

    options = whisper.DecodingOptions(language="en", without_timestamps=False, fp16=False, )
    result = whisper.decode(whisper_model, mel, options)
    print(result.text)

    output = simple_transcribe(whisper_model, video_manager.get_audio_filepath(), remote)

    return output


class Result:
    def __init__(self, whisper_result):
        super().__init__()
        self.text = whisper_result["text"]                                                      # str
        self.segments = [Segment(segment_dict) for segment_dict in whisper_result["segments"]]  # Segment[]
        self.language = whisper_result["language"]                                              # str


class Segment:
    def __init__(self, segment_result):
        super().__init__()
        self.id = segment_result["id"]                                # int   : "nth" segment
        self.seek = segment_result["seek"]                            # int   : "sub-segment" (each segment split into 100 subsegments)
        self.start = segment_result["start"]                          # float : time (seconds)
        self.end = segment_result["end"]                              # float : time (seconds)
        self.text = segment_result["text"]                            # str   : segment transcript
        self.tokens = segment_result["tokens"]                        # int[] : tokens
        self.temperature = segment_result["temperature"]              # float : temperature 
        self.avg_logprob = segment_result["avg_logprob"]              # float : avg_logprob
        self.compression_ratio = segment_result["compression_ratio"]  # float : compression_ratio
        self.no_speech_prob = segment_result["no_speech_prob"]        # float : no_speech_prob

    def __str__(self):
        s = f"""
            Start: {self.start}
            End:   {self.end}
            
            {self.text}
            """

        return s
