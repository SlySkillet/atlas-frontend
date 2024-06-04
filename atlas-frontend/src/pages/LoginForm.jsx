import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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

        const loginUserURL = `http://localhost:8000/api/login/`;
        const fetchConfig = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(loginUserURL, fetchConfig);
        if (response.ok) {
            console.log(`${data.username} is logged in successfully`);
            navigate('/');
        }
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
