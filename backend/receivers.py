from src.tldw import TLDW
from tldwsession import TldwSession


class TldwRequestReceiver:
    # request_args: dict
    # include_highlight_scores: bool
    def __init__(self, request_args, include_highlight_scores):
        self.pretrained_whisper_model = request_args.get("pretrained_whisper_model", default="base")
        self.inference_options = InferenceOptions(
            visualize=request_args.get("visualize", default=False, type=lambda v: v.lower() == "true"),
            deep_transcribe=request_args.get("deep_transcribe", default=True, type=lambda v: v.lower() == "true"),
            remote_transcribe=request_args.get("remote_transcribe", default=False, type=lambda v: v.lower() == "true"),
            num_highlights=request_args.get("num_highlights", default=5, type=lambda v: int(v)),
            include_highlight_scores=include_highlight_scores
        )

    def summarize_yt_video(self, tldw_session: TldwSession, yt_video_url: str):
        tldw_instance = tldw_session.use_pretrained_whisper_model(self.pretrained_whisper_model)
        return self.tldw_summarize_yt_video(tldw_instance, yt_video_url)

    def tldw_summarize_yt_video(self, tldw_instance: TLDW, yt_video_url: str):
        return tldw_instance.summarize_yt_video(yt_video_url,
                                                visualize=self.inference_options.visualize,
                                                deep_transcribe=self.inference_options.deep_transcribe,
                                                remote_transcribe=self.inference_options.remote_transcribe,
                                                num_highlights=self.inference_options.num_highlights,
                                                include_highlight_scores=self.inference_options.include_highlight_scores)

    d


class InferenceOptions:
    # visualize: bool
    # deep_transcribe: bool
    # remote_transcribe: bool
    # num_highlights: int
    # include_highlight_scores: bool
    def __init__(self, visualize, deep_transcribe, remote_transcribe, num_highlights, include_highlight_scores):
        self.visualize = visualize
        self.deep_transcribe = deep_transcribe
        self.remote_transcribe = remote_transcribe
        self.num_highlights = num_highlights
        self.include_highlight_scores = include_highlight_scores
