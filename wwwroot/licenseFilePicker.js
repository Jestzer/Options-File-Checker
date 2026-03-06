function initializeLicenseFilePicker() {
    const licenseFilePicker = document.getElementById('licenseFilePicker');
    const LicenseFileBrowseButton = document.getElementById('LicenseFileBrowseButton');
    const textBox = document.getElementById('licenseFileTextbox');

    if (LicenseFileBrowseButton && licenseFilePicker) {
        LicenseFileBrowseButton.addEventListener('click', (event) => {
            event.preventDefault();
            licenseFilePicker.click();
        });

        licenseFilePicker.addEventListener('change', async (event) => {
            const files = event.target.files;

            // AFAIK, this means the user likely cancelled their selection, so move on with our lives.
            if (!files.length) return;

            const file = files[0];

            if (file.size === 0) {
                errorMessageFunction("The license file you've chosen appears to be empty.");
                return;
            }

            if (!await validateTextFile(file)) {
                errorMessageFunction("The selected file appears to be a binary file (such as a PDF, image, or Word document), not a plain text license file.");
                return;
            }

            textBox.value = file.name;

            const reader = new FileReader();
            reader.onload = (e) => {
                window.licenseFileRawText = e.target.result;
            };
            reader.readAsText(files[0]);
        });
    } else {
        errorMessageFunction("Could not find required elements in the DOM for the license file.")
        // return; Not needed at the moment.
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLicenseFilePicker);
} else {
    initializeLicenseFilePicker();
}
