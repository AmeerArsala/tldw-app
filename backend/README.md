# Youtube Video Summarizer

## Project Motivations

Some videos are too long but contain key information. There is no points in absorbing the entirety of them when you are looking for information. 

- use case: 2 hour video on a react course or tutorial form youtube.

## Project Description

- User drags and drops the Youtube URL to a video
- transcribing the audio
- Returns a summary, interpretation, and time stamps to any key moments

### Technologies Used

[Pytube](https://pytube.io/en/latest/) - Audio file extraction from YouTube playlists of experts talking about a subject (current MVP is specific to topics of AI)<br>
[Whisper](https://huggingface.co/docs/transformers/model_doc/whisper) - Transcription of audio<br>
Haystack [Pipelines API](https://docs.haystack.deepset.ai/reference/pipelines-api) and [ReaderAPI](https://docs.haystack.deepset.ai/reference/reader-api) - Synthesis for modeling a representation of an expert<br>
[Streamlit](https://streamlit.io/) - front end web app deployment

## User Flow

1. Prompt user
> "What is self-supervised learning" 
2. The model would find what the expert would reply to this. 
3. The model returns what it finds as the best answer, based on what the expert has said in the past.

## Constructing an "Expert" Council Member
1. Get raw audio content of a monologue of our target person speaking, correctly labeled. 
2. Label the objects in a dictionary with that speaker. 
3. Pass the audio to extract a whisper object
4. Populate a dictionary with metadata, the transcript file, and the audio/link to source of data

## Features:

**1. Return the Most Relevant Content from an Expert on Prompt's Subject Matter**

Match our database to the prompt inputs as closely as possible. return the object in our dictionary with the person, the material or content of what they mention, and relevant meta data such as the date they said it and link to the original source. 

**2. Evolution on prompt's subject matter** 
Metadata from YouTube link (original audio source) to get the upload date. 

If "neural network" comes up, we know when the expert's stance or mentioning of this 


## What Could Be Done In The Future 

**Library expansion**
Our data pipeline is constructed with monologues from these speakers in order to simplify the labeling process.

Data pipeline expansion. 
In order to get more content from 

The library could be greatly expanded to the experts takes from published text data, and from audio where there are multiple speaker sources. We'd also be able to add more content with the ability to input specified splices of audio (eg: instances where a speaker is talking for 45 minutes straight in a 3 hour video).

1. Expand database to more content from multiple platforms and appearances of each expert, and adding more experts. 

This requires **speaker segmentation** on the raw audio file, labeling the expert, and capturing the relevant meta data from the audio source. 
Building out a pipeline from other audio/video sources than just YouTube monologues.

2. Database building feature to add to the model:<br> 
i. Pass in audio start and end time along with URL<br>
ii. Trim audio from URL to start and end times<br>


