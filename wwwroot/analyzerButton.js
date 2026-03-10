const analyzerBtn = document.getElementById('analyzerButton');
const treeRoot = document.querySelector('.output-tree');
let outputTextbox = document.getElementById('outputTextbox');

function appendWarning(text) {
    const div = document.createElement('div');
    div.textContent = text;
    outputTextbox.appendChild(div);
}

function appendProductWarning(warning) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(
        `Warning: "${warning.enteredProduct}" is not a recognized MathWorks product.`
    ));
    if (warning.suggestedProduct) {
        div.appendChild(document.createTextNode(' Did you mean "'));
        const segments = getDiffSegments(warning.enteredProduct, warning.suggestedProduct);
        for (const seg of segments) {
            if (seg.highlighted) {
                const span = document.createElement('span');
                span.className = 'diff-highlight';
                span.textContent = seg.text;
                div.appendChild(span);
            } else {
                div.appendChild(document.createTextNode(seg.text));
            }
        }
        div.appendChild(document.createTextNode('"?'));
    }
    div.appendChild(document.createTextNode(` Line: "${warning.line}"`));
    outputTextbox.appendChild(div);
}

/**
 * Compute diff segments between two strings using Levenshtein backtracking.
 * Returns an array of { text, highlighted } objects for the target string,
 * where highlighted segments represent insertions or substitutions.
 */
function getDiffSegments(source, target) {
    const m = source.length;
    const n = target.length;

    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (source[i - 1] === target[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const ops = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && source[i - 1] === target[j - 1]) {
            ops.push({ type: "match", char: target[j - 1] });
            i--; j--;
        } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
            ops.push({ type: "substitute", char: target[j - 1] });
            i--; j--;
        } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
            ops.push({ type: "insert", char: target[j - 1] });
            j--;
        } else {
            i--;
        }
    }
    ops.reverse();

    const segments = [];
    let currentText = "";
    let currentHighlighted = false;

    for (const op of ops) {
        if (op.type === "match") {
            if (currentHighlighted && currentText) {
                segments.push({ text: currentText, highlighted: true });
                currentText = "";
            }
            currentHighlighted = false;
            currentText += op.char;
        } else if (op.type === "substitute" || op.type === "insert") {
            if (!currentHighlighted && currentText) {
                segments.push({ text: currentText, highlighted: false });
                currentText = "";
            }
            currentHighlighted = true;
            currentText += op.char;
        }
    }
    if (currentText) {
        segments.push({ text: currentText, highlighted: currentHighlighted });
    }

    return segments;
}

