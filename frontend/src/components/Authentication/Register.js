import React, { useState } from 'react';
import Card from '../UI/Card';
import FormBox from '../UI/FormBox';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        password_confirm: '',
    });

    const [formErrors, setFormErrors] = useState({
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        password_confirm: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (formData.username.trim() === '') {
            errors.username = 'Username is required';
            isValid = false;
        }
        if (formData.username.length < 8) {
            errors.username = 'Username must be at least 8 characters';
            isValid = false;
        }

        if (formData.firstname.trim() === '') {
            errors.firstname = 'First name is required';
            isValid = false;
        }

        if (formData.lastname.trim() === '') {
            errors.lastname = 'Last name is required';
            isValid = false;
        }

        if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (formData.password !== formData.password_confirm) {
            errors.password_confirm = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('profile_id', data.profile_id);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('auth', true);
                    console.log(data.message);
                    navigate("/");
                } else {
                    let errors = {};
                    errors.message = data.message;
                    setFormErrors(errors);
                    console.log(data.message);
                }
            } catch (err) {
                console.log('Something went wrong', err);
            }
        }
    };
        return(
            <Card>
                <FormBox
                    form-text={'You have an account already? Login'}
                    path={'/login'}
                    onSubmit={submitHandler}
                    method='POST'
                >
                    <Input
                        onChange={handleChange}
                        type='text'
                        id='username'
                        name='username'
                        placeholder='Username'
                        value={formData.username}
                    />
                    {formErrors.username && (
                        <div className='error-message'>{formErrors.username}</div>
                    )}

                    <Input
                        onChange={handleChange}
                        type='text'
                        id='first_name'
                        name='firstname'
                        placeholder='First name'
                        value={formData.firstname}
                    />
                    {formErrors.firstname && (
                        <div className='error-message'>{formErrors.firstname}</div>
                    )}

                    <Input
                        onChange={handleChange}
                        type='text'
                        id='last_name'
                        name='lastname'
                        placeholder='Last name'
                        value={formData.lastname}
                    />
                    {formErrors.lastname && (
                        <div className='error-message'>{formErrors.lastname}</div>
                    )}

                    <Input
                        onChange={handleChange}
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                    />
                    {formErrors.password && (
                        <div className='error-message'>{formErrors.password}</div>
                    )}

                    <Input
                        onChange={handleChange}
                        type='password'
                        id='password_confirm'
                        name='password_confirm'
                        placeholder='Re-type password'
                        value={formData.password_confirm}
                    />
                    {formErrors.password_confirm && (
                        <div className='error-message'>{formErrors.password_confirm}</div>
                    )}
                    {formErrors.message && (
                        <div className='error-message'>{formErrors.message}</div>
                    )}
                    <Button type={'submit'}>Register</Button>
                </FormBox>
            </Card>
        );
};

export default Register;
