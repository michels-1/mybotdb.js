const axios = require('axios');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat} = require('../lib/functions')


// Movie search command
cmd({
    pattern: "movie",
    desc: "Search for a movie and get details and download options.",
    category: "movie",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("Please provide a movie or TV show name to search.");
        
        // Step 1: Search for the movie
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) return reply("No results found.");

        let message = "*Search Results:*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nType: ${item.type}\nLink: ${item.link}\n\n`;
        });

        // Step 2: Send the search results to the user
        const sentMsg = await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/de82e3.jpg` },
            caption: message,  // Send the description as the caption
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });

        // Wait for the user to select a movie by number
        const movieSelectionListener = async (update) => {
            const message = update.messages[0];

            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();
            const selectedMovieIndex = parseInt(userReply) - 1;

            // Ensure the user has selected a valid movie index
            if (selectedMovieIndex < 0 || selectedMovieIndex >= result.results.length) {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: mek.key }
                });
                return reply("❗ Invalid selection. Please choose a valid number from the search results.");
            }

            const selectedMovie = result.results[selectedMovieIndex];
            const link = selectedMovie.link;

            // Step 3: Fetch movie details from the selected movie's link
            const movieDetails = await SinhalaSub.movie(link);
            if (!movieDetails || !movieDetails.status || !movieDetails.result) {
                return reply("❗ Movie details not found.");
            }

            const movie = movieDetails.result;
            let movieMessage = `*${movie.title}*\n\n`;
            movieMessage += `📅 𝖱𝖾𝗅𝖾𝖺𝗌𝖾 𝖣𝖺𝗍𝖾: ${movie.release_date}\n`;
            movieMessage += `🗺 𝖢𝗈𝗎𝗇𝗍𝗋𝗒: ${movie.country}\n`;
            movieMessage += `⏰ 𝖣𝗎𝗋𝖺𝗍𝗂𝗈𝗇: ${movie.duration}\n`;

            // Handling genres properly
            const genres = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres;
            movieMessage += `🎭 𝖦𝖾𝗇𝖾𝗋𝖾𝗌: ${genres}\n`;

            movieMessage += `⭐ 𝖨𝗆𝖽𝖻 𝖱𝖺𝗍𝗂𝗇𝗀: ${movie.IMDb_Rating}\n`;
            movieMessage += `🎬 𝖣𝗂𝗋𝖾𝖼𝗍𝗈𝗋: ${movie.director.name}\n\n`;
          movieMessage += `*乂 REPLY THE DOWNLOAD OPTION*\n\n`;
          movieMessage += `*𝖲𝖣 - 480𝗉*\n`;
          movieMessage += `*𝖧𝖣 - 720p*\n`;
          movieMessage += `*𝖥𝖧𝖣 - 1080p*\n\n`;
          movieMessage += `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ*`;

            const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

            // Step 4: Send movie details with download options
            const movieDetailsMessage = await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: movieMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                }
            }, { quoted: mek });

            // Listen for the user's reply to select the download quality
            const qualityListener = async (update) => {
                const message = update.messages[0];

                if (!message.message || !message.message.extendedTextMessage) return;

                const userReply = message.message.extendedTextMessage.text.trim();

                // Ensure the user is responding to the right message
                if (message.message.extendedTextMessage.contextInfo.stanzaId === movieDetailsMessage.key.id) {
                    let quality;
                    switch (userReply) {
                        case 'SD':
                            quality = "SD 480p";
                            break;
                        case 'HD':
                            quality = "HD 720p";
                            break;
                        case 'FHD':
                            quality = "FHD 1080p";
                            break;
                        default:
                            await conn.sendMessage(from, {
                                react: { text: '❌', key: mek.key }
                            });
                            return reply("❗ Invalid option. Please select from SD, HD, or FHD.");
                    }

                    try {
                        // Fetch the direct download link for the selected quality
                        const directLink = await PixaldrainDL(link, quality, "direct");
                        if (directLink) {
                            // Provide download option
                            await conn.sendMessage(from, {
                                document: {
                                    url: directLink
                                },
                                mimetype: 'video/mp4',
                                fileName: `🎬ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ🎬(${movie.title}).mp4`,
                                caption: `${movie.title} - ${quality}\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ*`
                            }, { quoted: mek });

                            // React with success
                            await conn.sendMessage(from, {
                                react: { text: '✅', key: mek.key }
                            });
                        } else {
                            await conn.sendMessage(from, {
                                react: { text: '❌', key: mek.key }
                            });
                            return reply(`❗ Could not find the ${quality} download link. Please check the URL or try another quality.`);
                        }
                    } catch (err) {
                        console.error('Error in PixaldrainDL function:', err);
                        await conn.sendMessage(from, {
                            react: { text: '❌', key: mek.key }
                        });
                        return reply("❗ An error occurred while processing your download request.");
                    }
                }
            };

            // Register the quality listener for this movie
            conn.ev.on("messages.upsert", qualityListener);

            // Clean up the listener after 60 seconds to prevent memory leaks
            setTimeout(() => {
                conn.ev.off("messages.upsert", qualityListener);
            }, 60000);
        };

        // Register the movie selection listener
        conn.ev.on("messages.upsert", movieSelectionListener);

        // Clean up the listener after 60 seconds to prevent memory leaks
        setTimeout(() => {
            conn.ev.off("messages.upsert", movieSelectionListener);
        }, 60000);

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`❗ Error: ${e.message}`);
    }
});



cmd({
    pattern: "imdb",
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
            caption: `${movieInfo}\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ*`
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

if ( !m.quoted ) return reply('*.ᴜᴘᴍᴇ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
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

if ( !m.quoted ) return reply('*.ᴜᴘᴍᴠ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
      

 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `\n${datas}\n\n> *🎬 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ 🎬*`  ,mimetype: "video/mp4" , fileName: `🎬 ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 🎬\n${datas}.mp4` } )
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

if ( !m.quoted ) return reply('*.ᴍᴋᴠ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
      

 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `\n${datas}\n\n> *🎬 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ 🎬*`  ,mimetype: "video/mkv" , fileName: `🎬 ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 🎬\n${datas}.mkv` } )
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

if ( !m.quoted ) return reply('*.ᴜᴘᴛᴠ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `*${datas}*`  ,mimetype: "video/mp4" , fileName: `📺 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ 📺\n${datas}.mp4` } )
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

if ( !m.quoted ) return reply('*.ᴜᴘᴛᴠᴍ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `*${datas}*`  ,mimetype: "video/mkv" , fileName: `ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ\n${datas}.mkv` } )
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

if ( !m.quoted ) return reply('*.ᴜᴘᴍᴠᴍ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `\n${datas}\n\n> *ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*`  ,mimetype: "video/mkv" , fileName: `🎬 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ 🎬\n${datas}.mkv` } )
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

if ( !m.quoted ) return reply('*.ᴜᴘᴢɪᴘ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `\n${datas}\n\n> *ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*`  ,mimetype: "application/zip" , fileName: `🎬 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ 🎬\n${datas}.zip` } )
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

if ( !m.quoted ) return reply('*.ᴜᴘᴢɪᴘɴ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `*${datas}*`  ,mimetype: "application/zip" , fileName: `📃 ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 📃\n${datas}.zip` } )
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

if ( !m.quoted ) return reply('*.ᴜᴘᴢɪᴘꜰɪʟᴇ ᴊɪᴅ & ᴍᴏᴠɪᴇ ɪɴꜰᴏ*')
if ( !q ) return 
const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1] 
 await conn.sendMessage(data, { document : { url : m.quoted.msg  } ,caption: `*${datas}*`  ,mimetype: "application/zip" , fileName: `${datas}.zip` } )
		} catch (e) {
reply('❗ Error' + e )
l(e)
}
})

