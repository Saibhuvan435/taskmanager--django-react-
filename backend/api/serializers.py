from rest_framework.serializers import ModelSerializer
from .models import Task,Profile
from django.contrib.auth.models import User

class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class ProfileSerializer(ModelSerializer):
    class Meta:
        model=Profile
        fields = '__all__'