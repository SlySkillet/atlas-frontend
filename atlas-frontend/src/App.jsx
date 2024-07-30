import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import SignupForm from './pages/SignupForm';
import ProfileForm from './pages/ProfileForm';
import LoginForm from './pages/LoginForm';
import UserProfile from './pages/UserProfile';
import BrowseProfiles from './pages/BrowseProfiles';
import ProfileDetail from './pages/ProfileDetail';
import BeaconFeed from './pages/BeaconFeed';
// import BeaconMap from './pages/Map';
import NewMap from './pages/MapNew';
import CreateBeaconForm from './pages/CreateBeaconForm';
import Footer from './components/Footer';

function App() {
    return (
        <div className="grid h-screen grid-rows-[auto_1fr_auto]">
            <BrowserRouter>
                <Header />
                <main className="overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route path="/signup" element={<SignupForm />} />
                        <Route
                            path="/create-profile"
                            element={<ProfileForm />}
                        />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/myprofile" element={<UserProfile />} />
                        <Route
                            path="/browse-profiles"
                            element={<BrowseProfiles />}
                        />
                        <Route
                            path="/profile/:profileId"
                            element={<ProfileDetail />}
                        />
                        <Route
                            path="/create-beacon"
                            element={<CreateBeaconForm />}
                        />
                        <Route path="/beaconfeed" element={<BeaconFeed />} />
                        {/* <Route path="/map" element={<BeaconMap />} /> */}
                        <Route path="/map" element={<NewMap />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
