import os

import pytube
import whisper

from moviepy.editor import VideoFileClip
from src.constants import Vid


def verify_is_youtube(url):  # url: string
    allowed_prefixes = ["https://youtube.com", "https://youtu.be", "youtube.com", "youtu.be"]

    for prefix in allowed_prefixes:
        if url.startswith(prefix):
            return True

    return False


class VideoManager:
    def __init__(self, url, output_path=""):
        super().__init__()
        self.url = url
        self.video = pytube.YouTube(url)  # use pytube to get video from YouTube
        self.stream = self.video.streams.get_by_itag(Vid.ITAG)
        self.audio = None
        
        self.output_path = output_path
        self.video_filename = Vid.DOT_VIDEO_FORMAT
        self.audio_filename = Vid.DOT_AUDIO_FORMAT
    
    def filepath(self, local_filepath):
        return self.output_path + "/" + local_filepath

    def get_video_filepath(self):
        return self.filepath(self.video_filename)

    def get_audio_filepath(self):
        return self.filepath(self.audio_filename)
    
    def download_video(self):
        self.stream.download(output_path=self.output_path)
        self.video_filename = self.stream.default_filename

    def load_audio(self):
        # Convert to audio
        self.audio_filename = self.video_filename[:-4] + Vid.DOT_AUDIO_FORMAT
        audio_filepath = self.get_audio_filepath()

        clip = VideoFileClip(self.filepath(self.video_filename))  # load video file
        clip.audio.write_audiofile(audio_filepath)                 # write audio file
        clip.close()

        # Load and pad audio
        loaded_audio = whisper.load_audio(audio_filepath)
        self.audio = whisper.pad_or_trim(loaded_audio)
    
    def download_video_files(self):
        self.download_video()
        self.load_audio()

    def delete_files(self):
        os.remove(self.filepath(self.video_filename))
        os.remove(self.filepath(self.audio_filename))