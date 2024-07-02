import { useSelector } from 'react-redux';

const Welcome = () => {
    const user = useSelector((state) => state.user.user);
    if (!user) {
        return <div>Welcome to Hoppin</div>;
    } else {
        return <div>Hello {user.username}! Welcome to Atlas Social</div>;
    }
};

export default Welcome;
