import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Register.css';
import { useNavigate } from 'react-router-dom'; // 👈 Add this

const Register = () => {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate(); // 👈 Initialize navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(phone.trim())) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number must be exactly 10 digits.',
            });
            return;
        }

        const jason_obj = {
            username,
            phone,
        };

        console.log(jason_obj);

        try {
            const response = await axios.post('/reg/', jason_obj);
            console.log('Server response:', response.data);

            Swal.fire({
                icon: 'success',
                title: 'Registered!',
                text: 'You have been registered successfully.',
                confirmButtonText: 'Go to Login',
            }).then(() => {
                navigate('/login'); // 👈 Redirect to login on success
            });
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || 'Something went wrong.',
            });
        }
    };

    return (
        <div className='container p-0 min-vh-100 d-flex align-items-center bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300'>
            <div className='row w-100 justify-content-center'>
                <div className='col-lg-4'>
                    <form onSubmit={handleSubmit}>
                        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="floatingInput">User name</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="tel"
                                className="form-control"
                                id="floatingPhone"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength="10"
                                inputMode="numeric"
                            />
                            <label htmlFor="floatingPhone">Phone number</label>
                        </div>

                        <button className="btn btn-primary w-100 py-2" type="submit">
                            Sign in
                        </button>

                        <div className='d-flex justify-content-end'>
                            <button
                                className="btn btn-warning mt-2"
                                type="button"
                                onClick={() => navigate('/login')} // 👈 Navigate on Login button click
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
