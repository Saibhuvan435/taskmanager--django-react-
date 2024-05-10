from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
class Task(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField()
    date = models.DateField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    profile = models.ForeignKey(Profile,on_delete=models.CASCADE)

    def __str__(self):
        return self.title