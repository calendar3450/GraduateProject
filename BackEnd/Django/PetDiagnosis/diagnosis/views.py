import base64
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from io import BytesIO
from PIL import Image
import tensorflow as tf
import pandas as pd
from keras.utils import img_to_array
from django.http import JsonResponse
from keras.applications.densenet import DenseNet201, preprocess_input
from urllib import request
import requests

class_dictionary = {
    '결막염': 0,
    '궤양성각막질환': 1,
    '무증상': 2,
    '백내장': 3,
    '비궤양성각막질환': 4,
    '색소침착성각막염': 5,
    '안검내반증': 6,
    '안검염': 7,
    '안검종양': 8,
    '유루증': 9,
    '핵경화': 10,
}

model = tf.keras.models.load_model("test_model.h5")

@csrf_exempt
def dog_diagnosis(request):
    if request.method == 'POST':
        try:
            req = json.loads(request.body)
            imgUrl = req['img']
            print(imgUrl)
            res = requests.get(imgUrl).content
            img = Image.open(BytesIO(res)).resize((224, 224)).convert('RGB')
            result = predict_dog_disease_top3(img)
            return JsonResponse({'result': result})
        except KeyError:
            return JsonResponse({'error': 'imgUrl not provided'}, status=400)
        
    if request.method == 'GET':
        return HttpResponse('Get Create')

@csrf_exempt
def none_user_dog_diagnosis(request):
    if request.method == 'POST':
        try:
            image_file = request.FILES['img']
            img = Image.open(image_file).resize((224, 224)).convert('RGB')
            result = predict_dog_disease_top3(img)
            return JsonResponse({'result': result})
        except KeyError:
            return JsonResponse({'error': 'No image provided'}, status=400)
        
    if request.method == 'GET':
        return HttpResponse('Get Create')

def predict_dog_disease(img):
    img = img_to_array(img)
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

def predict_dog_disease_top3(img):
    img = img_to_array(img)
    img = img.reshape((1, img.shape[0], img.shape[1], img.shape[2]))
    img = preprocess_input(img)
    prediction = model.predict(img)
    df = pd.DataFrame({'pred':prediction[0]})
    df = df.sort_values(by='pred', ascending=False, na_position='first')

    top3_result = []
    for i in range(3):
        for x in class_dictionary:
            if class_dictionary[x] == (df[df == df.iloc[i]].index[i]):
                top3_result.append(x)
                break
    # 배열 요소를 형식에 맞게 변환하여 새로운 배열 생성
    formatted_array = [f"{index+1}. {item}" for index, item in enumerate(top3_result)]
    # 배열을 문자열로 변환
    formatted_string = " ".join(formatted_array)
    return formatted_string