if (analyzerBtn) {
    analyzerBtn.addEventListener('click', async () => {
        const licensePath = document.getElementById('licenseFileTextbox')?.value.trim();
        const optionsPath = document.getElementById('optionsFileTextbox')?.value.trim();

        if (!licensePath || !optionsPath) {
            alert('Please select both license and options files.');
            return;
        }

        window.errorOccurred = false;
        outputTextbox.innerHTML = "";
        document.querySelector('.output-tree').innerHTML = '';

        // Re-read files from disk in case they were modified since selection.
        const licenseFile = document.getElementById('licenseFilePicker')?.files[0];
        const optionsFile = document.getElementById('optionsFilePicker')?.files[0];

        if (!licenseFile || !optionsFile) {
            alert('Please select both license and options files.');
            return;
        }

        try {
            window.licenseFileRawText = await licenseFile.text();
            window.optionsFileRawText = await optionsFile.text();
        } catch (err) {
            alert('Could not re-read the selected files. Please re-select them and try again.');
            return;
        }

        gatherData()

        if (!window.errorOccurred) {
            analyzeData()
            if (!window.errorOccurred) {

                if (serverLineHasPort === false) {
                    appendWarning("Warning: you did not specify a port number on your SERVER line.");
                }

                if (daemonLineHasPort === false) {
                    appendWarning("Warning: you did not specify a port number on your DAEMON line. This means random port will be chosen each time you restart FlexLM.");
                }

                if (caseSensitivity === true) {
                    appendWarning("Warning: case sensitivity is enabled for users defined in GROUPs and HOST_GROUPs.");
                }

                if (unspecifiedLicenseOrProductKey === true) {
                    appendWarning("Please note: you did not specify a license number or product key for either one of your INCLUDE or RESERVE lines. This means we will subtract the seat from the first " +
                        "license the product appears on.");
                }

                if (optionsFileUsesMatlabParallelServer === true) {
                    appendWarning("Warning: you are including MATLAB Parallel Server in your options file. Keep in mind that the username must correspond to the username as it is on the cluster. " +
                        "This does not prevent users from accessing the cluster.");
                }

                if (wildCardsAreUsed === true) {
                    appendWarning("Warning: you are using at least 1 wildcard in your options file. These may be unreliable or cause other issues.");
                }

                if (ipAddressesAreUsed === true) {
                    appendWarning("Warning: you are using an IP address in your options file. IP addresses are often dynamic and therefore cannot be reliably used to identify users.");
                }

                if (useServerFound === true) {
                    appendWarning("Warning: USE_SERVER was found in your license file. This line is not needed and can be removed.");
                }

                if (window.unrecognizedProductWarnings && window.unrecognizedProductWarnings.length > 0) {
                    for (const warning of window.unrecognizedProductWarnings) {
                        appendProductWarning(warning);
                    }
                }

                if (window.nnuProductsWithNoSeatsAssigned && window.nnuProductsWithNoSeatsAssigned.length > 0) {
                    for (let nnuProduct of window.nnuProductsWithNoSeatsAssigned) {
                        appendWarning(`Warning: the NNU product ${nnuProduct} has no seats assigned. NNU products require INCLUDE lines with USER or GROUP to assign seats.`);
                    }
                }

                if (window.maxExceedsSeatCountWarnings && window.maxExceedsSeatCountWarnings.length > 0) {
                    for (let maxWarning of window.maxExceedsSeatCountWarnings) {
                        let maxSeatWord = maxWarning.maxSeats === 1 ? "seat" : "seats";
                        let totalSeatWord = maxWarning.totalSeats === 1 ? "seat" : "seats";
                        appendWarning(`Warning: a MAX line specifies ${maxWarning.maxSeats} ${maxSeatWord} for ${maxWarning.productName}, ` +
                            `but only ${maxWarning.totalSeats} ${totalSeatWord} are available in the license file.`);
                    }
                }

                if (window.includeExcludeConflicts && window.includeExcludeConflicts.length > 0) {
                    for (let conflict of window.includeExcludeConflicts) {
                        appendWarning(`Warning: you have both an INCLUDE and EXCLUDE for ${conflict.productName} targeting ${conflict.clientType} ` +
                            `${conflict.clientSpecified}. The EXCLUDE will take priority and the user will be denied access.`);
                    }
                }

                if (window.duplicateDirectiveWarnings && window.duplicateDirectiveWarnings.length > 0) {
                    for (let duplicate of window.duplicateDirectiveWarnings) {
                        appendWarning(`Warning: you have a duplicate ${duplicate.directiveType} line for ${duplicate.productName} targeting ${duplicate.clientType} ` +
                            `${duplicate.clientSpecified}. Each duplicate line will separately subtract from the seat count.`);
                    }
                }

                if (window.borrowNotSupportedWarnings && window.borrowNotSupportedWarnings.length > 0) {
                    for (let borrowWarning of window.borrowNotSupportedWarnings) {
                        appendWarning(`Warning: you have an INCLUDE_BORROW for ${borrowWarning.productName}, but borrowing is not enabled ` +
                            `for this product in the license file (no BORROW= found on its INCREMENT line). This INCLUDE_BORROW will have no effect.`);
                    }
                }

                let cnOverdraftWarningHasBeenDisplayed = false;
                let nnuOverdraftWarningHasBeenDisplayed = false;

                Object.entries(licenseFileDictionary).forEach(([idx, obj]) => {
                    const details = document.createElement('details');
                    const summary = document.createElement('summary');
                    const displayOffering = obj.licenseOffering === "lo=CN" ? "CN" : obj.licenseOffering;
                    summary.textContent = `${obj.productName} Seats remaining: ${obj.seatCount}. Original seat count: ${obj.originalLicenseFileSeatCount}. License offering: ${displayOffering}. ` +
                    `License ${obj.licenseNumber}. Product Key: ${obj.productKey}.`;

                    // Wait!! I might have some things to tell you...

                    if (obj.licenseOffering === "NNU" && obj.seatCount < 0 && nnuOverdraftWarningHasBeenDisplayed === false) {
                        nnuOverdraftWarningHasBeenDisplayed = true;
                        let message = `There is an issue with the options file: you have specified more users than available on the NNU product ${obj.productName} on license ${obj.licenseNumber}. ` +
                            `The original seat count was ${obj.originalLicenseFileSeatCount}, it is now counting as ${obj.seatCount}. See the full output by closing this message for more details.`;
                        appendWarning(message);
                        window.errorOccurred = true;
                        alert(message);
                    }
                    if ((obj.licenseOffering === "lo=CN" || obj.licenseOffering === "CN") && obj.seatCount < 0 && cnOverdraftWarningHasBeenDisplayed === false) {
                        appendWarning("Warning: you have specified more users on a CN license than the number of seats available. " +
                            "This is introduces the possibility of License Manager Error -4 appearing, since there is not a seat available for every user to use at once.");
                        cnOverdraftWarningHasBeenDisplayed = true;
                    }

                    // Okay, back to the tree view construction.
                    details.appendChild(summary);

                    // Children for linesThatSubtractSeats.
                    if (obj.linesThatSubtractSeats?.length) {
                        const ul = document.createElement('ul');

                        obj.linesThatSubtractSeats.forEach(line => {
                            const li = document.createElement('li');
                            li.textContent = line;
                            ul.appendChild(li);

                            // Sub child if you are using a GROUP.
                            const groupMatch = line.match(/GROUP\s+(\S+)/i);
                            if (groupMatch) {
                                const wantedName = groupMatch[1].toLowerCase();
                                const entry = Object.values(groupDictionary).find(
                                    o => o.groupName.toLowerCase() === wantedName
                                );

                                if (entry) {
                                    const details = document.createElement('details');   // <- wrapper
                                    const summary = document.createElement('summary'); // <- clickable title
                                    summary.textContent = 'Show GROUP users';
                                    details.appendChild(summary);

                                    const subUl = document.createElement('ul');
                                    const usersString = entry.groupUsers || "";
                                    const items = usersString.split(/\s+/).filter(u => u.length > 0);
                                    items.forEach(item => {
                                        const subLi = document.createElement('li');
                                        subLi.textContent = item;
                                        subUl.appendChild(subLi);
                                    });
                                    details.appendChild(subUl);   // content that expands/collapses
                                    li.appendChild(details);      // attach under the main <li>
                                }
                            }
                        });

                        details.appendChild(ul);
                    }
                    treeRoot.appendChild(details);


                });

            }
        }
    });
}
