import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
    const user = useSelector((state) => state.user.user);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [profileFormData, setProfileFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        image: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.profile) {
                try {
                    const response = await fetch(user.profile);
                    if (response.ok) {
                        const profileData = await response.json();
                        setProfile(profileData);
                        setProfileFormData({
                            first_name: profileData.first_name || '',
                            last_name: profileData.last_name || '',
                            bio: profileData.bio || '',
                            image: profileData.image || '',
                        });
                    } else {
                        setError('Failed to fetch profile data');
                    }
                } catch (error) {
                    console.error('Error: ', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfileFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const createProfileURL = user.profile;
        const fetchConfig = {
            method: 'PUT',
            body: JSON.stringify(profileFormData),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(createProfileURL, fetchConfig);
        if (response.ok) {
            const profileData = await response.json();
            console.log(profileData);
            navigate('/');
        }
    };

    if (!user) {
        return <div>Log in to edit or create profile</div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    if (!profile) {
        return <div>No profile associated with user</div>;
    }
    return (
        <div>
            <h1>Hello, {user.username}! Create your profile here:</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={profileFormData.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={profileFormData.last_name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        cols="50"
                        value={profileFormData.bio}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/heif, image/heic"
                        id="image"
                        name="image"
                        value={profileFormData.image}
                        onChange={handleChange}
                    />
                </div>
                <button>save</button>
            </form>
        </div>
    );
};

export default ProfileForm;
