import './header.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';

const Header = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const handleLogout = async (event) => {
        event.preventDefault();
        console.log(user);
        const data = {};
        data.id = user.id;
        data.username = user.username;
        const logoutUserURL = `http://localhost:8000/api/logout/`;
        const fetchConfig = {
            method: 'POST',
            body: {},
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(logoutUserURL, fetchConfig);
        if (response.ok) {
            console.log(`${user.username} logged out`);
            dispatch(logout());
        }
    };
    return (
        <div className="header-container">
            <h1>Atlas Social</h1>
            {user ? (
                <>
                    <button className="button" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <a className="button" href="/signup">
                        Signup
                    </a>
                    <a className="button" href="/login">
                        Login
                    </a>
                </>
            )}
        </div>
    );
};

export default Header;
