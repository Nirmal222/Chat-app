# Chat-app


# Backend

## Table of Contents
1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
8. [Installation Steps](#installation-steps)

## Introduction
A real-time communication app that enables users to send connection requests to one another. Once a connection request is accepted, the users can engage in a chat session, exchanging messages in real-time.


## Technology Stack
- Node JS, Express JS, Socket IO, JWT, MongoDB

## Project Structure
```
backend/
├── src/ 
│   ├── config/
│   ├── controllers/
│   ├── interfaces/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── types/
│   ├── utils/
│   └── index.ts
├── package.json
```
## Installation Steps
 1. The application uses environment variables for configuration. These are stored in a `.env` file in the root directory of the project. Here's an example of the `.env` file:
`PORT=4000`
`CLIENT_URL=http://localhost:3000`
`MONGO_URI=mongodb://localhost:27017/chat_app`

 2. install dependencies by "npm install" command.
 4. Run "npm run dev" for dev environment / "npm run start" for prod ennvironmennt

 # Chat-app Frontend Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Installation Steps](#installation-steps)

## Introduction
The frontend of our real-time chat application provides a user-friendly interface for sending connection requests, accepting requests, and engaging in real-time chat sessions with connected users.

## Technology Stack
- React.js
- TypeScript
- Socket.IO Client
- [Add any additional frontend libraries/frameworks used]

## Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── App.tsx
├── package.json
└── tsconfig.json
```

## Installation Steps
1. Environment Configuration:
   Create a `.env` file in the root of the frontend directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:4000
   ```

2. Install Dependencies:
   Run the following command in the frontend project root directory:
   ```
   npm install
   ```

3. Start the Application:
   - For development environment:
     ```
     npm start
     ```
   - For production build:
     ```
     npm run build
     ```

[Add any additional setup steps or configuration required for the frontend]