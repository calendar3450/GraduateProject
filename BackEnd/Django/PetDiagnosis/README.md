# GraduateProject - Django Part

test_model.h5를 용량으로 인해 제외하였습니다.
PetDiagnosis파일에 .h5 파일을 추가해서 코드를 실행하시면 됩니다.
PetDiagnosis/diagnosis/views.py 에서
model = tf.keras.models.load_model("test_model.h5")
위 코드만 변경하시면 됩니다.

\*가상 환경을 켜시고 python manage.py runserver를 하시면 서버를 켤 수 있습니다.
