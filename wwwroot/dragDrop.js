function initializeDragDrop() {
    const overlay = document.getElementById("drop-overlay");
    let dragCounter = 0;

    document.addEventListener("dragenter", (e) => {
        e.preventDefault();
        dragCounter++;
        if (dragCounter === 1) {
            overlay.classList.remove("hidden");
        }
    });

    document.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            overlay.classList.add("hidden");
        }
    });

    document.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    document.addEventListener("drop", (e) => {
        e.preventDefault();
        dragCounter = 0;
        overlay.classList.add("hidden");

        const files = e.dataTransfer.files;
        if (!files.length) return;

        for (const file of files) {
            handleDroppedFile(file);
        }
    });
}

function detectFileTypeFromExtension(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "dat" || ext === "lic") return "license";
    if (ext === "opt") return "options";
    return "unknown";
}

function detectFileTypeFromContent(text) {
    const lines = text.split(/\r?\n/);
    let licenseScore = 0;
    let optionsScore = 0;

    for (const line of lines) {
        const trimmed = line.trim();
        if (/^(SERVER|VENDOR|DAEMON)\s/i.test(trimmed)) licenseScore += 3;
        if (/^(INCREMENT|FEATURE)\s/i.test(trimmed)) licenseScore += 3;
        if (/^(INCLUDE|EXCLUDE|INCLUDEALL|EXCLUDEALL|INCLUDE_BORROW|EXCLUDE_BORROW)\s/i.test(trimmed)) optionsScore += 3;
        if (/^(GROUP|HOST_GROUP)\s/i.test(trimmed)) optionsScore += 3;
        if (/^(RESERVE|MAX)\s/i.test(trimmed)) optionsScore += 3;
        if (/^GROUPCASEINSENSITIVE/i.test(trimmed)) optionsScore += 5;
    }

    if (licenseScore > 0 && optionsScore === 0) return "license";
    if (optionsScore > 0 && licenseScore === 0) return "options";
    if (licenseScore > optionsScore * 2) return "license";
    if (optionsScore > licenseScore * 2) return "options";
    return "unknown";
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

function loadAsLicenseFile(file, text) {
    if (file.size === 0) {
        errorMessageFunction("The license file you've chosen appears to be empty.");
        return;
    }
    window.licenseFileRawText = text;
    document.getElementById("licenseFileTextbox").value = file.name;
}

function loadAsOptionsFile(file, text) {
    if (file.size === 0) {
        errorMessageFunction("The options file you've chosen appears to be empty.");
        return;
    }
    window.optionsFileRawText = text;
    document.getElementById("optionsFileTextbox").value = file.name;
}

function showFileTypePrompt(fileName) {
    return new Promise((resolve) => {
        const overlay = document.getElementById("file-type-modal-overlay");
        const msgEl = document.getElementById("file-type-modal-message");
        const btnLicense = document.getElementById("file-type-btn-license");
        const btnOptions = document.getElementById("file-type-btn-options");
        const btnCancel = document.getElementById("file-type-btn-cancel");

        msgEl.textContent = `Could not determine the type of "${fileName}". What kind of file is this?`;
        overlay.classList.remove("hidden");

        function cleanup() {
            overlay.classList.add("hidden");
            btnLicense.removeEventListener("click", onLicense);
            btnOptions.removeEventListener("click", onOptions);
            btnCancel.removeEventListener("click", onCancel);
        }

        function onLicense() { cleanup(); resolve("license"); }
        function onOptions() { cleanup(); resolve("options"); }
        function onCancel() { cleanup(); resolve(null); }

        btnLicense.addEventListener("click", onLicense);
        btnOptions.addEventListener("click", onOptions);
        btnCancel.addEventListener("click", onCancel);
    });
}

async function handleDroppedFile(file) {
    let fileType = detectFileTypeFromExtension(file.name);
    const text = await readFileAsText(file);

    if (fileType === "unknown") {
        fileType = detectFileTypeFromContent(text);

        if (fileType === "unknown") {
            fileType = await showFileTypePrompt(file.name);
            if (!fileType) return;
        }
    }

    if (fileType === "license") {
        loadAsLicenseFile(file, text);
    } else {
        loadAsOptionsFile(file, text);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDragDrop);
} else {
    initializeDragDrop();
}
