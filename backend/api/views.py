from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import Task, Profile
from .serializers import TaskSerializer, ProfileSerializer


@api_view(['GET'])
def getOverview(request):
    data = {
        'task/{id_of_task}': 'get a single task by id (GET)',
        'tasks/{id_of_user}': 'get a all tasks for user',
        'tasks/uncompleted/{id_of_user}': 'get a uncompleted tasks for user',
        'tasks/completed/{id_of_user}': 'get a completed tasks for user',
        'createTask/': 'create task api (POST)',
        'taskStatus/{id_of_task}': 'change status of task (PUT)',
        'register/': 'register api (POST)',
        'login/': 'login api (POST)',
    }
    return Response(data)


@api_view(['GET'])
def getCompletedTasks(request, profile_id):
    try:
        profile = Profile.objects.get(id=profile_id)
        tasks = Task.objects.filter(profile=profile, completed=True)

        if tasks.exists():
            tasks_serialized = TaskSerializer(tasks, many=True)
            return Response(tasks_serialized.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No completed tasks found for this profile.'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'message': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getUncompletedTasks(request, profile_id):
    try:
        profile = Profile.objects.get(id=profile_id)
        tasks = Task.objects.filter(profile=profile, completed=False)

        if tasks.exists():
            tasks_serialized = TaskSerializer(tasks, many=True)
            return Response(tasks_serialized.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No uncompleted tasks found for this profile.'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'message': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getTask(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task_serialized = TaskSerializer(task, many=False)
        return Response(task_serialized.data)
    except Task.DoesNotExist:
        return Response({'message': 'Task doesnt exists...'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getTasks(request, profile_id):
    try:
        profile = Profile.objects.get(id=profile_id)
        tasks = Task.objects.filter(profile=profile)

        if tasks.exists():
            tasks_serialized = TaskSerializer(tasks, many=True)
            return Response(tasks_serialized.data)
        else:
            return Response({'message': 'You dont have any tasks...'}, status=status.HTTP_404_NOT_FOUND)

    except User.DoesNotExist:
        return Response({'message': 'User not found...'}, status=status.HTTP_404_NOT_FOUND)

    except Profile.DoesNotExist:
        return Response({'message': 'Profile not found...'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def createTask(request, profile_id):
    if request.method == 'POST':
        try:
            profile = Profile.objects.get(id=profile_id)
            title = request.data.get('title')
            body = request.data.get('body')
            if all([title, body]):
                Task.objects.create(title=title, body=body, profile=profile)
                return Response({'message': 'Task created successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Both title and body are required'}, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return Response({'message': 'Your profile doesn\'t exist anymore...'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({'error': 'Invalid request method. This API endpoint only supports POST requests.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def changeStatus(request, task_id):
    print(task_id)
    try:
        task = Task.objects.get(id=task_id)

        if task.completed:
            task.completed = False
            task.save()
            return Response({'message': 'Task status changed from completed to uncompleted'}, status=status.HTTP_200_OK)
        else:
            task.completed = True
            task.save()
            return Response({'message': 'Task status changed from uncompleted to completed'}, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({'message': 'Task doesn\'t exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def loginAuth(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        if not all([username, password]):
            return Response({'message': 'Both username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            try:
                profile = Profile.objects.get(user=user)
                return Response({'message': 'Login success', 'profile_id': profile.id, 'username': username}, status=status.HTTP_200_OK)
            except Profile.DoesNotExist:
                return Response({'message': 'Profile doesn\'t exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid request method. This API endpoint only supports POST requests.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registerAuth(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        password_confirm = request.data.get('password_confirm')
        first_name = request.data.get('firstname')
        last_name = request.data.get('lastname')

        if not all([username, first_name, last_name, password, password_confirm]):
            return Response({'message': 'All inputs are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(username) < 8:
            return Response({'message': 'Username must be 8 characters or more.'}, status=status.HTTP_400_BAD_REQUEST)

        if password != password_confirm:
            return Response({'message': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'message': 'Username is already in use.'}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create_user(
            username=username, password=password, first_name=first_name, last_name=last_name)
        profile = Profile.objects.create(
            user=user, first_name=first_name, last_name=last_name)

        return Response({'message': 'Registration successful.', 'profile_id': profile.id, 'username': username}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Invalid request method. This API endpoint only supports POST requests.'}, status=status.HTTP_400_BAD_REQUEST)
