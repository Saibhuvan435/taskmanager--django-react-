import React, { useEffect, useState } from 'react'
import classes from './Tasks.module.css'
import Wrapper from '../UI/Wrapper'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [message, setMessage] = useState('')
  const username = localStorage.getItem('username')
  const profile_id = localStorage.getItem('profile_id')
  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return ` ${month}/${date}/${year}`;
  }

  useEffect(() => {
    try {
      fetch(`http://127.0.0.1:8000/api/tasks/${profile_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then((res) => {
          if (!res.ok) {
            // Handle non-successful response (e.g., 404 Not Found)
            throw new Error('Tasks not found');
          }
          return res.json(); // Parse JSON if response is successful
        })
        .then((data) => {
          let responseData = Object.values(data)
          setTasks(responseData);
        })
        .catch((err) => {
          console.log('Error', err);
          setMessage(err.message);
        });
    } catch (err) {
      console.log('Error', err);
      setMessage(err.message);
    }
  }, [profile_id]);

  const changeStatus = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/taskStatus/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        console.log(response.message)
        try {
          fetch(`http://127.0.0.1:8000/api/tasks/${profile_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
              return res.json();
            })
            .then((data) => {
              let responseData = Object.values(data)
              setTasks(responseData);
            })
            .catch((err) => {
              console.log('Error', err);
              setMessage(err.message);
            });
        } catch (err) {
          console.log('Error', err);
          setMessage(err.message);
        }
      } else {
        console.log(response.message)
        setMessage(response.message)
      }
    } catch (err) {
      console.log('Something went wrong', err)
    }
  }


  return (
    <Wrapper>
      <div className={classes['welcome-container']}>
        <h1>Hello, {username}. Todays date:  {getDate()}</h1>
        {message && (<h1>{message}</h1>)}
      </div>
      <div>
        <h2>Your tasks:</h2>
        {tasks.map((task) => (
          <div key={task.id} className={classes['task-dashboard']}>
            <h1>{task.title} - {task.completed ? (
              <>
                <span className={classes.completed}>Completed</span>
              </>
            ) : (
              <>
                <span className={classes.uncompleted}>Uncompleted</span>
              </>
            )} </h1>
            <h2>{task.date}</h2>
            <p className={classes['dashboard-task-body']}>{task.body}</p>
            <button className={classes.statusButton} type='button' onClick={() => changeStatus(task.id)}>change status</button>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

export default Tasks