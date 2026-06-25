const WEBHOOK_URL = STAFF_WEBHOOK;

const form = document.getElementById("staffForm");
const status = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!WEBHOOK_URL || WEBHOOK_URL === "DIN_STAFF_WEBHOOK_URL_HÄR") {
        status.textContent = "Webhook är inte konfigurerad ännu. Lägg in URL:en i config.js.";
        status.className = "error";
        return;
    }

    const namn        = document.getElementById("namn").value.trim();
    const discord     = document.getElementById("discord").value.trim();
    const varfor      = document.getElementById("varfor").value.trim();
    const problem     = document.getElementById("problem").value.trim();
    const losning     = document.getElementById("losning").value.trim();
    const balans      = document.getElementById("balans").value.trim();

    const payload = {
        embeds: [
            {
                title: "Ny Staff Ansökan",
                color: 0x4a3d8f,
                fields: [
                    { name: "Riktigt namn", value: namn.slice(0, 1024) },
                    { name: "Discord-namn", value: discord.slice(0, 1024) },
                    { name: "Varför ska just du bli staff?", value: varfor.slice(0, 1024) },
                    { name: "Vad tycker du inte fungerar på 1DrTimE1?", value: problem.slice(0, 1024) },
                    { name: "Hur ska du & Staff Teamet lösa problemet?", value: losning.slice(0, 1024) },
                    { name: "Hur balanserar du staff-arbetet med privatlivet?", value: balans.slice(0, 1024) }
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
            status.textContent = "Din ansökan har skickats!";
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
        submitBtn.textContent = "Skicka Ansökan";
    }
});