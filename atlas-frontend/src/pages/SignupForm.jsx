import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAndFetchProfile } from '../features/user/thunks';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleUsernameChange = (event) => {
        const value = event.target.value;
        setUsername(value);
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
    };

    const handleConfirmpasswordChange = (event) => {
        const value = event.target.value;
        setConfirmpassword(value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {};

        data.username = username;
        data.password = password === confirmpassword ? password : null; // EDIT : need better handling for password mismatch

        const createUserURL = `http://localhost:8000/api/users/`;
        const fetchConfig = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(createUserURL, fetchConfig);

        if (response.ok) {
            try {
                const userData = await dispatch(
                    loginAndFetchProfile(data),
                ).unwrap();
                console.log(`${userData.username} was logged in successfully`);
                navigate('/create-profile');
            } catch (error) {
                console.error('failed to login: ', error);
            }
        }
    };
    return (
        <div>
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">username:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">password:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        onChange={handlePasswordChange}
                    />
                </div>
                <div>
                    <label htmlFor="confirmpassword">confirm password:</label>
                    <input
                        type="password"
                        name="confirmpassword"
                        id="confirmpassword"
                        required
                        onChange={handleConfirmpasswordChange}
                    />
                </div>
                <button>submit</button>
            </form>
        </div>
    );
};

export default SignupForm;
