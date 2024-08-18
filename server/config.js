// config.js
const dotenv = require('dotenv');

dotenv.config({ path: 'server/config/.env' });

dotenv.config(
    {
        path: "PROD" === process.env.NODE_ENV ? 'config/.env.prod' : 'config/.env.dev'
    }
)

module.exports = {
    port: process.env.PORT || 5000,
    dbURL: process.env.MONGO_URL,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    react_url: process.env.REACT_URL,
    // Other environment variables
};
