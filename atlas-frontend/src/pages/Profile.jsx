import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.profile) {
                console.log(user.profile);
                try {
                    const response = await fetch(user.profile);
                    if (response.ok) {
                        const profileData = await response.json();
                        setProfile(profileData);
                    } else {
                        setError('Failed to fetch profile');
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

    if (!user) {
        return <div>log in to view your profile</div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <div>
                {profile.first_name} {profile.last_name}
            </div>
            <div>{profile.bio}</div>
        </div>
    );
};

export default Profile;
