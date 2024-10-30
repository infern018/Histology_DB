
# 🔬 MiMe
An online database for storing, curating and sharing metadata from diverse collections of histological data.

## Prerequisites
Make sure you have the following installed on your system:

 - Node.js (version 14 or above)
 - npm (Node package manager) or **yarn**

## 🌳 Project Structure

The project is divided into two main folders: server and client_v2. The server folder contains the backend code and the client_v2 folder contains the frontend code.

```
root
├── server
│   ├── package.json
└── client_v2
    └── package.json
```

## 🔧 Setup Instructions

<!-- create a bullet list with bold after this -->

### 1. Clone the repository

```
git clone  https://github.com/infern018/Histology_DB.git
cd Histology_DB
```

### 2. Setup the server

```
cd server
npm install
```

Create a .env file in the server folder and add necessary environment variables. Here’s an example .env file structure:

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
```
*Make sure to add the correct redirect URL in your GitHub OAuth app settings. Like:*

Authorization Callback URL :`http://localhost:5000/api/auth/github/callback?redirect=true`

Start the server :

```
npm run start
```

### 3. Setup the client

```
cd client_v2
npm install
```

Create a .env file in the client folder and add necessary environment variables. Here’s an example .env file structure:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the client :

```
npm run start
```

Default API and Client URLs:

- API: http://localhost:5000/api
- Client: http://localhost:3000


## 🪁 Styling frameworks
The app uses following frameworks to ease styling of the app:
- [Material UI](https://mui.com/)

