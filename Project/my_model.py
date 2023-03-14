import nltk
import datetime
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()
import pandas as pd
import numpy
import tflearn
import random
import pickle
from tensorflow.python.framework import ops
from datetime import date
import warnings
warnings.filterwarnings('ignore')
def getdate():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
import json
with open('intents.json') as file:
    data = json.load(file)
try:
    with open('data.pickle', 'rb') as f:
        words, labels, training, output = pickle.load(f)
except:
    words = []
    labels = []
    docs_x = []
    docs_y = []

    for intent in data['intents']:
        for pattern in intent['patterns']:
            wrds = nltk.word_tokenize(pattern)
            words.extend(wrds)
            docs_x.append(wrds)
            docs_y.append(intent["tag"])
            
        if intent['tag'] not in labels:
            labels.append(intent['tag'])

    words = [stemmer.stem(w.lower()) for w in words if w != "?"]
    words = sorted(list(set(words)))

    labels = sorted(labels)

    training = []
    output = []

    out_empty = [0 for _ in range(len(labels))]

    for x, doc in enumerate(docs_x):
        bag = []

        wrds = [stemmer.stem(w.lower()) for w in doc]

        for w in words:
            if w in wrds:
                bag.append(1)
            else:
                bag.append(0)

        output_row = out_empty[:]
        output_row[labels.index(docs_y[x])] = 1

        training.append(bag)
        output.append(output_row)


    training = numpy.array(training)
    output = numpy.array(output)
    with open('data.pickle', 'wb') as f:
        pickle.dump((words, labels, training, output ), f)

# tensorflow.reset_default_graph()
ops.reset_default_graph()

net = tflearn.input_data(shape=[None, len(training[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
net = tflearn.regression(net)

model = tflearn.DNN(net)

try:
    model.load("model.tflearn")
except:
    model.fit(training, output, n_epoch=2500, batch_size=8, show_metric=True)
    model.save("model.tflearn")

def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1
            
    return numpy.array(bag)


def chat(query):
    df=pd.read_csv('data/message_history.csv')
    df = df[["message","date","author"]]
    inp = query["message"]

    results = model.predict([bag_of_words(inp, words)])[0]
    results_index = numpy.argmax(results)
    tag = labels[results_index]

    if results[results_index] > 0.7:

        for tg in data["intents"]:
            if tg['tag'] == tag:
                responses = tg['responses']
        
        c= random.choice(responses)
        dct1  = {"message":[inp,c],"author": [1,0], "date": [query["date"],getdate()]}
        n_df1 = pd.DataFrame(dct1)
        df11 = pd.concat([df,n_df1],ignore_index=True)
        df11.to_csv('data/message_history.csv')
        return [{"message":c,"author": 0, "date": getdate()}]
    else:
        c = "Sorry, I can't get your question.<br>Can you repeat please?"
        dct  = {"message":[inp,c],"author": [1,0], "date": [query["date"],getdate()]}
        n_df = pd.DataFrame(dct)
        df1 = pd.concat([df,n_df],ignore_index=True)
        df1.to_csv('data/message_history.csv')
        return [{"message": c, "author": 0, "date": getdate()}]

def history():
    df_hh = pd.read_csv('data/message_history.csv')
    df_hh = df_hh[["message","date","author"]]
    list_message = df_hh["message"] 
    list_date = df_hh["date"] 
    list_author = df_hh["author"] 
    lst=[]
    for message, date, author in zip(list_message,list_date,list_author):
        lst.append({"message": message, "date": date, "author": author})
    return lst

def cln_history():
    df_clean = pd.DataFrame()
    df_clean["message"] = []
    df_clean["date"]=[]
    df_clean["author"]=[]
    df_clean.to_csv('data/message_history.csv', index=False)