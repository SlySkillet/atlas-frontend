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
    const [isPending, setIsPending] = useState({
        pending: false,
        cancelRequestUrl: null,
    });
    const [isRequested, setIsRequested] = useState({
        requested: false,
        acceptRequestUrl: null,
        rejectRequestUrl: null,
    });
    const { data: requestsPending, refetch: refetchSentRequests } =
        useGetSentRequestsQuery();
    const { data: requestsReceived, refetch: refetchReceivedRequests } =
        useGetReceivedRequestsQuery();

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

    // Check if current user has sent a request to this profile
    useEffect(() => {
        if (requestsPending) {
            for (let req of requestsPending) {
                if (req.to_user_profile_id === parseInt(profileId)) {
                    setIsPending({
                        pending: true,
                        cancelRequestUrl: req.request_detail,
                    });
                }
            }
        }
    }, [requestsPending, profileId]);

    console.log('pending --> ', isPending);

    // Check if this profile has requested current user
    useEffect(() => {
        if (requestsReceived) {
            for (let req of requestsReceived) {
                if (req.from_user_profile_id === parseInt(profileId)) {
                    setIsRequested({
                        requested: true,
                        acceptRequestUrl: req.request_accept,
                        rejectRequestUrl: req.request_reject,
                    });
                }
            }
        }
    }, [requestsReceived, profileId]);

    console.log('requested --> ', isRequested);

    // BUTTONS AND CLICK HANDLERS
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
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            refetchSentRequests();
            // update profile state in store
        }
    };

    const handleCancelRequest = async () => {
        const csrfToken = getCSRFToken();
        const requestUrl = isPending.cancelRequestUrl;
        const fetchConfig = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        };
        const response = await fetch(requestUrl, fetchConfig);
        if (response.ok) {
            console.log(response.status, 'request deleted');
            setIsPending({
                pending: false,
                cancelRequestUrl: null,
            });
            refetchSentRequests();
            // update profile state in store
        }
        console.log(response);
    };

    const handleAcceptRequest = async () => {
        const csrfToken = getCSRFToken();
        const requestUrl = isRequested.acceptRequestUrl;
        const fetchConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        };
        const response = await fetch(requestUrl, fetchConfig);
        if (response.ok) {
            console.log(response.status, 'request accepted');
            setIsRequested({
                pending: false,
                acceptRequestUrl: null,
                rejectRequestUrl: null,
            });
            refetchReceivedRequests();
            setFriend(true);
            // update profile state in store
        }
    };

    // HANDLE REJECT REQUEST

    const handleRejectRequest = async () => {
        const csrfToken = getCSRFToken();
        const requestUrl = isRequested.rejectRequestUrl;
        const fetchConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        };
        const response = await fetch(requestUrl, fetchConfig);
        if (response.ok) {
            console.log(response.status, 'request rejected');
            setIsRequested({
                pending: false,
                acceptRequestUrl: null,
                rejectRequestUrl: null,
            });
            refetchReceivedRequests();
            setFriend(false);
        }
    };

    const addFriendActionButton = (isPending, isRequested) => {
        // Determines the action given to the user depending on the non-friend status.
        // Function reads if a friend request for this profile exists and if the current
        // user received the request or initiated the request. Actions to cancel a
        // pending request, accept a received request, reject a received request, or create
        // a new request are provided accordingly

        if (isPending.pending) {
            return (
                <div>
                    pending...{' '}
                    <button onClick={handleCancelRequest}>cancel</button>
                </div>
            );
        } else if (isRequested.requested) {
            return (
                <div>
                    {profile.user.username} requested to add you as a friend.{' '}
                    <button onClick={handleAcceptRequest}>accept</button>
                    <button onClick={handleRejectRequest}>reject</button>
                </div>
            );
        } else {
            return <button onClick={handleAddFriend}>add</button>;
        }
    };

    // PAGE RENDERING

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
            <div>
                {friend ? (
                    <button>remove</button>
                ) : (
                    addFriendActionButton(isPending, isRequested)
                )}
            </div>
            {/* {friend ? (
                <button>remove</button>
            ) : (
                <button onClick={handleAddFriend}>add</button>
            )} */}
        </div>
    );
};

export default ProfileDetail;
