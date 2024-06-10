import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProfileDetail = () => {
    // REQUIRES LOGIN: need redirect logic for unauthenticated user
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { profileId } = useParams();
    const user = useSelector((state) => state.user.user);
    const [friend, setFriend] = useState(false);

    // Fetch profile information
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

    // Check if User is in Profile's friends list
    useEffect(() => {
        if (profile.friends) {
            const friendsObj = {};
            for (let f of profile.friends) {
                friendsObj[f.profile_id] = f.username;
            }
            if (user.profile_id in friendsObj) {
                setFriend(true);
            }
        }
    }, [profile, user.profile_id]);

    // console.log('FRIEND?? => ', friend);
    console.log(profile);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <div>{profile.user.username}</div>
            <div>{profile.image}</div>
            <div>
                {profile.first_name} {profile.last_name}
            </div>
            <div>{profile.bio}</div>
            {friend ? <button>remove</button> : <button>add</button>}
        </div>
    );
};

export default ProfileDetail;
