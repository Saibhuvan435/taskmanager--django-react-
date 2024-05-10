import React, { useEffect, useState } from 'react'
import classes from './Tasks.module.css'
import Wrapper from '../UI/Wrapper'

const TasksCompleted = () => {
  const [message, setMessage] = useState('')
  const [completedTasks, setCompletedTasks] = useState([])
  const profile_id = localStorage.getItem('profile_id')
  const username = localStorage.getItem('username')

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return ` ${month}/${date}/${year}`;
  }

  useEffect(() => {
    try {
      fetch(`http://127.0.0.1:8000/api/tasks/completed/${profile_id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Http error! Status:${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          let responseData = Object.values(data)
          setCompletedTasks(responseData)
        })
        .catch((err) => {
          console.log('Error', err)
          setMessage('You haven\'t completed any task yet...')
        })
    } catch (err) {
      console.log('Something went wrong...', err)
    }
  }, [profile_id])

  const handleStatusChange = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/taskStatus/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const updatedTasks = completedTasks.filter(task => task.id !== id);
        setCompletedTasks(updatedTasks);
      } else {
        console.log(res.message);
        setMessage(res.message);
      }
    } catch (err) {
      console.log('Error occurred', err);
    }
  }

  return (
    <Wrapper>
      <div className={classes['welcome-container']}>
        <h1>Hello, {username}. Today's date:  {getDate()}</h1>
        {message && (<h1>{message}</h1>)}
      </div>
      <div>
        <h2>Your tasks:</h2>
        {completedTasks.map((task) => (
          <div key={task.id} className={classes['task-dashboard']}>
            <h1>{task.title} - <span className={classes.completed}>Completed</span></h1>
            <h2>{task.date}</h2>
            <p className={classes['dashboard-task-body']}>{task.body}</p>
            <button className={classes.statusButton} type='button' onClick={() => handleStatusChange(task.id)}>change status</button>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

export default TasksCompleted;
