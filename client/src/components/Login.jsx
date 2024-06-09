import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations'; // Import the LOGIN mutation

const Login = ({ onClose }) => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const popupRef = useRef(null);

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const { token } = data.login;
      localStorage.setItem('token', token);
      onClose();
    },
    onError: (error) => {
      console.error('Login error:', error.message); // Log error to console
      setShowAlert(true);
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      try {
        await login({ variables: { ...userFormData } });
      } catch (err) {
        setShowAlert(true);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="popup">
      <div className="popup-inner" ref={popupRef}>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
            Something went wrong with your login credentials!
          </Alert>
          <Form.Group>
            <Form.Label htmlFor='email'>Email</Form.Label>
            <Form.Control className='form-control'
              type='email'
              placeholder='Your email'
              name='email'
              onChange={handleInputChange}
              value={userFormData.email}
              required
              isInvalid={validated && !userFormData.email}
            />
            <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor='password'>Password</Form.Label>
            <Form.Control className='form-control'
              type='password'
              placeholder='Your password'
              name='password'
              onChange={handleInputChange}
              value={userFormData.password}
              required
              isInvalid={validated && !userFormData.password}
            />
            <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
          </Form.Group>
          <Button
            disabled={loading || !(userFormData.email && userFormData.password)}
            type='submit'
            variant='success'>
            {loading ? 'Logging in...' : 'Submit'}
          </Button>
          <Button type='button' onClick={onClose} variant='secondary'>Close</Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
