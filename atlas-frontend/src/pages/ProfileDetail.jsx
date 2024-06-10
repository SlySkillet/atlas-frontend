import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProfileDetail = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { profileId } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/profiles/${profileId}`,
                );
                if (response.ok) {
                    const profileData = await response.json();
                    setProfile(profileData);
                } else {
                    setError('Failed to fetch profile');
                }
            } catch (error) {
                return console.error('Error', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [profileId]);

    console.log('PROFILE == ', profile);
    if (loading) {
        return <div>Loading...</div>;
    }
    return <div>{profile.user.username}</div>;
};

export default ProfileDetail;
