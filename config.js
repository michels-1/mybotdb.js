const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}


module.exports = {
SESSION_ID: process.env.SESSION_ID || "",
GITHUB_USERNAME: process.env.GITHUB_USERNAME || "",
GITHUB_AUTH_TOKEN: process.env.GITHUB_AUTH_TOKEN || "",
REPO_NAME: process.env.REPO_NAME || "",
};
