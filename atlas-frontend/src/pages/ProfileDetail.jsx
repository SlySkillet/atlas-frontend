import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import getCSRFToken from '../utils/auth';
import {
    useGetSentRequestsQuery,
    useGetReceivedRequestsQuery,
} from '../features/friendrequests/requestsApiService';

const ProfileDetail = () => {
    // REQUIRES LOGIN: need redirect logic for unauthenticated user
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { profileId } = useParams();
    const user = useSelector((state) => state.user.user);
    const [friend, setFriend] = useState(false);
    const { data: requestsPending } = useGetSentRequestsQuery();
    const { data: requestsReceived } = useGetReceivedRequestsQuery();

    console.log('pending --> ', requestsPending);
    console.log('received --> ', requestsReceived);

    // Fetch profile information
    // Setup with RTKQuery
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

    console.log(profile);

    const handleAddFriend = async () => {
        // create friend request instance in django
        const csrfToken = getCSRFToken();
        console.log(csrfToken);
        const requestUrl = `http://localhost:8000/api/profiles/${profileId}/request-friend/`;
        const fetchConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        };
        const response = await fetch(requestUrl, fetchConfig);
        const data = await response.json();
        console.log(data);
        //
    };

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
            {friend ? (
                <button>remove</button>
            ) : (
                <button onClick={handleAddFriend}>add</button>
            )}
        </div>
    );
};

export default ProfileDetail;
