# Chat bot project


## Description:

**EN:**

Robot chat bot in English, the main topic of this chat is SIR (Distributed Computer Dystems), the used can ask questions and the robot will answer those question based on the probabilties of similarities of the sentence vectors.

**FR:**

Robot chat bot in English, the main topic of this chat is SIR (Distributed Computer Dystems), the used can ask questions and the robot will answer those question based on the probabilties of similarities of the sentence vectors.

## Requirements:

This program to run, it requires some python libraries to be installed before gets imported. The following are required to be installed before begin:

- fastapi 
- pydantic
- import nltk
- import datetime
- pandas
- numpy
- tflearn
- random
- pickle
- tensorflow
- warnings
- uvicorn

## How to install required libraries:

Go to the terminal and run the following line:
`pip install "Library required"`
- for example installing **pandas**: 
`pip install pandas`


## How to execute the code:
At the terminal in current working directory run the following line:
`uvicorn api_model:app --reload`

Then open `index.html` in `/info` directory and press get started.
