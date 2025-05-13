import React from 'react'; // Import React
import { createRoot } from 'react-dom/client';
import Container from 'react-bootstrap/Container'; // Import Container

// Import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";
import { MainView } from './components/main-view/main-view'; // Import MainView
// Main component (will eventually use all the others)
const MyFlixApplication = () => {
  return (
    <Container className="my-flix"> {/* Use Bootstrap Container */}
    <MainView /> {/* Render the MainView component */}
  </Container>
);
}; 

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(<MyFlixApplication />);