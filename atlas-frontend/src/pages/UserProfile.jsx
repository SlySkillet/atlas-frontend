import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const user = useSelector((state) => state.user.user);
    const profile = useSelector((state) => state.profile.profile);

    // NOTE: update to handle errors, edgecases (profile not accessed gracefully),
    // loading, etc. This will require an update to profileSlice and profile fetching
    // logic located in thunks.js.

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
            <h3>Friends</h3>
            <div>
                {profile.friends.map((f, idx) => {
                    return (
                        <div key={idx}>
                            <Link to={`/profile/${f.profile_id}`}>
                                {f.username}
                            </Link>
                            <button>remove</button>
                        </div>
                    );
                })}
            </div>
            <h3>Beacons</h3>
            <h5>Past</h5>
            <h5>Live</h5>
            <h5>Scheduled</h5>
        </div>
    );
};

export default UserProfile;
