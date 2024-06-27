import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAndFetchProfile } from '../features/user/thunks';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {};

        data.username = username;
        data.password = password;

        try {
            const userData = await dispatch(
                loginAndFetchProfile(data),
            ).unwrap();
            console.log(userData);
            console.log(`${username} was logged in successfully`);
            navigate('/');
        } catch (error) {
            console.error('failed to login: ', error);
        }

        // const loginUserURL = `http://localhost:8000/api/login/`;
        // const fetchConfig = {
        //     method: 'POST',
        //     body: JSON.stringify(data),
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // };

        // const response = await fetch(loginUserURL, fetchConfig);
        // if (response.ok) {
        //     const userData = await response.json();
        //     console.log(`${data.username} is logged in successfully`);
        //     localStorage.setItem('user', JSON.stringify(userData));
        //     dispatch(login(userData));
        //     navigate('/');
        // }
    };
    return (
        <div>
            <h1>Login</h1>
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
                <button>submit</button>
            </form>
        </div>
    );
};

export default LoginForm;
