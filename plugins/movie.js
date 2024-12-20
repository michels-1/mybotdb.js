const axios = require('axios');
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat} = require('../lib/functions')


cmd({
    pattern: "movie",
    desc: "Fetch detailed information about a movie.",
    category: "other",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const movieName = args.join(' ');
        if (!movieName) {
            return reply("📽️ Please provide the name of the movie.");
        }

        const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=76cb7f39`;
        const response = await axios.get(apiUrl);

        const data = response.data;
        if (data.Response === "False") {
            return reply("🚫 Movie not found.");
        }

        const movieInfo = `
🎬 *Movie Information* 🎬

🎥 *Title:* ${data.Title}

📅 *Year:* ${data.Year}

🌟 *Rated:* ${data.Rated}

📆 *Released:* ${data.Released}

⏳ *Runtime:* ${data.Runtime}

🎭 *Genre:* ${data.Genre}

🎬 *Director:* ${data.Director}

✍️ *Writer:* ${data.Writer}

🎭 *Actors:* ${data.Actors}

📝 *Plot:* ${data.Plot}

🌍 *Language:* ${data.Language}

🇺🇸 *Country:* ${data.Country}

🏆 *Awards:* ${data.Awards}

⭐ *IMDB Rating:* ${data.imdbRating}

🗳️ *IMDB Votes:* ${data.imdbVotes}
`;

        // Define the image URL
        const imageUrl = data.Poster && data.Poster !== 'N/A' ? data.Poster : config.ALIVE_IMG;

        // Send the movie information along with the poster image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `${movieInfo}\n> *POWERED by ASITHA-MD*`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});

cmd({
    pattern: "uploadme",
    react: "✔️",
    alias: ["upme"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*.upmv jid & Halo (2024) TV Series E3*')
const data = q.split(" | ")[0] 
const datas = q.split(" | ")[1] 
const datase = q.split(" ¥ ")[1]
 await conn.sendMessage(from, { document : { url :  data } ,caption: data  ,mimetype: datas , fileName: `DOWNLOADED.${datase}` })
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})

cmd({
    pattern: "uploadmovie",
    react: "✔️",
    alias: ["upmv"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, chat, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*ℹ .upmv jid & Halo (2024) TV Series E3*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
      

 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `\n${datas}\n\n> *🎬 VAJIRA-MD 🎬*`  ,mimetype: "video/mp4" , fileName: `🎬 MOVIE DOWNLOADER 🎬\n${datas}.mp4` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})


cmd({
    pattern: "moviekv",
    react: "✔️",
    alias: ["mkv"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, chat, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*ℹ .mkv jid & Halo (2024) TV Series E3*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
      

 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `\n${datas}\n\n> *🎬 VAJIRA-MD 🎬*`  ,mimetype: "video/mkv" , fileName: `🎬 MOVIE DOWNLOADER 🎬\n${datas}.mkv` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})					    

cmd({
    pattern: "uploadtv",
    react: "✔️",
    alias: ["uptv"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*ℹ .upmv jid & Halo (2024) TV Series E3*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `*${datas}*`  ,mimetype: "video/mp4" , fileName: `📺 TECHNICAL CYBERS 📺\n${datas}.mp4` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})

cmd({
    pattern: "uploadtvm",
    react: "✔️",
    alias: ["uptvm"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*ℹ .upmv jid & Halo (2024) TV Series E3*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `*${datas}*`  ,mimetype: "video/mkv" , fileName: `📺 TECHNICAL CYBERS 📺\n${datas}.mkv` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})

cmd({
    pattern: "uploadmoviem",
    react: "✔️",
    alias: ["upmvm"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*ℹ .upmv jid & Halo (2024) TV Series E3*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `\n${datas}\n\n> *TECHNICAL CYBERS*`  ,mimetype: "video/mkv" , fileName: `🎬 VAJIRA-MD 🎬\n${datas}.mkv` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})

cmd({
    pattern: "uploadzip",
    react: "✔️",
    alias: ["upzip"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*ℹ .upmv jid & Halo (2024) TV Series E3*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `\n${datas}\n\n> *VAJIRATECH*`  ,mimetype: "application/zip" , fileName: `🎬 TECHNICAL CYBERS 🎬\n${datas}.zip` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})

cmd({
    pattern: "uploadzipn",
    react: "✔️",
    alias: ["upzipn"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*ℹ .upmv jid & Halo (2024) TV Series E3*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `*${datas}*`  ,mimetype: "application/zip" , fileName: `📃 TECHNICAL CYBERS 📃\n${datas}.zip` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})

cmd({
    pattern: "uploadzipfile",
    react: "✔️",
    alias: ["upzipfile"],
    desc: "Movie Searcher",
    category: "movie",
    use: '.activate_18+',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag, db_pool, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if ( !m.quoted ) return reply('*ℹ .upmv jid & Halo (2024) TV Series E3*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `*${datas}*`  ,mimetype: "application/zip" , fileName: `${datas}.zip` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})

