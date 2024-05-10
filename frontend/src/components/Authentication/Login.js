import React, { useState } from 'react'
import FormBox from '../UI/FormBox'
import Card from '../UI/Card'
import Input from '../UI/Input'
import Button from '../UI/Button'
import { useNavigate } from 'react-router-dom'



const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [formErrors, setFormErrors] = useState({
        username: '',
        password: '',
        message: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const validateForm = () => {
        let errors = {}
        let isValid = true;

        if (formData.username.trim() === '') {
            errors.username = 'Username is required';
            isValid = false;
        }
        if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                const data = await response.json()
                if(response.ok){
                    localStorage.setItem('profile_id', data.profile_id);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('auth', true);
                    console.log(response.message)
                    navigate("/")
                }else{
                    let errors = {};
                    errors.message = data.message
                    setFormErrors(errors)
                    console.log(data.message)
                }
            } catch (err) {
                console.log('Something went wrong', err)
            }
        }
    }


    return (
        <Card>
            <FormBox form-text={'You dont have an account yet? Sign up for free...'} path={'/register'} onSubmit={submitHandler}>
                <Input onChange={handleChange} type='text' id='username' name='username' placeholder='Username' value={formData.username} />
                {formErrors.username && (
                    <div className='error-message'>{formErrors.username}</div>
                )}
                <Input onChange={handleChange} type='password' id='password' name='password' placeholder='Password' value={formData.password} />
                {formErrors.password && (
                    <div className='error-message'>{formErrors.password}</div>
                )}
                {formErrors.message && (
                    <div className='error-message'>{formErrors.message}</div>
                )}
                <Button type={'submit'}>Login</Button>
            </FormBox>
        </Card>
    )
}

export default Login