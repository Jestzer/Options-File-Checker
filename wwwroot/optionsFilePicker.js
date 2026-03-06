function initializeOptionsFilePicker() {
    const optionsFilePicker = document.getElementById('optionsFilePicker');
    const OptionsFileBrowseButton = document.getElementById('OptionsFileBrowseButton');
    const textBox = document.getElementById('optionsFileTextbox');

    if (OptionsFileBrowseButton && optionsFilePicker) {
        OptionsFileBrowseButton.addEventListener('click', (event) => {
            event.preventDefault();
            optionsFilePicker.click();
        });

        optionsFilePicker.addEventListener('change', async (event) => {
            const files = event.target.files;

            // AFAIK, this means the user likely cancelled their selection, so move on with our lives.
            if (!files.length) return;

            const file = files[0];

            if (file.size === 0) {
                errorMessageFunction("The options file you've chosen appears to be empty.");
                return;
            }

            if (!await validateTextFile(file)) {
                errorMessageFunction("The selected file appears to be a binary file (such as a PDF, image, or Word document), not a plain text options file.");
                return;
            }

            textBox.value = file.name;

            const reader = new FileReader();
            reader.onload = (e) => {
                window.optionsFileRawText = e.target.result;
            };
            reader.readAsText(files[0]);
        });
    } else {
        errorMessageFunction("Could not find required elements in the DOM for the options file.")
        // return; Not needed at the moment.
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOptionsFilePicker);
} else {
    initializeOptionsFilePicker();
}
