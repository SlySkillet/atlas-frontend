import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetProfileQuery,
    useUpdateProfileMutation,
} from '../features/user/profileApiService';
import { setProfile } from '../features/user/profileSlice';

const ProfileForm = () => {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        data: profile,
        error,
        isLoading,
    } = useGetProfileQuery(user.profile_id, { skip: !user.profile_id });

    const [updateProfile] = useUpdateProfileMutation();

    const [profileFormData, setProfileFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        image: '',
    });

    useEffect(() => {
        if (profile) {
            setProfileFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                bio: profile.bio || '',
                image: profile.image || '',
            });
        }
    }, [profile]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfileFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (user && user.profile_id) {
            const { data, error } = await updateProfile({
                profile_id: user.profile_id,
                profileData: profileFormData,
            });
            if (data) {
                dispatch(setProfile(data));
                localStorage.setItem('profile', JSON.stringify(data));
                navigate('/');
            } else {
                console.error(error);
            }
        }
    };

    if (!user) {
        return <div>Log in to edit or create profile</div>;
    }
    if (isLoading) {
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
