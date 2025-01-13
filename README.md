# Full-Stack Currency Exchange App

This project is a full-stack web application that provides currency exchange functionality. It features a backend built with Go and Fiber, a lightweight web framework, and a frontend built with React, TypeScript, and Vite. The app allows users to interact with real-time currency exchange rates and perform conversions seamlessly.

## Backend (Go)

The backend server is built with [Go](https://golang.org/) and the [Fiber](https://gofiber.io/) framework. It provides endpoints for currency exchange functionality, handling requests to fetch live exchange rates and performing conversion operations.

### Setup

1. Install Go if you haven't already: [Go Installation Guide](https://golang.org/doc/install)
2. Run the Go server:

```bash
cd server
go run main.go
```

### Configuration

The backend uses environment variables for configuration. You can set up your `.env` file with the necessary values, such as API keys for exchange rates.

```env
# .env
OPENEXCHANGE_APP_ID="YOUR OPENEXCHANGE APP ID"
```

## Frontend (React/TypeScript)

The frontend is a React application using TypeScript, built with [Vite](https://vitejs.dev/). It communicates with the Go backend to display exchange rates and allow currency conversion.

### Setup

1. Install Node.js (if not installed already): [Node.js Installation](https://nodejs.org/)
2. Install frontend dependencies:

```bash
cd client
npm install
```

3. Run the React app:

```bash
npm run dev
or 
yarn dev
```

This will start the React development server, typically on `http://localhost:5173/`.

## Installation

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/1deyce/currex.git
cd currex
```

2. Navigate to the `backend` directory and install Go dependencies:

```bash
cd server
go mod tidy
```

3. Create a `.env` file in the `backend` directory with your API URL and any required keys.

4. Run the Go server:

```bash
go run main.go
```

### Frontend Setup

1. Navigate to the `frontend` directory and install dependencies:

```bash
cd client
npm install
```

2. Set up the `.env` file in the `frontend` directory, defining the backend server URL (assuming it's running locally):

```env
VITE_BACKEND_URL=http://localhost:8000 [eg]
```

3. Run the frontend app:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/` by default.

## Usage

- Open the frontend application at `http://localhost:5173/`.
- Enter the amount in one currency, select the "from" and "to" currencies, and the app will show the converted amount based on real-time exchange rates.

The frontend communicates with the Go backend API to fetch the latest exchange rates and perform conversions.

## Features

- **Currency Conversion**: Convert between any two currencies.
- **Real-time Exchange Rates**: Fetch live rates from the backend (integrating with an exchange rates API).
- **Responsive Design**: Use the app on any device (mobile, tablet, desktop).
- **Interactive UI**: Built with React and TypeScript for strong typing and better developer experience.

## Dependencies

### Backend (Go)

- [Fiber](https://gofiber.io/): Web framework for Go
- [GoDotEnv](https://github.com/joho/godotenv): Load environment variables from a `.env` file

### Frontend (React/TypeScript)

- [React](https://reactjs.org/): JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/): Next-generation, fast build tool
- [TypeScript](https://www.typescriptlang.org/): Typed superset of JavaScript

## Contributing

1. Fork the repository
2. Create a new branch for your feature or fix
3. Make your changes and commit them
4. Push your changes to your fork
5. Create a pull request with a description of the changes

Please ensure your code follows the project’s coding style, including proper naming conventions and formatting. You can run `npm run lint` in the frontend and `go fmt` in the backend to check for style violations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

### Explanation of the Sections:
- **Project Structure**: Lists the folder structure for both frontend and backend.
- **Backend Setup**: Describes how to run the Go server with environment configuration.
- **Frontend Setup**: Outlines how to set up and run the React frontend with Vite.
- **Installation**: Step-by-step guide to clone and set up the project for both backend and frontend.
- **Usage**: Explains how users can interact with the application.
- **Features**: Highlights the functionality provided by the app.
- **Dependencies**: Lists the required libraries for both the frontend and backend.
- **Contributing**: Guidelines for contributing to the project.
- **License**: Mentions the MIT license (common for open-source projects).

This README provides a clear overview of your full-stack currency exchange application, guiding users through setup, usage, and contribution.
```
