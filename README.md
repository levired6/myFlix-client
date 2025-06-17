# myFlix React App - Client-Side

## Overview

This is the client-side React application for myFlix, a modern, responsive movie application designed for film enthusiasts. It allows users to explore a vast collection of movies, view detailed information, filter movies, manage their personal profiles, and curate a list of their favorite films. This application seamlessly interacts with a robust server-side REST API to fetch, display, and manage user and movie data.

## Live Demo

Experience the myFlix application live!

* **Frontend (Client-Side):** <https://oscars2025.netlify.app>

* **Backend (API):** <https://oscars2025-f0070acec0c4.herokuapp.com> (This is the base URL. Endpoints are available at paths like `/movies`, `/login`, etc.)

## Backend API

This client-side application communicates with the movie_api which handles data storage, authentication, and business logic.

## Key Features

The myFlix client application provides a rich user experience with the following features:

* **User Authentication:**

    * **Login:** Existing users can securely log in to access the application's features. Improved UI with centered fields, helper text, and **password visibility toggle**.

    * **Signup:** New users can easily create an account with improved UI, centered fields, helper text, and **password visibility toggle**.

    * **Logout:** Users can securely log out of their session.

* **Main Movie View:**

    * Displays a comprehensive list of all available movies (each movie item with an image, title, and description).

    * **Movie Filtering (Search Feature):** Users can dynamically filter the list of movies by **title, genre, or director** using a dedicated search bar with clear labeling and helper text.

    * Ability to select a movie for more details.

    * Ability to navigate to Profile view.

* **Detailed Movie View:**

    * Provides in-depth information about a selected movie, including its title, director, genre, description, image, and rating.

    * Allows users to add a movie to their list of favorites.

    * **Enhanced Image Sizing:** Movie images are displayed to auto-fit and show full content without cropping.

* **User Profile Management:**

    * **View Profile:** Authenticated users can access a dedicated profile page to view their personal details.

    * **Edit Profile:** Users can update their username, password, email, and birthday, with improved form layout and helper text.

    * **Deregister Account:** Users have the option to delete their account.

* **Favorite Movies:**

    * Users can **add or remove movies from their personalized list of favorite movies** directly from the movie details view and main movie list.

    * **Improved Favorite Button Styling:** Buttons now feature a white text/outline with a clear red hover state, making interactions more intuitive.

    * The profile page displays all of a user's favorite movies.

* **Responsive Navigation:** A dynamic navigation bar adjusts based on user authentication status, offering relevant links (Home, Profile, Login, Signup, Logout). **"myFlix" brand aligned with improved left-side spacing.**

* **Robust Routing & State Management:** Utilizes React Router for seamless navigation and efficient state management to ensure a smooth user experience across different views.

* **Error Handling:** Implements client-side error handling for API requests and user interactions, providing feedback to the user when issues occur (e.g., failed login/signup attempts).

## Technologies Used

* **React:** A JavaScript library for building dynamic and interactive user interfaces.

* **React-Bootstrap:** A powerful front-end framework for building responsive and accessible user interfaces with pre-built components.

* **React Router DOM:** For declarative routing within the single-page application.

* **Parcel:** A zero-configuration web application bundler for fast development and optimized production builds.

* **HTML:** The foundational markup language for structuring web content.

* **CSS/SCSS:** For styling the application, leveraging the power of SCSS for maintainable and scalable stylesheets, including custom button styles.

* **JavaScript (ES6+):** The core programming language for application logic.

* **Font Awesome:** Used for scalable vector icons (e.g., password visibility toggle).

## Getting Started

This section outlines how to set up and run the client-side application in a development environment.

### Prerequisites

* **Node.js and npm (or yarn) installed:** Ensure you have Node.js (preferably LTS version 18.x or 20.x for compatibility) and npm (or Yarn) installed on your system to manage project dependencies and run scripts.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/levired6/myFlix-client.git](https://github.com/levired6/myFlix-client.git)
    cd myFlix-client
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    (or `yarn install` if you prefer Yarn)

### Running the Development Server

This command will start a development server using Parcel, which will automatically recompile your code and refresh the browser on changes, allowing you to view and interact with the application during development.

```bash
npx parcel src/index.html --port 8080