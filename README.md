# myFlix React App - Client-Side

## Overview

This is the client-side React application for myFlix, a movie app designed for movie enthusiasts to explore information about various films. This application interacts with an existing server-side REST API to fetch and display movie data.

As of the current development stage, the application features a main view showcasing a list of movies, the ability to view detailed information about a single movie, and navigation between these views.

## Key Features (Currently Implemented)

* **Main View:** Displays a list of movies, each with a title.
* **Movie Details View:** Shows more information about a selected movie, including its title, director, genre, description, image, and rating.
* **Navigation:** Users can click on a movie card in the main view to navigate to the detailed view for that movie.
* **Back Navigation:** A "Back" button in the movie details view allows users to return to the main movie list.

## Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **Parcel:** A build tool used to bundle the React application.
* **HTML:** The structure of the web page.
* **CSS/SCSS:** Styling for the application (using SCSS preprocessor).

## Getting Started

This section outlines how to run the client-side application in a development environment.

### Prerequisites

* **Node.js and npm (or yarn) installed:** You'll need Node.js and its package manager (npm is typically included with Node.js) to install dependencies and run the development server.

### Installation

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone https://github.com/levired6/myFlix-client.git

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or `yarn install` if you are using Yarn)

### Running the Development Server

This command will start a development server using Parcel, which will allow you to view and interact with the application in your browser during development.

```bash
npm run start or parcel src/index.html