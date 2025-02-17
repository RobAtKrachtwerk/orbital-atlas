import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Header from "./oaHeader";
import Profile from "./oaProfile";
import Launches from "./oaLaunches";
import Discover from "./oaDiscover";
import News from "./oaNews";
import Atlas from "./oaAtlas";
import Events from "./oaAstronomyEvents";
import Register from "./oaRegister";
import Profile from "./oaProfile";
import './App.css';
import './custom-bootstrap.scss';
import 'bootstrap/dist/css/bootstrap.min.css';



const App = () => {
    const [profilePhoto, setProfilePhoto] = useState("");

    const handleProfilePhotoUpdate = (newPhoto) => {
        setProfilePhoto(newPhoto);
    };

    return (
        <Auth0Provider
        domain="dev-5o80hihkxjod2ilj.eu.auth0.com"
        clientId="Hj4S5JKLzgwUcqpRnBmBPd5uCPBCp163"
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
            <Router>
                <Header profilePhoto={profilePhoto} />
                <Routes>
                <Route path="/" element={<Discover />} /> 
                <Route path="/discover" element={<Discover />} />
                    <Route path="/profile" element={<Profile onProfilePhotoUpdate={handleProfilePhotoUpdate} />} />
                    <Route path="/launches" element={<Launches />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/atlas" element={<Atlas />} />
                    <Route path="/events" element={<Events />} />
                </Routes>
            </Router>
        </Auth0Provider>
    );
};

export default App;
