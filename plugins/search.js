const { cmd } = require('../command');
const axios = require('axios');
const { Buffer } = require('buffer');
const crypto = require('crypto');
const emailDataStore = {};
const cheerio = require("cheerio");
const fetch = require('node-fetch');

const GOOGLE_API_KEY = 'AIzaSyDebFT-uY_f82_An6bnE9WvVcgVbzwDKgU'; // Replace with your Google API key
const GOOGLE_CX = '45b94c5cef39940d1'; // Replace with your Google Custom Search Engine ID

cmd({
    pattern: "img",
    desc: "Search and send images from Google.",
    react: "🖼️",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please provide a search query for the image.");

        // Fetch image URLs from Google Custom Search API
        const searchQuery = encodeURIComponent(q);
        const url = `https://www.googleapis.com/customsearch/v1?q=${searchQuery}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}&searchType=image&num=5`;
        
        const response = await axios.get(url);
        const data = response.data;

        if (!data.items || data.items.length === 0) {
            return reply("No images found for your query.");
        }

        // Send images
        for (let i = 0; i < data.items.length; i++) {
            const imageUrl = data.items[i].link;

            // Download the image
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(imageResponse.data, 'binary');

            // Send the image with a footer
            await conn.sendMessage(from, {
                image: buffer,
                caption: `
🌟 *Image ${i + 1} from your search!* 🌟
        *Enjoy these images! 📸*
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ*
`
}, { quoted: mek });
}

    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

//Tempmail

cmd({
    pattern: "tempmail",
    desc: "Create temporary email address and use it as needed.",
    react: "📧",
    use: ".tempmail",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        if (!emailDataStore[sender]) {
            const newEmailData = await tempmail.create();
            if (!newEmailData || !newEmailData[0]) {
                return await reply("Request Denied!");
            }

            const [login, domain] = newEmailData[0].split("@");
            emailDataStore[sender] = { email: newEmailData[0], login, domain };
        }

        const emailInfo = emailDataStore[sender];
        await conn.sendMessage(from, {
            text: `NEW MAIL\n\nEMAIL: ${emailInfo.email}\nLOGIN: ${emailInfo.login}\nADDRESS: ${emailInfo.domain}\n`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        return reply("Request Denied!");
    }
});


cmd({
    pattern: "checkmail",
    desc: "Check mails in your temporary email address.",
    react: "📧",
    use: ".checkmail",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const emailInfo = emailDataStore[sender];
        if (!emailInfo || !emailInfo.email) {
            return await conn.sendMessage(from, { text: "_You Didn't Create Any Mail_" }, { quoted: mek });
        }

        const receivedMails = await tempmail.mails(emailInfo.login, emailInfo.domain);
        if (!receivedMails || receivedMails.length === 0) {
            return await conn.sendMessage(from, { text: "_EMPTY ➪ No Mails Here_" }, { quoted: mek });
        }

        for (const mail of receivedMails) {
            const emailContent = await tempmail.emailContent(emailInfo.login, emailInfo.domain, mail.id);
            if (emailContent) {
                const mailInfo = `From ➪ ${mail.from}\nDate ➪ ${mail.date}\nEMAIL ID ➪ [${mail.id}]\nSubject ➪ ${mail.subject}\nContent ➪ ${emailContent}`;
                await conn.sendMessage(from, { text: mailInfo }, { quoted: mek });
            }
        }
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        return reply("Request Denied!");
    }
});

cmd({
    pattern: "delmail",
    desc: "Delete temporary email address.",
    react: "❌",
    use: ".delmail",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        if (emailDataStore[sender]) {
            delete emailDataStore[sender];
            return await conn.sendMessage(from, { text: "Deleted the email address." }, { quoted: mek });
        } else {
            return await conn.sendMessage(from, { text: "No email address to delete." }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        return reply("Request Denied!");
    }
});

const tempmail = {
    create: async () => {
        const url = "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1";
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    mails: async (login, domain) => {
        const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    emailContent: async (login, domain, id) => {
        const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`;
        try {
            const response = await axios.get(url);
            const emailData = response.data;
            const htmlContent = emailData.htmlBody;

            const $ = cheerio.load(htmlContent);
            const textContent = $.text();
            return textContent;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
};

cmd({
    pattern: "gpass",
    desc: "Generate a strong password.",
    category: "search",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const length = args[0] ? parseInt(args[0]) : 12; // Default length is 12 if not provided
        if (isNaN(length) || length < 8) {
            return reply('ρℓєαѕє ρяσνι∂є α ναℓι∂ ℓєηgтн ƒσя тнє ραѕѕωσя∂ (мιηιмυм 8 ¢нαяα¢тєяѕ).');
        }

        const generatePassword = (len) => {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
            let password = '';
            for (let i = 0; i < len; i++) {
                const randomIndex = crypto.randomInt(0, charset.length);
                password += charset[randomIndex];
            }
            return password;
        };

        const password = generatePassword(length);
        const message = `🔐 *Your Strong Password* 🔐\n\nPlease find your generated password below:\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ*`;

        // Send initial notification message
        await conn.sendMessage(from, { text: message }, { quoted: mek });

        // Send the password in a separate message
        await conn.sendMessage(from, { text: password }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ єяяσя gєηєяαтιηg ραѕѕωσя∂: ${e.message}`);
    }
});
