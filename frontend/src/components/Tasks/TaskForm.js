import React, { useState } from 'react'
import classes from './TaskForm.module.css'
import FormBox from '../UI/FormBox'
import Card from '../UI/Card'
import Input from '../UI/Input'
import Button from '../UI/Button'

const TaskForm = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({
    title: '',
    body: ''
  })
  const titleHandler = (e) => {
    setTitle(e.target.value)
  }

  const bodyHandler = (e) => {
    setBody(e.target.value)
  }

  const inputsValidator = () => {
    let newErrors = {};
    let isValid = true;
    if (body.trim().length === 0) {
      isValid = false;
      newErrors.body = 'Body input is required';
      console.log('body xd')
    }
    if (title.trim().length === 0) {
      isValid = false;
      newErrors.title = 'Title input is required';
    }
    setErrors(newErrors);
    return isValid;
  }

  const createTaskHandler = async (e) => {
    e.preventDefault()
    if (inputsValidator()) {
      try {
        const formData = {
          'title': title,
          'body': body
        }
        const profile_id = localStorage.getItem('profile_id')

        const response = await fetch(`http://127.0.0.1:8000/api/createTask/${profile_id}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          setMessage('Task created!!!')
          setBody('')
          setTitle('')
        } else {
          setMessage(response.message)
        }
      } catch (err) {
        setMessage('Error occured', err)
      }
    }
  }
  return (
    <Card>
      <FormBox onSubmit={createTaskHandler}>
        <Input onChange={titleHandler} type='text' id='title' name='title' placeholder='title' value={title} />
        <Input className={`${classes.input} ${classes.inputForm}`} onChange={bodyHandler} type='textarea' id='body' name='body' placeholder='body' value={body} />
        <Button type='submit'>Create</Button>
        {errors.body && (<div className='error-message'>{errors.body}</div>)}
        {errors.title && (<div className='error-message'>{errors.title}</div>)}
        {message && (<div className='error-message'>{message}</div>)}
      </FormBox>
    </Card>
  )
}

export default TaskForm