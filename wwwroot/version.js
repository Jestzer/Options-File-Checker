const APP_VERSION = "1.0.3";

document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("version-display");
    if (el) el.textContent = `v${APP_VERSION}`;
});
