from src.tldw import TLDW
from src.bridge.whisper.transcribing import Segment


def new_session():
    return TldwSession(None)


class TldwSession:
    def __init__(self, current_tldw_instance):
        self.current_tldw_instance = current_tldw_instance

    def use_pretrained_whisper_model(self, pretrained_whisper_model: str):
        if self.current_tldw_instance is None or self.current_tldw_instance.pretrained_whisper_model != pretrained_whisper_model:
            # Make a new instance
            self.current_tldw_instance = TLDW(pretrained_whisper_model)

        return self.current_tldw_instance


# highlights: Segment[]
def grab_highlights(highlights):
    return [{"range": [highlight.start, highlight.end], "segment_text": highlight.text} for highlight in highlights]
