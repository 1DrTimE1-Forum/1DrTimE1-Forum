// Klistra in din Discord webhook-URL här mellan citattecknen.
const WEBHOOK_URL = ÖVERKLAGNINGS_WEBHOOK;

const form = document.getElementById("appealForm");
const status = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!WEBHOOK_URL || WEBHOOK_URL === "DIN_WEBHOOK_URL_HÄR") {
        status.textContent = "Webhook är inte konfigurerad ännu. Lägg in URL:en i forum.js.";
        status.className = "error";
        return;
    }

    const perspektiv = document.getElementById("perspektiv").value.trim();
    const felaktig = document.getElementById("felaktig").value.trim();
    const bevis = document.getElementById("bevis").value.trim() || "Inget angivet";
    const reglerna = form.querySelector('input[name="reglerna"]:checked');
    const falskinfo = form.querySelector('input[name="falskinfo"]:checked');

    if (!reglerna || !falskinfo) {
        status.textContent = "Vänligen besvara alla obligatoriska frågor.";
        status.className = "error";
        return;
    }

    const payload = {
        embeds: [
            {
                title: "Ny överklagan",
                color: 0x4a3d8f,
                fields: [
                    { name: "Vad hände (perspektiv)", value: perspektiv.slice(0, 1024) },
                    { name: "Varför var åtgärden felaktig", value: felaktig.slice(0, 1024) },
                    { name: "Bevis", value: bevis.slice(0, 1024) },
                    { name: "Läst och förstår reglerna?", value: reglerna.value, inline: true },
                    { name: "Förstår konsekvens av falsk info?", value: falskinfo.value, inline: true }
                ],
                timestamp: new Date().toISOString()
            }
        ]
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Skickar...";
    status.textContent = "";
    status.className = "";

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 204) {
            status.textContent = "Din överklagan har skickats!";
            status.className = "success";
            form.reset();
        } else {
            throw new Error("Discord svarade med status " + response.status);
        }
    } catch (err) {
        status.textContent = "Något gick fel. Försök igen senare.";
        status.className = "error";
        console.error(err);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    }
});