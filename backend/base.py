from flask import Flask, request

from src.tldw import TLDW
import tldwsession
from receivers import TldwRequestReceiver


api = Flask(__name__)
session = tldwsession.new_session()


@api.route("/")
def hello():
    return "Hello World!"


@api.route("/tldw_inference/<string:yt_url_id>")
def inference_tldw(yt_url_id):
    """
    args {
        pretrained_whisper_model: str;  default="base" | Dropdown
        visualize: bool;                default=False  | Switch
        deep_transcribe: bool;          default=True   | Switch
        remote_transcribe: bool;        default=False  | Switch
        num_highlights: int;            default=5      | Slider; TODO: change to adaptive highlights

        NOTE: include_highlight_scores will not be used as query args
    }
    """
    print(f"<BACKEND> Request: {request}")

    yt_url_prefix = "https://www.youtube.com/watch?v="
    yt_url = yt_url_prefix + yt_url_id

    args = request.args
    receiver = TldwRequestReceiver(args, include_highlight_scores=False)

    # Call TLDW
    summary = receiver.summarize_yt_video(session, yt_url)

    output = summary["output"]
    visualization_img_url = summary["visualization_img_url"]

    response_body = {
        "transcript": output.transcription_result.text,
        "language": output.transcription_result.language,
        "summary": output.gpt3_summarization_text,
        "highlights": tldwsession.grab_highlights(output.gpt3_highlights),
        "visualization_img_url": visualization_img_url
    }

    return response_body


if __name__ == "__main__":
    api.run(port=5000, ssl_context="adhoc", debug=True)
