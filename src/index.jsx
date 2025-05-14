import React from 'react'; // Import React
import { createRoot } from 'react-dom/client';
import Container from 'react-bootstrap/Container'; // Import Container
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route

// Import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";
import { MainView } from './components/main-view/main-view'; // Import MainView
import { LoginView } from './components/login-view/login-view'; // Import LoginView
import { SignupView } from './components/signup-view/signup-view'; // Import SignupView
import { MovieView } from './components/movie-view/movie-view'; // Import MovieView
import { ProfileView } from './components/profile-view/profile-view'; // Import profileView
import { NavigationBar } from './components/navigation-bar/navigation-bar'; // Import NavigationBar

// Main component (will eventually use all the others)
const MyFlixApplication = () => {
  return (
    <BrowserRouter>
      <NavigationBar /> {/* Navigation bar at the top */}
      <Container className="my-flix"> {/* Use Bootstrap Container */}
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignupView />} />
          <Route path="/" element={<MainView />} /> {/*Main movie list at the root path */}
          <Route path="/movies/:movieId" element={<MovieView />} /> {/* Movie details */}
          <Route path="/profile" element={<ProfileView />} /> {/* User profile */}
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(<MyFlixApplication />);