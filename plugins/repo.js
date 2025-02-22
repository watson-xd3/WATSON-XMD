import axios from "axios";
import config from '../config.cjs';

const repo = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (["repo", "sc", "script", "info"].includes(cmd)) {
    const githubRepoURL = "https://github.com/watson-xd3/WATSON-XMD";

    try {
      // Extract username and repo name from the URL
      const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

      // Fetch repository details using GitHub API
      const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

      if (!response.data) {
        throw new Error("GitHub API request failed.");
      }

      const repoData = response.data;

      // Format the repository information
      const formattedInfo = `*BOT NAME:*\n> ${repoData.name}\n\n*OWNER NAME:*\n> ${repoData.owner.login}\n\n*STARS:*\n> ${repoData.stargazers_count}\n\n*FORKS:*\n> ${repoData.forks_count}\n\n*GITHUB LINK:*\n> ${repoData.html_url}\n\n*DESCRIPTION:*\n> ${repoData.description || "No description"}\n\n*Don't Forget To Star and Fork Repository*\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴡᴀᴛꜱᴏɴ-ꜰᴏᴜʀᴘᴇɴᴄᴇ 🇿🇼*`;

      // Send an image with the formatted info as a caption
      await gss.sendMessage(
        m.from,
        {
          image: { url: "https://i.imgur.com/QxeVvOc.jpeg" },
          caption: formattedInfo,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363391539600226@newsletter",
              newsletterName: "WATSON-XMD",
              serverMessageId: 143,
            },
          },
        },
        { quoted: m }
      );

      // Send the audio file with context info
      await gss.sendMessage(
        m.from,
        {
          audio: { url: "https://github.com/watson-xd3/WATSON-DATA/raw/refs/heads/main/autovoice/repo.m4a" },
          mimetype: "audio/mp4",
          ptt: true,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363391539600226@newsletter",
              newsletterName: "WATSON-XMD",
              serverMessageId: 143,
            },
          },
        },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in repo command:", error);
      m.reply("Sorry, something went wrong while fetching the repository information. Please try again later.");
    }
  }
};

export default repo;