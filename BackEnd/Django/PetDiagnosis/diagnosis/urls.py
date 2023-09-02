from django.urls import path

from . import views

urlpatterns = [
    path('dog/', views.dog_diagnosis),
    path('nonemember_dog/',views.none_user_dog_diagnosis),
]