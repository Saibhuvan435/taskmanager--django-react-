from django.urls import path
from . import views

urlpatterns = [
    path('',views.getOverview),
    path('task/<int:task_id>/',views.getTask),
    path('tasks/<int:profile_id>/',views.getTasks),
    path('taskStatus/<int:task_id>/',views.changeStatus),
    path('createTask/<int:profile_id>/',views.createTask),
    path('tasks/uncompleted/<int:profile_id>/',views.getUncompletedTasks),
    path('tasks/completed/<int:profile_id>/',views.getCompletedTasks),
    path('register/',views.registerAuth),
    path('login/',views.loginAuth),
]