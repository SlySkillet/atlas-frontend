import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetProfileQuery } from '../features/user/profileApiService';
import { setProfile } from '../features/user/profileSlice';
import {
    useGetFriendsQuery,
    useRemoveFriendMutation,
} from '../features/user/friendsApiService';
import { setFriends } from '../features/user/friendsSlice';
import {
    useGetReceivedRequestsQuery,
    useAcceptRequestMutation,
    useRejectRequestMutation,
} from '../features/friendrequests/requestsApiService';
import { setReceivedRequests } from '../features/friendrequests/friendRequestsSlice';
import { useEffect } from 'react';

const UserProfile = () => {
    const user = useSelector((state) => state.user.user);

    // Retrieve and set Profile
    const { data: userProfile } = useGetProfileQuery(user.profile_id);
    const dispatch = useDispatch();
    useEffect(() => {
        if (userProfile) {
            dispatch(setProfile(userProfile));
        }
    }, [userProfile, dispatch]);

    const profile = useSelector((state) => state.profile.profile);
    // NOTE: update to handle errors, edgecases (profile not accessed gracefully),
    // loading, etc. This will require an update to profileSlice and profile fetching
    // logic located in thunks.js.

    // --- Retrieve and set FriendsList --- //
    const { data: friendsList, refetch: refetchFriendsList } =
        useGetFriendsQuery();
    useEffect(() => {
        if (friendsList) {
            dispatch(setFriends(friendsList));
        }
    }, [friendsList, dispatch]);
    const friends = useSelector((state) => state.friends.friends);

    // --- Retrieve and set incoming friend requests --- //

    const { data: friendRequests, refetch: refetchFriendRequests } =
        useGetReceivedRequestsQuery();
    useEffect(() => {
        if (friendRequests) {
            dispatch(setReceivedRequests(friendRequests));
        }
    });
    const activeRequests = useSelector(
        (state) => state.friendRequests.receivedRequests,
    );

    // --- Retrieve User's Beacons --- //
    // (establish create-beacon flow before implementing this logic)

    // =============================CLICK HANDLERS================================

    // --- Remove Friend --- //

    const [
        removeFriend,
        { isLoading: isRemoveFriendLoading, error: removeFriendError },
    ] = useRemoveFriendMutation();
    const handleRemoveFriend = async (profileId) => {
        try {
            await removeFriend(profileId).unwrap();
            refetchFriendsList();
        } catch (error) {
            console.error('Failed to remove friend', error);
        }
    };

    // --- Accept Request --- //

    const [
        acceptRequest,
        { isLoading: isAcceptRequestLoading, error: acceptRequestError },
    ] = useAcceptRequestMutation();
    const handleAcceptRequest = async (reqId) => {
        try {
            await acceptRequest(reqId).unwrap();
            refetchFriendRequests();
            refetchFriendsList();
        } catch (error) {
            console.error('Failed to accept request', error);
        }
    };

    // --- Reject Request --- //
    const [
        rejectRequest,
        { isLoading: isRejectRequestLoading, error: rejectRequestError },
    ] = useRejectRequestMutation();
    const handleRejectRequest = async (reqId) => {
        try {
            await rejectRequest(reqId).unwrap();
            refetchFriendRequests();
        } catch (error) {
            console.error('Failed to reject request', error);
        }
    };

    // =============================PAGE RENDERING================================
    if (!user) {
        return <div>log in to view your profile</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <a href="/create-profile">edit profile</a>
            <div>
                {profile.first_name} {profile.last_name}
            </div>
            <div>{profile.bio}</div>
            <div>{profile.image}</div>
            <h3>{`Friends [${friends.length}]`}</h3>
            <div>
                {friends.map((f, idx) => {
                    return (
                        <div key={idx}>
                            <Link to={`/profile/${f.user.profile_id}`}>
                                {f.user.username}
                            </Link>
                            <button
                                onClick={() =>
                                    handleRemoveFriend(f.user.profile_id)
                                }
                            >
                                {isRemoveFriendLoading
                                    ? 'Removing...'
                                    : 'Remove'}
                            </button>
                            {removeFriendError && (
                                <div>Error: {removeFriendError.message}</div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div>
                <h3>{`Friend Requests [${activeRequests.length}]`}</h3>
                <div>
                    {activeRequests.map((request, idx) => {
                        return (
                            <div key={idx}>
                                <div>{request.from_user_username}</div>
                                <Link
                                    to={`/profile/${request.from_user_profile_id}`}
                                >
                                    view profile
                                </Link>
                                <button
                                    onClick={() =>
                                        handleAcceptRequest(request.id)
                                    }
                                >
                                    {isAcceptRequestLoading
                                        ? 'Pending...'
                                        : 'Accept'}
                                </button>
                                {acceptRequestError && (
                                    <div>
                                        Error: {acceptRequestError.message}{' '}
                                    </div>
                                )}
                                <button
                                    onClick={() =>
                                        handleRejectRequest(request.id)
                                    }
                                >
                                    {isRejectRequestLoading
                                        ? 'Pending...'
                                        : 'Reject'}
                                </button>
                                {rejectRequestError && (
                                    <div>
                                        Error: {rejectRequestError.message}{' '}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <h3>Beacons</h3>
            <h5>Past</h5>
            <h5>Live</h5>
            <h5>Scheduled</h5>
        </div>
    );
};

export default UserProfile;
