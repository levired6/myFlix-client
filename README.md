# myFlix React App - Client-Side

## Overview

This is the client-side React application for myFlix, a modern, responsive movie application designed for film enthusiasts. It allows users to explore a vast collection of movies, view detailed information, manage their personal profiles, and curate a list of their favorite films. This application seamlessly interacts with a robust server-side REST API to fetch, display, and manage user and movie data.

## Backend API

This client-side application communicates with the [myFlix REST API](https://github.com/your-backend-repo-link-here), which handles data storage, authentication, and business logic.

## Key Features

The myFlix client application provides a rich user experience with the following features:

* **User Authentication:**
    * **Login:** Existing users can securely log in to access the application's features.
    * **Signup:** New users can easily create an account.
    * **Logout:** Users can securely log out of their session.
* **Main Movie View:** Displays a comprehensive list of all available movies, allowing users to browse titles.

* **Detailed Movie View:** Provides in-depth information about a selected movie, including its title, director, genre, description, image, and rating. Users can also see if a movie is in their favorites list.

* **User Profile Management:**
    * **View Profile:** Authenticated users can access a dedicated profile page to view their personal details.
    * **Edit Profile:** Users can update their username, password, email, and birthday.
    * **Deregister Account:** Users have the option to delete their account.

* **Favorite Movies:**
    * Users can add or remove movies from their personalized list of favorite movies directly from the movie details view.
    * The profile page displays all of a user's favorite movies.

* **Responsive Navigation:** A dynamic navigation bar adjusts based on user authentication status, offering relevant links (Home, Profile, Login, Signup, Logout).
* **Robust Routing & State Management:** Utilizes React Router for seamless navigation and efficient state management to ensure a smooth user experience across different views.
* **Error Handling:** Implements client-side error handling for API requests and user interactions, providing feedback to the user when issues occur.

## Technologies Used

* **React:** A JavaScript library for building dynamic and interactive user interfaces.
* **React-Bootstrap:** A powerful front-end framework for building responsive and accessible user interfaces with pre-built components.
* **React Router DOM:** For declarative routing within the single-page application.
* **Parcel:** A zero-configuration web application bundler for fast development.
* **HTML:** The foundational markup language for structuring web content.
* **CSS/SCSS:** For styling the application, leveraging the power of SCSS for maintainable and scalable stylesheets.
* **JavaScript (ES6+):** The core programming language for application logic.

## Getting Started

This section outlines how to set up and run the client-side application in a development environment.

### Prerequisites

* **Node.js and npm (or yarn) installed:** Ensure you have Node.js (which includes npm) or Yarn installed on your system to manage project dependencies and run scripts.

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