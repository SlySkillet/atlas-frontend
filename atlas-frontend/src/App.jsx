import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import SignupForm from './pages/SignupForm';
import ProfileForm from './pages/ProfileForm';
import LoginForm from './pages/LoginForm';
import UserProfile from './pages/UserProfile';
import BrowseProfiles from './pages/BrowseProfiles';

function App() {
    return (
        <div className="container">
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/create-profile" element={<ProfileForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/myprofile" element={<UserProfile />} />
                    <Route
                        path="/browse-profiles"
                        element={<BrowseProfiles />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
