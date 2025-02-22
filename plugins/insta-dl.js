import axios from "axios";
import config from "../config.cjs";

const instagram = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const query = m.body.slice(prefix.length + cmd.length).trim();

  if (!["ig", "insta", "instagram"].includes(cmd)) return;

  if (!query || !query.startsWith("http")) {
    return Matrix.sendMessage(m.from, { text: "❌ *Usage:* `.ig <Instagram URL>`" }, { quoted: m });
  }

  try {
    await Matrix.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    const { data } = await axios.get(`https://apis.davidcyriltech.my.id/instagram?url=${query}`);

    if (!data.success || !data.downloadUrl) {
      return Matrix.sendMessage(m.from, { text: "⚠️ *Failed to fetch Instagram video. Please try again.*" }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "📥 *Powered By WatsonFourpence ✅*",
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363391539600226@newsletter",
          newsletterName: "ᴡᴀᴛꜱᴏɴ-ꜰᴏᴜʀᴘᴇɴᴄᴇ",
          serverMessageId: 143,
        },
      },
    }, { quoted: m });

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Instagram Downloader Error:", error);
    Matrix.sendMessage(m.from, { text: "❌ *An error occurred while processing your request. Please try again later.*" }, { quoted: m });
  }
};

export default instagram;
