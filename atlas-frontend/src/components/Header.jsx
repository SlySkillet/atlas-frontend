import './header.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAndClearProfile } from '../features/user/thunks';

const Header = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

            // remove user and profile from store and localStorage
            dispatch(logoutAndClearProfile());
            navigate('/');
        }
    };
    return (
        <div className="container mx-auto flex flex-wrap justify-start md:col-span-2 lg:col-span-3 xl:col-span-4">
            <h1 className="text-3xl font-bold underline">Hoppin</h1>
            {user ? (
                <>
                    <p>{user.username}</p>
                    <button className="button" onClick={handleLogout}>
                        Logout
                    </button>
                    {/* PREV HEADERS - Links now contained in footer.jsx */}
                    {/* <a className="button" href="/myprofile">
                        my profile
                    </a>
                    <a className="button" href="/browse-profiles">
                        browse
                    </a>
                    <a className="button" href="/beaconfeed">
                        feed
                    </a>
                    <a className="button" href="/map">
                        map
                    </a> */}
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
