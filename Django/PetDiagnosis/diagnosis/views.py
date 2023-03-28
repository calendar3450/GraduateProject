from django.http import HttpResponse
from django.shortcuts import render
from urllib import request
import time
from io import BytesIO
from PIL import Image
import tensorflow as tf
import pandas as pd
from keras.utils import img_to_array
from keras.applications.inception_resnet_v2 import InceptionResNetV2, preprocess_input
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def dog_diagnosis(request):
    if request.method == 'POST':
        request = json.loads(request.body)
        imgUrl = request['image']
        return HttpResponse(get_image(imgUrl))
    if request.method == 'GET':
        return HttpResponse('Get Create')
    
def predict_dog_disease(imgData):
    class_dictionary = {'안검염': 0,
                        '백내장':1,
                        '결막염':2,
                        '궤양성각막질환':3,
                        '안검내반증':4,
                        '유루증':5,
                        '안검종양':6,
                        '비궤양성각막질환':7,
                        '무증상':8,
                        '핵경화':9,
                        '색소침착성각막염':10,
                       }
    model = tf.keras.models.load_model("petEyeDiagnosis.h5")
    img = img_to_array(imgData)
    img = img.reshape((1, img.shape[0], img.shape[1], img.shape[2]))
    img = preprocess_input(img)
    prediction = model.predict(img)

    df = pd.DataFrame({'pred':prediction[0]})
    df = df.sort_values(by='pred', ascending=False, na_position='first')

    for x in class_dictionary:
      if class_dictionary[x] == (df[df == df.iloc[0]].index[0]):
        result = x
        break
    return result

def get_image(imageUrl):
    # request.urlopen()
    res = request.urlopen(imageUrl).read()
    # Image open
    img = Image.open(BytesIO(res)).resize((224,224))
    result=predict_dog_disease(img)
    return result 

"""
-pip install list-
Package                 Version
----------------------- ---------
absl-py                 1.3.0
aiohttp                 3.8.3
aiosignal               1.2.0
appdirs                 1.4.4
asgiref                 3.5.2
astunparse              1.6.3
async-timeout           4.0.2
attrs                   22.1.0
blinker                 1.4
Bottleneck              1.3.5
brotlipy                0.7.0
cached-property         1.5.2
cachetools              4.2.2
certifi                 2022.12.7
cffi                    1.15.1
charset-normalizer      2.0.4
click                   8.0.4
cryptography            39.0.1
Django                  4.1
flatbuffers             2.0
flit_core               3.8.0
frozenlist              1.3.3
gast                    0.4.0
google-auth             2.6.0
google-auth-oauthlib    0.4.6
google-pasta            0.2.0
grpcio                  1.42.0
h5py                    3.6.0
idna                    3.4
importlib-metadata      6.0.0
joblib                  1.1.1
keras                   2.10.0
Keras-Preprocessing     1.1.2
libclang                15.0.6.1
Markdown                3.4.1
MarkupSafe              2.1.1
multidict               6.0.2
numexpr                 2.8.4
numpy                   1.22.3
oauthlib                3.2.2
opt-einsum              3.3.0
packaging               23.0
pandas                  1.5.3
Pillow                  9.4.0
pip                     23.0.1
pooch                   1.4.0
protobuf                3.20.3
pyasn1                  0.4.8
pyasn1-modules          0.2.8
pycparser               2.21
PyJWT                   2.4.0
pyOpenSSL               23.0.0
PySocks                 1.7.1
python-dateutil         2.8.2
pytz                    2022.7
PyYAML                  6.0
requests                2.28.1
requests-oauthlib       1.3.0
rsa                     4.7.2
scikit-learn            1.2.1
scipy                   1.10.0
setuptools              65.6.3
six                     1.16.0
sqlparse                0.4.3
tensorboard             2.10.0
tensorboard-data-server 0.6.1
tensorboard-plugin-wit  1.6.0
tensorflow              2.10.0
tensorflow-estimator    2.10.0
tensorflow-macos        2.10.0
tensorflow-metal        0.6.0
termcolor               2.1.0
threadpoolctl           2.2.0
typing_extensions       4.4.0
urllib3                 1.26.14
Werkzeug                2.2.3
wheel                   0.35.1
wrapt                   1.14.1
yarl                    1.8.1
zipp                    3.11.0
"""