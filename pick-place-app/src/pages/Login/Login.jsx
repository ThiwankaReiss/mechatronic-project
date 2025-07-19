import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/check-user/', { username });
            console.log('Username response:', response.data);

            if (response.data === 'user available') {
                const { value: pin } = await Swal.fire({
                    title: 'Enter PIN',
                    input: 'text',
                    inputLabel: 'PIN Number',
                    inputPlaceholder: 'Enter your 4-digit PIN',
                    showCancelButton: true,
                    confirmButtonText: 'Send',
                    inputAttributes: {
                        maxlength: 4,
                        autocapitalize: 'off',
                        autocorrect: 'off',
                        inputmode: 'numeric'
                    }
                });

                if (pin) {
                    try {
                        const pinResponse = await axios.post('/verify-pin/', {
                            username,
                            pin
                        });

                        console.log('PIN response:', pinResponse.data);

                        if (pinResponse.data === 'valid pin') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Login successful!',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            navigate('/'); //  Redirect to homepage
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Invalid PIN',
                                text: 'Please try again.'
                            });
                        }
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'PIN Verification Failed',
                            text: error.response?.data || 'Something went wrong.'
                        });
                    }
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'User Not Found',
                    text: 'No user found with that username.'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data || 'Something went wrong.'
            });
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className='container p-0 min-vh-100 d-flex align-items-center bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300'>
            <div className='row w-100 justify-content-center'>
                <div className='col-lg-4'>
                    <form onSubmit={handleLogin}>
                        <h1 className="h3 mb-3 fw-normal">Please Login</h1>

                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Username</label>
                        </div>

                        <button className="btn btn-primary w-100 py-2" type="submit">
                            Login
                        </button>

                        <div className='d-flex justify-content-end'>
                            <button
                                className="btn btn-warning mt-2"
                                type="button"
                                onClick={goToRegister}
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
