import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetFriendsQuery } from '../features/user/friendsApiService';
import { setFriends } from '../features/user/friendsSlice';
import { useDispatch } from 'react-redux';
import {
    useGetReceivedRequestsQuery,
    useGetSentRequestsQuery,
    useCancelSentRequestMutation,
} from '../features/friendrequests/requestsApiService';
import {
    setSentRequests,
    setReceivedRequests,
} from '../features/friendrequests/friendRequestsSlice';

const ProfileDetail = () => {
    // RETRIEVE PROFILE: retrieve profile with useParams
    const [profile, setProfile] = useState({});
    const [componentLoading, setComponentLoading] = useState(true);
    const { profileId } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/profiles/${profileId}/`,
                );
                if (response.ok) {
                    const profileData = await response.json();
                    setProfile(profileData);
                }
            } catch (error) {
                return console.error('error fetching profile:', error);
            } finally {
                setComponentLoading(false);
            }
        };
        fetchProfile();
    }, [profileId]);

    // CHECK FRIEND STATUS: check friend status with authenticated user
    // query database

    // NOTE: this can break off into another component to handle loading,
    // and error to sepparate concerns.
    const { data: friendsList } = useGetFriendsQuery();
    const dispatch = useDispatch();
    const [isFriend, setIsFriend] = useState(false);

    // update store
    useEffect(() => {
        if (friendsList) {
            dispatch(setFriends(friendsList));
        }
    }, [friendsList, dispatch]);

    // check if current profile (viewed) is a friend of the user
    useEffect(() => {
        const checkFriendshipStatus = async () => {
            if (friendsList) {
                const friendIds = new Set(friendsList.map((f) => f.id));

                // check friend request status with authenticated user
                setIsFriend(friendIds.has(parseInt(profileId)));
            } else {
                setIsFriend(false);
            }
        };
        checkFriendshipStatus();
    }, [friendsList, profileId]);

    // CHECK FRIEND REQUEST STATUS: check if user has either received or
    // sent a request to this profile
    // imports
    const { data: requestsPending, refetch: refetchRequestsPending } =
        useGetSentRequestsQuery();
    const [isRequestPending, setIsRequestPending] = useState({
        isPending: false,
        cancelRequestId: null,
    });

    const { data: requestsReceived } = useGetReceivedRequestsQuery();
    const [isRequestReceived, setIsRequestReceived] = useState(false);

    useEffect(() => {
        if (requestsPending) {
            dispatch(setSentRequests(requestsPending));
        }
    }, [requestsPending, dispatch]);

    useEffect(() => {
        const checkForSentRequest = async () => {
            if (requestsPending) {
                for (let req of requestsPending) {
                    if (req.to_user_profile_id === parseInt(profileId)) {
                        setIsRequestPending({
                            isPending: true,
                            cancelRequestId: req.id,
                        });
                        break;
                    }
                }
            } else {
                setIsRequestPending({
                    isPending: false,
                    cancelRequestId: null,
                });
            }
        };
        checkForSentRequest();
    }, [requestsPending, profileId]);

    useEffect(() => {
        if (requestsReceived) {
            dispatch(setReceivedRequests(requestsReceived));
        }
    });

    useEffect(() => {
        const checkForReceivedRequest = async () => {
            if (requestsReceived) {
                for (let req of requestsReceived) {
                    if (req.from_user_profile_id === parseInt(profileId)) {
                        setIsRequestReceived(true);
                    } else {
                        setIsRequestReceived(false);
                    }
                }
            }
        };
        checkForReceivedRequest();
    }, [requestsReceived, profileId]);

    const renderNonFriendActionButton = (isRequestPending) => {
        // Helper function to determine the appropriate action button depending on
        // any existing friend requests for the user and the displayed profile
        if (isRequestPending.isPending) {
            return (
                <div>
                    pending...
                    <button
                        onClick={() =>
                            handleCancelPendingRequest(
                                isRequestPending.cancelRequestId,
                            )
                        }
                    >
                        cancel request
                    </button>
                </div>
            );
        } else if (isRequestReceived) {
            return (
                <div>
                    <button>accept</button> <button>reject</button>{' '}
                </div>
            );
        } else {
            return <button>add friend</button>;
        }
    };

    //

    // USER ACTION HANDLERS

    // remove friend

    // request friend

    // cancel friend request (sent)
    const [cancelSentRequest] = useCancelSentRequestMutation();
    const handleCancelPendingRequest = async (reqId) => {
        try {
            await cancelSentRequest(reqId).unwrap();
            refetchRequestsPending();
            setIsRequestPending({
                isPending: false,
                cancelRequestId: null,
            });
        } catch (error) {
            console.error('Failed to cancel request', error);
        }
    };

    // reject friend request (received)

    // accept friend request (received)

    // RENDER PAGE
    if (componentLoading) {
        return <div>loading...</div>;
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
                {isFriend ? (
                    <button>remove</button>
                ) : (
                    renderNonFriendActionButton(isRequestPending)
                )}
            </div>
        </div>
    );
};

export default ProfileDetail;
