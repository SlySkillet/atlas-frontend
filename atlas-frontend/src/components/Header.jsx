import './header.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAndClearProfile } from '../features/user/thunks';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState } from 'react';

const Header = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

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

    const toggleMenuOpen = () => {
        setMenuOpen((prevState) => !prevState);
    };
    const handleCloseMenu = () => {
        setMenuOpen(false);
    };
    return (
        <div className="container mx-auto flex items-center justify-between p-2 md:col-span-2 lg:col-span-3 xl:col-span-4">
            <h1 className="text-3xl font-bold underline">Hoppin</h1>
            {user ? (
                <>
                    <p>{user.username}</p>
                    <GiHamburgerMenu
                        className="text-xl"
                        onClick={toggleMenuOpen}
                    />
                    <button className="hidden" onClick={handleLogout}>
                        Logout
                    </button>
                    {menuOpen && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4">
                            <div className="bg-mine-shaft-800 rounded-lg shadow-lg">
                                <p className="border-b p-4 pl-20 pr-20 text-white">
                                    Logout
                                </p>
                                <p className="border-b p-4 pl-20 pr-20 text-white">
                                    Edit Profile
                                </p>
                                <p className="border-b p-4 pl-20 pr-20 text-white">
                                    Settings
                                </p>
                                <p className="p-4 pl-20 pr-20 text-white">
                                    Help
                                </p>
                            </div>
                            <div className="bg-mine-shaft-800 rounded-lg shadow-lg">
                                <p
                                    className="p-4 pl-20 pr-20 text-white"
                                    onClick={handleCloseMenu}
                                >
                                    Close Menu
                                </p>
                            </div>
                        </div>
                    )}
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
