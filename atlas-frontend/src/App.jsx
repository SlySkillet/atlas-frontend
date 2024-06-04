import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SignupForm from './pages/SignupForm';
import ProfileForm from './pages/ProfileForm';
import Welcome from './pages/Welcome';

function App() {
    return (
        <div className="container">
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route
                        path="/signup/create-profile"
                        element={<ProfileForm />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
