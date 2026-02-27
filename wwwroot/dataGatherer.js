function gatherData() {
    // Set/reset everything.
    window.serverLineHasPort = true;
    window.daemonLineHasPort = true;
    window.daemonPortIsCnuFriendly = false;
    window.caseSensitivity = true;
    window.optionsFileUsesMatlabParallelServer = false;
    window.wildCardsAreUsed = false;
    window.ipAddressesAreUsed = false;
    window.licenseFileDictionary = {};
    window.includeDictionary = {};
    window.includeBorrowDictionary = {};
    window.includeAllDictionary = {};
    window.excludeDictionary = {};
    window.excludeBorrowDictionary = {};
    window.excludeAllDictionary = {};
    window.reserveDictionary = {};
    window.maxDictionary = {};
    window.groupDictionary = {};
    window.hostGroupDictionary = {};
    window.productExpirationDate = "No product expiration date set."
    window.useServerFound = false;
    window.currentLine = "window.currentLine has not been set. :("


    // Variables that don't need to be set app-wide.

    // Regex.
    const portEqualsRegex = /port=/gi;
    const optionsEqualsRegex = /options=/gi;
    const commentedBeginLineRegex = /# BEGIN--------------/gi;
    const keyEqualsRegex = /key=/gi;
    const assetInfoRegex = /asset_info=/gi;
    const assetInfoWithNumberRegex = /asset_info=(\S+)/i;
    const licenseNumberRegex = /^[^Rab_\d]+$/g;
    const licenseNumberSnRegex = /SN=(\S+)/i;
    const ipAddressRegex = /\d{2,3}\./g;
    const quoteRegex = /"/g;
    const whiteSpaceRegex = /\s+/g;
    const tabRegex = /\t/g;
    const windowsNewLineRegex = /\\\r\n/g;
    const unixNewLineRegex = /\\\n/g;
    const newLineTabRegex = /\\\n\t/g;

    // Other.
    let containsPLP = false;
    let serverLineCount = 0;
    let daemonLineCount = 0;
    let productLinesHaveBeenReached = false;
    const masterProductsList = ["Aerospace_Blockset", "Aerospace_Toolbox", "Antenna_Toolbox", "Audio_System_Toolbox", "Automated_Driving_Toolbox", "AUTOSAR_Blockset", "Bioinformatics_Toolbox", "Bluetooth_Toolbox", "C2000_Blockset", "CDMA_IS95_Blocks", "Communication_Blocks", "Communication_Toolbox", "Compiler", "Control_Toolbox", "Curve_Fitting_Toolbox", "Data_Acq_Toolbox", "Database_Toolbox", "DDS_Blockset", "Deep_Learning_HDL_Toolbox", "Dial_and_Gauge_Blocks", "Distrib_Computing_Toolbox", "DSP_HDL_Toolbox", "Econometrics_Toolbox", "EDA_Simulator_Link", "Embedded_IDE_Link", "Embedded_Target_c2000", "Embedded_Target_MPC555", "Excel_Link", "Extend_Symbolic_Toolbox", "Filter_Design_HDL_Coder", "Filter_Design_Toolbox", "Fin_Derivatives_Toolbox", "Fin_Instruments_Toolbox", "Fin_Time_Series_Toolbox", "Financial_Toolbox", "Fixed_Income_Toolbox", "Fixed_Point_Toolbox", "Fixed-Point_Blocks", "Fuzzy_Toolbox", "GADS_Toolbox", "Garch_Toolbox", "GPU_Coder", "IDE_Link_MU", "Identification_Toolbox", "Image_Acquisition_Toolbox", "Image_Toolbox", "Instr_Control_Toolbox", "Lidar_Toolbox", "Link_for_Incisive", "Link_for_VisualDSP", "LMI_Control_Toolbox", "LTE_HDL_Toolbox", "LTE_Toolbox", "MAP_Toolbox", "MATLAB", "MATLAB_5G_Toolbox", "MATLAB_Builder_for_dot_Net", "MATLAB_Builder_for_Java", "MATLAB_Coder", "MATLAB_COM_Builder", "MATLAB_Distrib_Comp_Engine", "MATLAB_Excel_Builder", "MATLAB_Link_for_CCS", "MATLAB_Production_Server", "MATLAB_Report_Gen", "MATLAB_Runtime_Server", "MATLAB_Test", "MATLAB_Web_App_Server", "MATLAB_Web_Server", "MBC_Toolbox", "Medical_Imaging_Toolbox", "Mixed_Signal_Blockset", "Motor_Control_Blockset", "MPC_Toolbox", "Mu_Synthesis_Toolbox", "Navigation_Toolbox", "NCD_Toolbox", "Neural_Network_Toolbox", "OPC_Toolbox", "Optimization_Toolbox", "PDE_Toolbox", "Phased_Array_System_Toolbox", "Polyspace_BF", "Polyspace_BF_Access", "Polyspace_BF_Server", "PolySpace_Bug_Finder", "PolySpace_Bug_Finder_Engine", "PolySpace_Client_ADA", "PolySpace_Client_C_CPP", "Polyspace_CP_Access", "Polyspace_CP_Server", "PolySpace_Server_ADA", "PolySpace_Server_C_CPP", "Polyspace_Test", "PolySpace_Model_Link_SL", "PolySpace_Model_Link_TL", "PolySpace_UML_Link_RH", "Power_System_Blocks", "Powertrain_Blockset", "Pred_Maintenance_Toolbox", "Radar_Toolbox", "Real-Time_Win_Target", "Real-Time_Workshop", "Reinforcement_Learn_Toolbox", "Req_Management", "RF_Blockset", "RF_PCB_Toolbox", "RF_Toolbox", "Risk_Management_Toolbox", "RoadRunner", "RoadRunner_Asset_Library", "RoadRunner_HD_Scene_Builder", "RoadRunner_Scenario", "Robotics_System_Toolbox", "Robust_Toolbox", "ROS_Toolbox", "RTW_Embedded_Coder", "Satellite_Comm_Toolbox", "Sensor_Fusion_and_Tracking", "SerDes_Toolbox", "Signal_Blocks", "Signal_Integrity_Toolbox", "Signal_Toolbox", "SimBiology", "SimDriveline", "SimElectronics", "SimEvents", "SimHydraulics", "SimMechanics", "Simscape", "Simscape_Battery", "SIMULINK", "Simulink_Accelerator", "Simulink_Code_Inspector", "Simulink_Compiler", "Simulink_Control_Design", "Simulink_Coverage", "Simulink_Design_Optim", "Simulink_Design_Verifier", "Simulink_HDL_Coder", "Simulink_Param_Estimation", "SIMULINK_Perf_Tools", "Simulink_PLC_Coder", "SIMULINK_Report_Gen", "Simulink_Requirements", "Simulink_Test", "SL_Verification_Validation", "SoC_Blockset", "Spline_Toolbox", "Stateflow", "Stateflow_Coder", "Statistics_Toolbox", "Symbolic_Toolbox", "System_Composer", "SystemTest", "Target_Support_Package", "Text_Analytics_Toolbox", "TMW_Archive", "Trading_Toolbox", "UAV_Toolbox", "Vehicle_Dynamics_Blockset", "Vehicle_Network_Toolbox", "Video_and_Image_Blockset", "Virtual_Reality_Toolbox", "Vision_HDL_Toolbox", "Wavelet_Toolbox", "Wireless_Testbench", "WLAN_System_Toolbox", "XPC_Embedded_Option", "XPC_Target"];

    try {
        // Remove line breaks from license file.
        window.licenseFileText = window.licenseFileRawText
            .replace(windowsNewLineRegex, '')
            .replace(unixNewLineRegex, '')
            .replace(newLineTabRegex, '')
            .replace(tabRegex, '');

        // Break into lines, for later usage.
        const licenseFileContentsLines = window.licenseFileText.split(/\r\n|\r|\n/);

        // Same process for options file.
        window.optionsFileText = window.optionsFileRawText
            .replace(windowsNewLineRegex, '')
            .replace(unixNewLineRegex, '')
            .replace(tabRegex, '');

        const optionsFileContentsLines = optionsFileText.split(/\r\n|\r|\n/);

        // Let's start checking for obvious issues.

        // No valid options found in options file.
        if (!window.optionsFileText.includes("INCLUDE") && !window.optionsFileText.includes("EXCLUDE") && !window.optionsFileText.includes("RESERVE")
            && !window.optionsFileText.includes("MAX") && !window.optionsFileText.includes("LINGER") && !window.optionsFileText.includes("LOG") &&
            !window.optionsFileText.includes("TIMEOUT")) {
            errorMessageFunction("There is an issue with the options file: it is likely not an options file or contains no usable content.");
            return;
        }

        // License file does not contain any products.
        if (!window.licenseFileText.includes("INCREMENT")) {
            errorMessageFunction("There is an issue with the license file: it is either not a license file or is corrupted.");
            return;
        }

        // See the error message for details.
        if (window.licenseFileText.includes("lo=IN") || window.licenseFileText.includes("lo=DC") || window.licenseFileText.includes("lo=CIN")) {
            errorMessageFunction("There is an issue with the license file: it contains an Individual or Designated Computer license, " +
                "which cannot use an options file.");
            return;
        }

        // See the error message for details.
        if (window.licenseFileText.includes("CONTRACT_ID=")) {
            errorMessageFunction("There is an issue with the license file: it contains at least 1 non-MathWorks product.")
            return;
        }

        // Pre-scan INCREMENT lines for Individual/Designated Computer indicators
        // that the text-level checks above do not catch.
        {
            const hasTMWArchive = window.licenseFileText.includes("TMW_Archive");
            for (let i = 0; i < licenseFileContentsLines.length; i++) {
                const line = licenseFileContentsLines[i];
                const trimmed = line.trim();
                if (!trimmed.startsWith("INCREMENT")) continue;

                const parts = line.split(" ").filter(part => part && part.trim());
                if (parts.length < 7) continue;

                if (parts[1] === "TMW_Archive") continue;

                const seatCount = Number(parts[5]);
                const productKey = (parts[6] || "").trim();

                // Lines with lo= are already handled by the text-level check above.
                if (line.includes("lo=")) continue;

                if (line.includes("lr=") || hasTMWArchive || !line.includes("asset_info=")) {
                    if (!(seatCount > 0)) {
                        // PLP Individual is allowed (handled specially in the main parser).
                        if (hasTMWArchive && !line.includes("asset_info=")) continue;
                        errorMessageFunction("There is an issue with the license file: it contains an Individual or Designated Computer license, " +
                            "which cannot use an options file.");
                        return;
                    }
                } else {
                    if (line.includes("PLATFORMS=x")) {
                        errorMessageFunction("There is an issue with the license file: it contains a Designated Computer license generated from " +
                            "a PLP on Windows, which cannot use an options file.");
                        return;
                    }
                    if (productKey.length === 20 && !hasTMWArchive) {
                        errorMessageFunction("There is an issue with the license file: it contains an Individual or Designated Computer license, " +
                            "which cannot use an options file.");
                        return;
                    }
                }
            }
        }

        // Now that you've passed, we'll go through each line of the license file to gather information needed for analysis.
        for (let licenseLineIndex = 0; licenseLineIndex < licenseFileContentsLines.length; licenseLineIndex++) {
            window.currentLine = licenseFileContentsLines[licenseLineIndex];
            let productName = "No productName :(";
            let seatCount = 0;
            let plpLicenseNumber = "No plpLicenseNumber :(";

            if (window.currentLine.trimStart().startsWith("SERVER")) {
                if (productLinesHaveBeenReached) {
                    errorMessageFunction("There is an issue with the license file: your SERVER line(s) are listed after a product.");
                    return;
                }
                serverLineCount++
                let lineParts = currentLine.split(" ");

                // Remove blank lineParts from the SERVER line since FlexLM doesn't seem to care about them.
                lineParts = lineParts.filter(part => part && part.trim());
                let theWordServer = lineParts[0];
                let serverHostID = lineParts[2];

                if (theWordServer !== "SERVER") {
                    errorMessageFunction("There is an issue with the license file: it does not start with the word SERVER.");
                    return;
                }

                if (serverHostID === "27000" || serverHostID === "27001" || serverHostID === "27010") {
                    errorMessageFunction("There is an issue with the license file: you have likely omitted your Host ID and attempted to specify a SERVER port number. " +
                        "Because you have omitted the Host ID, the port you've attempted to specify will not be used.");
                    return;
                }

                switch (lineParts.length) {
                    case 0:
                    case 1:
                    case 2:
                        errorMessageFunction("There is an issue with the license file: you are missing information from your SERVER line. See documentation online on how to format it.");
                        return;
                    case 3:
                        window.serverLineHasPort = false;
                        break;
                    case 4:
                        let serverPort = Number(lineParts[3]);
                        if (!Number.isInteger(serverPort)) {
                            errorMessageFunction("There is an issue with the license file: you have stray information on your SERVER line.");
                            return;
                        }

                        if (!serverHostID.includes('INTERNET=') && serverHostID.length !== 12) {
                            errorMessageFunction("There is an issue with the license file: you have not specified your Host ID correctly.");
                            return;
                        }
                        // Congrats, you /likely/ have not made any mistakes on your SERVER line.
                        break;
                    case 5:
                        if (lineParts[4] === "") {
                            continue; // Your stray space shall be ignored... for now.
                        } else {
                            errorMessageFunction("There is an issue with the license file: you have stray information on your SERVER line.");
                            return;
                        }
                    default:
                        errorMessageFunction("There is an issue with the license file: you have stray information on your SERVER line.");
                        return;
                }
            } else if (window.currentLine.trimEnd().startsWith("DAEMON") || window.currentLine.trimEnd().startsWith("VENDOR")) {
                if (productLinesHaveBeenReached) {
                    errorMessageFunction("There is an issue with the license file: your DAEMON line is listed after a product.");
                    return;
                }

                // There should only be 1 DAEMON line.
                daemonLineCount++
                if (daemonLineCount > 1) {
                    errorMessageFunction("There is an issue with the license file: you have more than 1 DAEMON line.");
                    return;
                }

                const countPortEquals = (window.currentLine.match(portEqualsRegex) || []).length;
                const countOptionsEquals = (window.currentLine.match(optionsEqualsRegex) || []).length;
                const countCommentedBeginLines = (window.currentLine.match(commentedBeginLineRegex) || []).length;

                // For all the homies out there using CNU.
                if (window.currentLine.includes("PORT=")) {
                    window.daemonPortIsCnuFriendly = true;
                }

                if (countCommentedBeginLines > 0) {
                    errorMessageFunction("There is an issue with the license file: it has content that is intended to be commented out in your DAEMON line.");
                    return;
                }

                if (countPortEquals > 1) {
                    errorMessageFunction("There is an issue with the license file: you have specified more than 1 port number for MLM.");
                    return;
                }

                if (countOptionsEquals > 1) {
                    errorMessageFunction("There is an issue with the license file: you have specified the path to more than 1 options file.");
                    return;
                }

                if (countOptionsEquals === 0) {
                    errorMessageFunction("There is an issue with the license file: you did not specify the path to the options file. " +
                        "If you included the path, but did not use options= to specify it, MathWorks licenses ask that you do so, even if they technically work without options=.");
                    return;
                }

                // daemonProperty1 and 2 could either be a port number or path to an options file.
                let lineParts = currentLine.split(" ");

                // Just having the word "DAEMON" isn't enough.
                if (lineParts.length === 1) {
                    errorMessageFunction("There is an issue with the license file: you have a DAEMON line, but did not specify the daemon to be used (MLM) nor the path to it.");
                    return;
                }

                // Checking out how you could've possibly messed up the vendor daemon.
                let daemonVendor = lineParts[1];

                // Try using this as a replacement for IsNullorWhiteSpace.
                if (!daemonVendor || !daemonVendor.trim()) {
                    errorMessageFunction("There is an issue with the license file: there are too many spaces between \"DAEMON\" and \"MLM\".");
                    return;
                }

                // The vendor daemon needs to read exactly as MLM. Not as a lowercase "mlm", or anything else.
                if (daemonVendor !== "MLM") {
                    errorMessageFunction("There is an issue with the license file: you have incorrectly specified the vendor daemon MLM. " +
                        "It must read exactly as \"MLM\", with all uppercase letters.");
                    return;
                }

                switch (lineParts.length) {
                    case 2:
                        errorMessageFunction("There is an issue with the license file: you did not specify the path to the vendor daemon MLM.");
                        return;
                    case 3:
                        errorMessageFunction("There is an issue with the license file: you did not specify the path to the options file.");
                        return;
                    default:
                        break;
                }

                if (countOptionsEquals === 1) {
                    window.daemonLineHasPort = true;
                }
            } else if (window.currentLine.trimEnd().startsWith("INCREMENT")) {
                productLinesHaveBeenReached = true;
                let lineParts = currentLine.split(" ");

                // Please get rid of the blank garbage. THANK YOU.
                lineParts = lineParts.filter(part => part && part.trim());


                // The stuff we really care about!
                productName = lineParts[1];
                let productVersion = Number(lineParts[3]);
                window.productExpirationDate = lineParts[4];
                let rawSeatCount = String(Number(lineParts[5])); // This needs to be a string since it could be "uncounted".
                seatCount = Number(lineParts[5]);
                let productKey = lineParts[6].trim();
                let licenseOffering;
                let licenseNumber = "No licenseNumber :(";

                if (productKey.length > 20) {
                    errorMessageFunction("There is an issue with the license file: one of your product keys is greater than 20 characters long. This means it's likely been " +
                        `tampered with. This is what the product key is being read as: ${productKey}.`);
                    return;
                } else if (productKey.length < 10) {
                    errorMessageFunction("There is an issue with the license file: one of your product keys is shorter than 10 characters long. This means it's likely been " +
                        `tampered with. This is what the product key is being read as: ${productKey}.`);
                    return;
                }

                // License number.
                if (currentLine.includes("asset_info=")) {
                    let match = currentLine.match(assetInfoWithNumberRegex);
                    if (match) {
                        licenseNumber = match[1];
                    }
                } else if (currentLine.includes("SN=")) {
                    let match = currentLine.match(licenseNumberSnRegex)
                    if (match) {
                        licenseNumber = match[1];
                    }
                    if (productName === "TMW_Archive") {
                        containsPLP = true;
                        plpLicenseNumber = licenseNumber;
                        continue;
                    }
                    // This is the best guess we can make if you're using a PLP-era product.
                } else if (containsPLP && productName.includes("PolySpace")) {
                    licenseNumber = plpLicenseNumber
                } else {
                    if (!licenseNumber || !licenseNumber.trim() || licenseNumber === "No licenseNumber :(") {
                        errorMessageFunction(`There is an issue with the license file: the license number was not found for the product ${productName} with the product key ${productKey}. ` +
                            "Your license file has likely been tampered with. Please regenerate it for this product before proceeding.");
                        return;
                    }
                    errorMessageFunction(`There is an issue with the license file: the license number ${licenseNumber} was not found for the product ${productName}.`);
                    return;
                }

                // License offering.
                if (currentLine.includes("lo=")) {
                    if (currentLine.includes("lo=CN:")) {
                        licenseOffering = "lo=CN";
                    } else if (currentLine.includes("lo=CNU")) {
                        licenseOffering = "CNU";
                    } else if (currentLine.includes("lo=NNU")) {
                        licenseOffering = "NNU";
                    } else if (currentLine.includes("lo=TH")) {
                        if (!currentLine.includes("USER_BASED")) {
                            licenseOffering = "lo=CN";
                        } else {
                            errorMessageFunction(`There is an issue with the license file: it is formatted incorrectly. ${productName}'s license offering is being read as ` +
                                "Total Headcount, but also Network Named User, which doesn't exist.");
                            return;
                        }
                    } else {
                        errorMessageFunction(`There is an issue with the license file: the product ${productName} has an invalid license offering.`);
                        return;
                    }
                    // Figure out your trial or PLP's license offering.
                } else if (currentLine.includes("lr=") || containsPLP || !currentLine.includes("asset_info=")) {
                    if (seatCount > 0) {
                        if (currentLine.includes("USER_BASED")) {
                            licenseOffering = "NNU";
                        } else {
                            if (containsPLP && !currentLine.includes("asset_info=") && !currentLine.includes("ISSUED=")) {
                                licenseOffering = "lo=DC"; // See PLP-era explanation below.
                            } else {
                                licenseOffering = "lo=CN";
                            }
                        }
                    }
                    // This means you're likely using a macOS or Linux PLP-era license, which CAN use an options file... I think it has to.
                    else if (containsPLP && !currentLine.includes("asset_info=")) {
                        licenseOffering = "lo=IN";
                        seatCount = 1;
                    } else {
                        errorMessageFunction(`There is an issue with the license file: the product ${productName} comes from an Individual ` +
                            "or Designated Computer license, which cannot use an options file.");
                        return;
                    }
                } else {
                    if (currentLine.includes("PLATFORMS=x")) {
                        errorMessageFunction(`There is an issue with the license file: the product ${productName} comes from an Individual ` +
                            "or Designated Computer license generated from a PLP on Windows, which cannot use an options file.");
                        return;
                    } else {
                        if (productKey.length === 20) {
                            if (!licenseFileContentsLines.includes("TMW_Archive")) {
                                errorMessageFunction("There is an issue with the license file: it either is a Windows Individual license generated from a PLP " +
                                    "or you are missing the TMW_Archive product in order to make your pre-R2008a product(s) work.");
                                return;
                            } else {
                                // It's possible it's from an IN Windows PLP, but there's really no way to tell AFAIK.
                                licenseOffering = "lo=DC";
                                containsPLP = true;
                            }
                        } else {
                            errorMessageFunction(`There is an issue with the license file: the product ${productName} has an invalid license offering.`);
                            return;
                        }
                    }
                }

                // Check the product's expiration date. Year 0000 means perpetual.
                if (window.productExpirationDate === "01-jan-0000") {
                    window.productExpirationDate = "01-jan-2999";
                }

                const expirationDate = parseDdMmmYyyy(window.productExpirationDate);
                if (window.errorOccurred) {
                    return;
                }

                // Will come to midnight, since FlexLM + MathWorks doesn't seem to care about the time.
                const currentDate = new Date(new Date().toDateString());

                if (expirationDate < currentDate) {
                    errorMessageFunction(`There is an issue with the license file: The product ${productName} on license number ` +
                        `${licenseNumber} expired on ${window.productExpirationDate}. Please update your license file appropriately before proceeding.`);
                    return;
                }

                if (licenseOffering.includes("NNU")) {
                    if (seatCount !== 1 && !containsPLP) {
                        seatCount /= 2;
                    }
                }

                if (licenseOffering === "lo=CN" && (seatCount === 0) && licenseNumber === "220668") {
                    if ((productVersion <= 18) || (productName.includes("Polyspace") && productVersion <= 22)) {
                        errorMessageFunction(`There is an issue with the license file: it contains a Designated Computer license, ${licenseNumber}, " +
                        "that is incorrectly labeled as a Concurrent license.`);
                    } else {
                        errorMessageFunction(`There is an issue with the license file: The product ${productName} on license number ` +
                            `${licenseNumber} expired on ${window.productExpirationDate}. Please update your license file appropriately before proceeding.`);
                    }
                    return;
                }
                if (rawSeatCount === "uncounted") {
                    errorMessageFunction("There is an issue with the license file: it contains an Individual or Designated Computer license, " +
                        `which cannot use an options file. The license number is question is ${licenseNumber}.`);
                    return;
                }

                if (seatCount < 1 && currentLine.includes("asset_info=")) {
                    errorMessageFunction(`There is an issue with the license file: ${productName} on license ${licenseNumber} is reading with a seat count of zero or less.`);
                    return;
                }

                if (seatCount === 0 && containsPLP && licenseOffering === "lo=DC") {
                    seatCount = 1;
                }

                if (seatCount === 0) {
                    errorMessageFunction(`There is an issue with the license file: your seat count for ${productName} on license number ${licenseNumber} is being registered as zero... ` +
                        "that's probably not right. Your license file has likely been tampered with. Please regenerate it.");
                    return;
                }

                // Before proceeding, make sure the values we've collected are valid.
                if (!productName || !productName.trim()) {
                    errorMessageFunction(`There is an issue with the license file: a product name is being detected as blank on ${licenseNumber}.`);
                    return;
                }

                if (!licenseNumber || !licenseNumber.trim() || licenseNumberRegex.test(licenseNumber) || licenseNumber === "No licenseNumber :(") {
                    if (licenseNumber === "DEMO") {
                        errorMessageFunction(`There is an issue with the license file: an invalid license number is detected for your trial license of ${productName}. ` +
                            "Your trial license file has likely been tampered with. Please regenerate it before proceeding.");
                        return;
                    }
                    errorMessageFunction(`There is an issue with the license file: an invalid license number, ${licenseNumber}, is detected for ${productName}.`);
                    return;
                }
                if (!licenseOffering || !licenseOffering.trim()) {
                    errorMessageFunction(`There is an issue with the license file: a license offering could not be detected for ${productName} on license number ${licenseNumber}.`);
                    return;
                }

                if (!productKey || !productKey.trim()) {
                    errorMessageFunction(`There is an issue with the license file: a product key could not be detected for ${productName} on license number ${licenseNumber}.`);
                    return;
                }

                if (productName === "MATLAB_Distrib_Comp_Engine" && licenseOffering === "NNU") {
                    errorMessageFunction("There is an issue with the license file: you have a license for MATLAB Parallel Server, but it is being registered as part of an " +
                        "NNU license, which is not possible. Please regenerate your MATLAB Parallel Server license and then replace it with the existing contents in your license file.")
                    return;
                }

                let linesThatSubtractSeats = []; // This needs to be set here even if it's just going to be empty until the analyzer class potentially fills it.
                let originalLicenseFileSeatCount = seatCount;
                let borrowingEnabled = currentLine.includes("BORROW=");

                // Ready for entry into the object.
                licenseFileDictionary[licenseLineIndex] = {
                    productName,
                    seatCount,
                    productKey,
                    licenseOffering,
                    licenseNumber,
                    linesThatSubtractSeats,
                    originalLicenseFileSeatCount,
                    borrowingEnabled
                };


            } else if (window.currentLine.trimEnd().startsWith("#") || window.currentLine === "") {
                // Ignore empty and commented out lines.
            } else if (window.currentLine.trimEnd().startsWith("USE_SERVER")) {
                window.useServerFound = true;
            } else {
                errorMessageFunction("There is an issue with the license file: it has an unrecognized line. You likely manually edited the license file " +
                    "and likely need to regenerate it. The lines' contents are the following: " + window.currentLine);
                return;
            }
        } // End of for loop for license file parsing.

        if (serverLineCount > 3 || serverLineCount === 2) {
            errorMessageFunction("There is an issue with the license file: it has too many SERVER lines. Only 1 or 3 are accepted.");
            return;
        } else if (serverLineCount === 0) {
            errorMessageFunction("There is an issue with the license file: it has no SERVER lines. You must insert one manually. See instructions online on how to do so.");
            return;
        }

        // These will be used when gather Options File information. They're outside the loop since GROUPs and HOST_GROUPs may span multiple lines.
        // Is this also true for INCLUDE/EXCLUDE lines? Nope! 8-)
        let lastLineWasAGroupLine = false;
        let lastLineWasAHostGroupLine = false;
        let groupName = "No groupName set. :(";
        let hostGroupName = "No hostGroupName set. :(";

        // Options file information gathering.
        for (let optionsLineIndex = 0; optionsLineIndex < optionsFileContentsLines.length; optionsLineIndex++) {
            window.currentLine = optionsFileContentsLines[optionsLineIndex];

            if (currentLine.trim().startsWith("INCLUDE ") || currentLine.trim().startsWith("INCLUDE_BORROW ") || currentLine.trim().startsWith("EXCLUDE ") || currentLine.trim().startsWith("EXCLUDE_BORROW ")) {
                lastLineWasAGroupLine = false;
                lastLineWasAHostGroupLine = false;

                let optionType = "No optionType set. :(";

                if (currentLine.trim().startsWith("INCLUDE ")) {
                    optionType = "INCLUDE";
                } else if (currentLine.trim().startsWith("INCLUDE_BORROW ")) {
                    optionType = "INCLUDE_BORROW";
                } else if (currentLine.trim().startsWith("EXCLUDE ")) {
                    optionType = "EXCLUDE";
                } else if (currentLine.trim().startsWith("EXCLUDE_BORROW ")) {
                    optionType = "EXCLUDE_BORROW";
                }

                let lineParts = currentLine.split(" ");

                // Get rid of any blank parts.
                lineParts = lineParts.filter(part => part.trim() !== "");

                if (lineParts.length < 4) {
                    errorMessageFunction(`There is an issue with the options file: you have an incorrectly formatted ${optionType} line. It is missing necessary information. ` +
                        `The line in question is \\"${currentLine}\\".`);
                    return;
                }

                let productName = lineParts[1];
                let licenseNumber = "No licenseNumber set. :(";
                let productKey = "No productKey set. :(";
                let clientType = "No clientType set. :(";
                let clientSpecified = "No clientSpecified set. :("

                if (!productName || !productName.trim()) {
                    if (lineParts.length > 0) {
                        // Wait! Is there even anything left after the mess you've made?
                        if (lineParts.length < 4) {
                            errorMessageFunction("There is an issue with the options file: you have an incorrectly formatted line. It is missing necessary information. " +
                                `The line in question read as \"${currentLine}\".`);
                            return;
                        }
                        productName = lineParts[1];
                    }
                }

                if (productName.includes('"')) {
                    // Check for stray quotation marks.
                    let quoteCount = (currentLine.match(quoteRegex) || []).length;

                    if (quoteCount % 2 !== 0) {
                        errorMessageFunction(`There is an issue with the options file: one of your ${optionType} lines has a stray quotation mark. ` +
                            `The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }

                    productName = productName.replace('"', '');
                    licenseNumber = lineParts[2];

                    if (!productName.includes(':')) {
                        if (licenseNumber.toLowerCase().includes("key=")) {
                            productKey = lineParts[2];
                            let quotedProductKey = productKey.replace(keyEqualsRegex, "");
                            productKey = quotedProductKey.replace('"', "");
                            licenseNumber = ""; // Unspecified by the user.
                        } else { // asset_info=
                            let quotedLicenseNumber = licenseNumber.replace(assetInfoRegex, "");
                            licenseNumber = quotedLicenseNumber.replace('"', "");
                            productKey = "";
                        }

                        if (licenseNumber === "DEMO") {
                            errorMessageFunction("There is an issue with the options file: you have incorrectly specified a trial license number as DEMO. " +
                                `You need to specify the full trial license number in your options file. The line in question reads as this: \"${currentLine}\".`);
                            return;
                        }

                        clientType = lineParts[3];

                        if (clientType !== "USER" && clientType !== "GROUP" && clientType !== "HOST" && clientType !== "HOST_GROUP" && clientType !== "DISPLAY" &&
                            clientType !== "PROJECT" && clientType !== "INTERNET") {
                            errorMessageFunction(`There is an issue with the options file: you have incorrectly specified the client type on a line using ${optionType}.` +
                                `You attempted to use \"${clientType}\". Please reformat this ${optionType} line.`)
                            return;
                        }

                        clientSpecified = lineParts.slice(4).join(' ').trimEnd();

                        // This line was originally written with C#/.NET's .Trim. Since that doesn't exist in the exact same way for JS and I doubt there are any quotes in the actual product name...
                        // ... I have decided to just take the chance and remove any quotes from the product name. This isn't rocket science, we can make potential mistakes, okay?
                        // FlexLM doesn't care if you added quotation marks to the clientSpecified if they didn't original have quotation marks.
                        clientSpecified = clientSpecified.replace('"', "");

                        if (!clientSpecified || !clientSpecified.trim()) {
                            errorMessageFunction(`There is an issue with the options file: you have not specified the ${clientType} you want to use on one your ${optionType} lines. ` +
                                `The line in question reads as this: \"${currentLine}\".`);
                            return;
                        }
                    } else { // If the productName has " and :
                        let colonParts = productName.split(":");
                        if (colonParts.length !== 2) {
                            errorMessageFunction(`There is an issue with the options file: one of your ${optionType} lines has a stray colon. ` +
                                `The line in question reads as this: \"${currentLine}\".`);
                            return;
                        }

                        productName = colonParts[0];

                        if (colonParts[1].includes("key=")) {
                            let unfixedProductKey = colonParts[1];
                            productKey = unfixedProductKey.replace(keyEqualsRegex, "");
                            licenseNumber = ""; // This was never specified by the user in the options file, so we leave it blank.
                        } else {
                            let unfixedLicenseNumber = colonParts[1];
                            licenseNumber = unfixedLicenseNumber.replace(assetInfoRegex, "");
                            productKey = ""; // Same as above.
                        }

                        clientType = lineParts[2];
                        clientSpecified = lineParts.slice(3).join(' ').trimEnd();
                        clientSpecified = clientSpecified.replace('"', ""); // Again, this was originally using .Trim.

                        if (licenseNumber === "DEMO") { // Same note as earlier because this the exact same situation.
                            errorMessageFunction("There is an issue with the options file: you have incorrectly specified a trial license number as DEMO. " +
                                `You need to specify the full trial license number in your options file. The line in question reads as this: \"${currentLine}\".`);
                            return;
                        }

                        if (!clientSpecified || !clientSpecified.trim()) {
                            errorMessageFunction(`There is an issue with the options file: you have not specified the ${clientType} you want to use on one your ${optionType} lines. ` +
                                `The line in question reads as this: \"${currentLine}\".`);
                            return;
                        }
                    }
                } else if (productName.includes(':')) {
                    // Yes, this is the exact same code used just a moment ago. I've been told sometimes it's better not to refactor, in case things need to change, but in this case, I'm just being lazy.
                    // Also, people who aren't developers will say something stupid, such as, "Well, how many lines is your code???" to judge how complex it is. Well, here's some...
                    // ... "added complexity" AKA being lazy. Who knew not using things such as for loops made for such impressive programmers???
                    let colonParts = productName.split(":");
                    if (colonParts.length !== 2) {
                        errorMessageFunction(`There is an issue with the options file: one of your ${optionType} lines has a stray colon. ` +
                            `The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }

                    productName = colonParts[0];

                    if (colonParts[1].includes("key=")) {
                        let unfixedProductKey = colonParts[1];
                        productKey = unfixedProductKey.replace(keyEqualsRegex, "");
                        licenseNumber = "";
                    } else {
                        let unfixedLicenseNumber = colonParts[1];

                        licenseNumber = unfixedLicenseNumber.replace(assetInfoRegex, "");
                        productKey = "";
                    }

                    clientType = lineParts[2];
                    clientSpecified = lineParts.slice(3).join(' ').trimEnd();
                    clientSpecified = clientSpecified.replace('"', ""); // Again, this was originally using .Trim.

                    if (licenseNumber === "DEMO") { // Same note as earlier because this the exact same situation.
                        errorMessageFunction("There is an issue with the options file: you have incorrectly specified a trial license number as DEMO. " +
                            `You need to specify the full trial license number in your options file. The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }

                    if (!clientSpecified || !clientSpecified.trim()) {
                        errorMessageFunction(`There is an issue with the options file: you have not specified the ${clientSpecified} you want to use on one your ${optionType} lines. ` +
                            `The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }

                } else { // You have a simple productName. Yay.
                    clientType = lineParts[2];
                    clientSpecified = lineParts.slice(3).join(' ').trimEnd();
                    clientSpecified = clientSpecified.replace('"', ""); // Don't make me say it again.

                    licenseNumber = "";
                    productKey = "";

                    if (!clientSpecified || !clientSpecified.trim()) {
                        errorMessageFunction(`There is an issue with the options file: you have not specified the ${clientSpecified} you want to use on one your ${optionType} lines. ` +
                            `The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }
                }

                // Check to see if your products are valid, in general. There is a check later on in the Analyzer to make sure the products are included on the license.
                let productFoundInMasterList = masterProductsList.some(productFromList => productFromList === productName);

                if (!productFoundInMasterList) {
                    let suggestion = findClosestProduct(productName, masterProductsList);
                    let suggestionText = suggestion ? ` Did you mean \"${suggestion}\"?` : "";
                    errorMessageFunction(`There is an issue with the options file: you have specified a product that does not exist. The product in question is \"${productName}\". ` +
                        `Ensure there are no typos, the product name comes from the start of the INCREMENT line in the license file, and it has the exact same case-sensitivity.` +
                        `${suggestionText} ` +
                        `The line in question reads as this: \"${currentLine}\".`);
                    return;
                }

                // Validate your clientType.
                if (clientType !== "USER" && clientType !== "GROUP" && clientType !== "HOST" && clientType !== "HOST_GROUP" && clientType !== "DISPLAY" &&
                    clientType !== "PROJECT" && clientType !== "INTERNET") {
                    if (!clientType || !clientType.trim()) {
                        errorMessageFunction("There is an issue with the options file: you have an incorrectly formatted client type. It would typically be something like USER or GROUP, " +
                            `but yours is being detected as nothing. Please make sure you have formatted the line with client type correctly. The line in question reads as this: \"${currentLine}\".`);
                    } else { // Who knows what you put in here.
                        errorMessageFunction("There is an issue with the options file: you have an incorrectly formatted client type. It would typically be something like USER or GROUP, " +
                            `but yours is being detected as ${clientType}. Please make sure you have formatted the line with client type correctly. The line in question reads as this: \"${currentLine}\".`);
                    }
                    return;
                }

                // Check for wildcards and IP addresses.
                if (clientSpecified.includes("*")) {
                    window.wildCardsAreUsed = true;
                }

                if (ipAddressRegex.test(clientSpecified)) {
                    window.ipAddressesAreUsed = true;
                }

                // Listen, we all have bad ideas.
                if (productName === "MATLAB_Distrib_Comp_Engine") {
                    window.optionsFileUsesMatlabParallelServer = true;
                }

                if (licenseNumber.includes('"')) {
                    licenseNumber = licenseNumber.replace('"', '');
                }

                let savedLine = currentLine;

                // Ready for entry into the object.
                if (currentLine.trimStart().startsWith("INCLUDE ")) {
                    includeDictionary[optionsLineIndex] = {
                        productName,
                        licenseNumber,
                        productKey,
                        clientType,
                        clientSpecified,
                        savedLine
                    };
                } else if (currentLine.trimEnd().startsWith("INCLUDE_BORROW ")) {
                    includeBorrowDictionary[optionsLineIndex] = {
                        productName,
                        licenseNumber,
                        productKey,
                        clientType,
                        clientSpecified,
                        savedLine
                    };
                } else if (currentLine.trimEnd().startsWith("EXCLUDE ")) {
                    excludeDictionary[optionsLineIndex] = {
                        productName,
                        licenseNumber,
                        productKey,
                        clientType,
                        clientSpecified,
                        savedLine
                    };
                } else if (currentLine.trimEnd().startsWith("EXCLUDE_BORROW ")) {
                    excludeBorrowDictionary[optionsLineIndex] = {
                        productName,
                        licenseNumber,
                        productKey,
                        clientType,
                        clientSpecified,
                        savedLine
                    };
                }

            } else if (currentLine.trim().startsWith("INCLUDEALL ") || currentLine.trim().startsWith("EXCLUDEALL ")) {
                lastLineWasAGroupLine = false;
                lastLineWasAHostGroupLine = false;

                let optionSpecified = "No optionSpecified set. :("; // Ex: INCLUDEALL
                let clientSpecified = "No clientSpecified set. :("; // Ex: matlab_users_group
                let lineParts = currentLine.split(" ");

                // Please get rid of the blank garbage. THANK YOU.
                lineParts = lineParts.filter(part => part && part.trim());

                if (window.currentLine.trimStart().startsWith("INCLUDEALL ")) {
                    optionSpecified = "INCLUDEALL";
                } else if (window.currentLine.trimStart().startsWith("EXCLUDEALL ")) {
                    optionSpecified = "EXCLUDEALL";
                }

                if (lineParts.length < 3) {
                    errorMessageFunction(`There is an issue with the options file: you have an incorrectly formatted ${optionSpecified} line. It is missing necessary information. ` +
                        `The line in question reads as this: \"${currentLine}\".`);
                }

                let clientType = lineParts[1];
                clientSpecified = lineParts.slice(2).join(' ').trimEnd();
                clientSpecified = clientSpecified.replace('"', "");

                if (!clientSpecified || !clientSpecified.trim()) {
                    errorMessageFunction(`There is an issue with the options file: you have not specified the ${clientSpecified} you want to use on one your ${optionSpecified} lines. ` +
                        `The line in question reads as this: \"${currentLine}\".`);
                    return;
                }

                // Validate your clientType.
                if (clientType !== "USER" && clientType !== "GROUP" && clientType !== "HOST" && clientType !== "HOST_GROUP" && clientType !== "DISPLAY" &&
                    clientType !== "PROJECT" && clientType !== "INTERNET") {
                    if (!clientType || !clientType.trim()) {
                        errorMessageFunction("There is an issue with the options file: you have an incorrectly formatted client type. It would typically be something like USER or GROUP, " +
                            `but yours is being detected as nothing. Please make sure you have formatted the line with client type correctly. The line in question reads as this: \"${currentLine}\".`);
                    } else { // Who knows what you put in here.
                        errorMessageFunction("There is an issue with the options file: you have an incorrectly formatted client type. It would typically be something like USER or GROUP, " +
                            `but yours is being detected as ${clientType}. Please make sure you have formatted the line with client type correctly. The line in question reads as this: \"${currentLine}\".`);
                    }
                    return;
                }

                // Check for wildcards and IP addresses.
                if (clientSpecified.includes("*")) {
                    window.wildCardsAreUsed = true;
                }

                if (ipAddressRegex.test(clientSpecified)) {
                    window.ipAddressesAreUsed = true;
                }

                // No checking for MATLAB Parallel Server since INCLUDEALL/EXCLUDEALL don't specify products; it's all of them!

                let savedLine = currentLine;

                // Ready for entry into the object.
                if (currentLine.trimEnd().startsWith("INCLUDEALL ")) {
                    includeAllDictionary[optionsLineIndex] = {clientType, clientSpecified, savedLine};
                } else if (currentLine.trimEnd().startsWith("EXCLUDEALL ")) {
                    excludeAllDictionary[optionsLineIndex] = {clientType, clientSpecified, savedLine};
                }
            } else if (currentLine.trim().startsWith("MAX ")) {
                lastLineWasAGroupLine = false;
                lastLineWasAHostGroupLine = false;
                let lineParts = currentLine.split(" ");

                // Please get rid of the blank garbage. THANK YOU.
                lineParts = lineParts.filter(part => part && part.trim());

                if (lineParts.length < 5) {
                    errorMessageFunction("There is an issue with the options file: you have an incorrectly formatted MAX line. It is missing necessary information. " +
                        "A MAX line should be formatted as: MAX <number_of_seats> <product_name> <client_type> <client_specified>. " +
                        "Example: MAX 5 MATLAB USER john_doe. " +
                        `The line in question reads as this: \"${currentLine}\".`);
                }

                let maxSeats = Number(lineParts[1]);
                let maxProductName = (lineParts[2]);
                let maxClientType = (lineParts[3]);
                let maxClientSpecified = lineParts.slice(4).join(' ').trimEnd();
                maxClientSpecified = maxClientSpecified.replace('"', "");

                // Check for wildcards and IP addresses.
                if (maxClientSpecified.includes("*")) {
                    window.wildCardsAreUsed = true;
                }

                if (ipAddressRegex.test(maxClientSpecified)) {
                    window.ipAddressesAreUsed = true;
                }

                if (maxProductName === "MATLAB_Distrib_Comp_Engine") {
                    window.optionsFileUsesMatlabParallelServer = true;
                }

                let savedLine = currentLine;

                // Ready for entry into the object.
                maxDictionary[optionsLineIndex] = {
                    maxSeats,
                    maxProductName,
                    maxClientType,
                    maxClientSpecified,
                    savedLine
                };
            } else if (currentLine.trim().startsWith("RESERVE ")) {
                lastLineWasAGroupLine = false;
                lastLineWasAHostGroupLine = false;

                let lineParts = currentLine.split(" ");

                // Please get rid of the blank garbage. THANK YOU.
                lineParts = lineParts.filter(part => part && part.trim());

                if (lineParts.length < 5) {
                    errorMessageFunction("There is an issue with the options file: you have an incorrectly formatted RESERVE line. It is missing necessary information. " +
                        `The line in question reads as this: \"${currentLine}\".`);
                    return;
                }

                // Check for stray quotation marks.
                let quoteCount = (currentLine.match(quoteRegex) || []).length;

                if (quoteCount % 2 !== 0) {
                    errorMessageFunction(`There is an issue with the options file: one of your RESERVE lines has a stray quotation mark. ` +
                        `The line in question reads as this: \"${currentLine}\".`);
                    return;
                }

                let reserveSeatsString = lineParts[1];
                let reserveSeatsNumber = Number(reserveSeatsString);
                let reserveProductName = (lineParts[2]);
                let reserveLicenseNumber = "No reserveLicenseNumber set :(";
                let reserveProductKey = "No reserveProductKey set :(";
                let reserveClientType = "No reserveClientType set :(";
                let reserveClientSpecified = "No reserveClientSpecified set :(";

                if (reserveSeatsNumber <= 0) {
                    errorMessageFunction("There is an issue with the options file: you specified a RESERVE line with a seat count of zero or less... why? " +
                        `YThe line in question reads as this: \"${currentLine}\".`);
                    return;
                }

                if (!reserveSeatsNumber) {
                    errorMessageFunction("There is an issue with the options file: you have incorrectly specified the seat count for one of your RESERVE lines. " +
                        `You either chose an invalid number or specified something other than a number. The line in question reads as this: \"${currentLine}\".`);
                    return;
                }

                if (reserveProductName.includes('"')) {

                    reserveProductName = reserveProductName.replace('"', '');
                    reserveLicenseNumber = lineParts[3];

                    if (!reserveProductName.includes(':')) {
                        if (reserveProductName.includes("key=")) {
                            reserveProductKey = lineParts[3];
                            let quotedReserveProductKey = reserveProductKey.replace(keyEqualsRegex, "");
                            reserveProductKey = quotedReserveProductKey.replace('"', "");
                            reserveLicenseNumber = ""; // Unspecified by the user.
                        } else { // asset_info=
                            let quotedReserveLicenseNumber = reserveLicenseNumber.replace(assetInfoRegex, "");
                            reserveLicenseNumber = quotedReserveLicenseNumber.replace('"', "");
                            reserveProductKey = "";
                        }

                        if (reserveLicenseNumber === "DEMO") {
                            errorMessageFunction("There is an issue with the options file: you have incorrectly specified a trial license number as DEMO. " +
                                `You need to specify the full trial license number in your options file. The line in question reads as this: \"${currentLine}\".`);
                            return;
                        }

                        reserveClientType = lineParts[4];
                        reserveClientSpecified = lineParts.slice(5).join(' ').trimEnd();
                        reserveClientSpecified = reserveClientSpecified.replace('"', "");
                    } else { // If you have " and :
                        let colonParts = reserveProductName.split(":");
                        if (colonParts.length !== 2) {
                            errorMessageFunction(`There is an issue with the options file: one of your RESERVE lines has a stray colon. ` +
                                `The line in question reads as this: \"${currentLine}\".`);
                            return;
                        }

                        reserveProductName = colonParts[0];

                        if (colonParts[1].includes("key=")) {
                            let unfixedReserveProductKey = colonParts[1];
                            reserveProductKey = unfixedReserveProductKey.replace(keyEqualsRegex, "");
                            reserveLicenseNumber = ""; // This was never specified by the user in the options file, so we leave it blank.
                        } else {
                            let unfixedLicenseNumber = colonParts[1];
                            reserveLicenseNumber = unfixedLicenseNumber.replace(assetInfoRegex, "");
                            reserveProductKey = ""; // Same as above.
                        }

                        reserveClientType = lineParts[3];
                        reserveClientSpecified = lineParts.slice(4).join(' ').trimEnd();
                        reserveClientSpecified = reserveClientSpecified.replace('"', ""); // Again, this was originally using .Trim.

                        if (reserveLicenseNumber === "DEMO") { // Same note as earlier because this the exact same situation.
                            errorMessageFunction("There is an issue with the options file: you have incorrectly specified a trial license number as DEMO. " +
                                `You need to specify the full trial license number in your options file. The line in question reads as this: \"${currentLine}\".`);
                            return;
                        }
                    }
                } else if (reserveProductName.includes(':')) { // If the user used a : instead of a "
                    let colonParts = reserveProductName.split(":");
                    if (colonParts.length !== 2) {
                        errorMessageFunction(`There is an issue with the options file: one of your RESERVE lines has a stray colon. ` +
                            `The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }

                    reserveProductName = colonParts[0];

                    if (colonParts[1].includes("key=")) {
                        let unfixedReserveProductKey = colonParts[1];
                        reserveProductKey = unfixedReserveProductKey.replace(keyEqualsRegex, "");
                        reserveLicenseNumber = ""; // This was never specified by the user in the options file, so we leave it blank.
                    } else {
                        let unfixedLicenseNumber = colonParts[1];

                        reserveLicenseNumber = unfixedLicenseNumber.replace(assetInfoRegex, "");
                        reserveProductKey = ""; // Same as above.
                    }

                    reserveClientType = lineParts[3];
                    reserveClientSpecified = lineParts.slice(4).join(' ').trimEnd();
                    reserveClientSpecified = reserveClientSpecified.replace('"', ""); // Again, this was originally using .Trim.
                } else { // Simple product name. Yay.
                    reserveClientType = lineParts[3];
                    reserveClientSpecified = lineParts.slice(4).join(' ').trimEnd();
                    reserveClientSpecified = reserveClientSpecified.replace('"', "");
                    reserveLicenseNumber = "";
                    reserveProductKey = "";
                }

                // Check for wildcards and IP addresses.
                if (reserveClientSpecified.includes("*")) {
                    window.wildCardsAreUsed = true;
                }

                if (ipAddressRegex.test(reserveClientSpecified)) {
                    window.ipAddressesAreUsed = true;
                }

                // Listen, we all have HORRIBLE ideas sometimes.
                if (reserveProductName === "MATLAB_Distrib_Comp_Engine") {
                    window.optionsFileUsesMatlabParallelServer = true;
                }

                if (reserveLicenseNumber.includes('"')) {
                    reserveLicenseNumber = reserveLicenseNumber.replace('"', '');
                }

                let savedLine = currentLine;

                // Ready for entry into the object.
                reserveDictionary[optionsLineIndex] = {
                    reserveSeatsNumber,
                    reserveProductName,
                    reserveLicenseNumber,
                    reserveProductKey,
                    reserveClientType,
                    reserveClientSpecified,
                    savedLine
                };
            } else if (currentLine.trim().startsWith("GROUP ") || currentLine.trim().startsWith("GROUP\t")) {
                lastLineWasAGroupLine = true;
                lastLineWasAHostGroupLine = false;

                let lineWithTabsRemoved = currentLine.replaceAll("\t", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\n", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\r", "");
                let lineParts = lineWithTabsRemoved.split(" ").filter(part => /\S/.test(part));

                groupName = lineParts[1];
                groupName = groupName.replace(" ", ""); // Hopefully just removing them in general and not at the beginning + end of lines works...
                groupName = groupName.replace("\t", "");
                let groupUsers = lineParts.slice(2).join(' ').trimEnd();
                let groupUserCount = 0;

                if (groupUsers?.trim()) {
                    groupUserCount = groupUsers.split(whiteSpaceRegex).length;
                }

                // Check if the groupName already exists in the dictionary. If it does, we want to combine them, since this is what FlexLM does.
                const optionsLineIndexToWriteTo = Object.keys(groupDictionary).find(key => groupDictionary[key].groupName === groupName);

                if (optionsLineIndexToWriteTo !== undefined) {
                    let oldUsers = groupDictionary[optionsLineIndexToWriteTo].groupUsers;
                    let oldCount = groupDictionary[optionsLineIndexToWriteTo].groupUserCount;
                    let newGroupUsers = `${oldUsers} ${groupUsers}`;
                    let newGroupUserCount = oldCount + groupUserCount;

                    groupDictionary[optionsLineIndexToWriteTo] = {groupName, groupUsers: newGroupUsers, groupUserCount: newGroupUserCount};

                } else { // If no existing entry can be found, create a new one.
                    // Ready for entry into the object.
                    groupDictionary[optionsLineIndex] = {groupName, groupUsers, groupUserCount};
                }

                // Check for wildcards and IP addresses.
                if (groupUsers.includes("*")) {
                    window.wildCardsAreUsed = true;
                }

                if (ipAddressRegex.test(groupUsers)) {
                    window.ipAddressesAreUsed = true;
                }
            } else if (currentLine.trim().startsWith("HOST_GROUP ") || currentLine.trim().startsWith("HOST_GROUP\t")) {
                lastLineWasAGroupLine = false;
                lastLineWasAHostGroupLine = true;

                let lineWithTabsRemoved = currentLine.replaceAll("\t", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\n", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\r", "");
                let lineParts = lineWithTabsRemoved.split(" ").filter(part => /\S/.test(part));

                hostGroupName = lineParts[1];
                hostGroupName = hostGroupName.replace(" ", ""); // Hopefully just removing them in general and not at the beginning + end of lines works...
                hostGroupName = hostGroupName.replace("\t", "");
                let hostGroupClientSpecified = lineParts.slice(2).join(' ').trimEnd();
                hostGroupClientSpecified = hostGroupClientSpecified.replace('"', "");

                // Check if the groupName already exists in the dictionary. If it does, we want to combine them, since this is what FlexLM does.
                let optionsLineIndexToWriteTo = Object.keys(hostGroupDictionary)
                    .find(hostGroupDictionaryGroupNameEntry => hostGroupDictionary[hostGroupDictionaryGroupNameEntry].hostGroupName === hostGroupName);

                if (optionsLineIndexToWriteTo !== undefined) {
                    let oldUsers = hostGroupDictionary[optionsLineIndexToWriteTo].combinedUsers ?? hostGroupDictionary[optionsLineIndexToWriteTo].hostGroupClientSpecified;
                    let combinedUsers = `${oldUsers} ${hostGroupClientSpecified}`;

                    hostGroupDictionary[optionsLineIndexToWriteTo] = {hostGroupName, combinedUsers};

                } else { // If no existing entry can be found, create a new one.
                    // Ready for entry into the object.
                    hostGroupDictionary[optionsLineIndex] = {hostGroupName, hostGroupClientSpecified};
                }

                // Check for wildcards and IP addresses.
                if (hostGroupClientSpecified.includes("*")) {
                    window.wildCardsAreUsed = true;
                }

                if (ipAddressRegex.test(hostGroupClientSpecified)) {
                    window.ipAddressesAreUsed = true;
                }
            } else if (currentLine.trim().startsWith("GROUPCASEINSENSITIVE ON")) {
                lastLineWasAGroupLine = false;
                lastLineWasAHostGroupLine = false;
                window.caseSensitivity = false;
            } else if (currentLine.trim().startsWith("TIMEOUTALL ") || currentLine.trim().startsWith("DEBUGLOG ") || currentLine.trim().startsWith("LINGER ") || currentLine.trim().startsWith("MAX_OVERDRAFT ")
                || currentLine.trim().startsWith("REPORTLOG ") || currentLine.trim().startsWith("TIMEOUT ") || currentLine.trim().startsWith("BORROW ") || currentLine.trim().startsWith("NOLOG ")
                || currentLine.trim().startsWith("DEFAULT ") || currentLine.trim().startsWith("HIDDEN ") || currentLine.trim().startsWith("MAX_BORROW_HOURS") || currentLine.trim().startsWith('#')
                || !currentLine || !currentLine.trim() || currentLine.trim().startsWith("BORROW_LOWWATER ")) {

                lastLineWasAGroupLine = false;
                lastLineWasAHostGroupLine = false;

                // Basic syntax validation for TIMEOUTALL, TIMEOUT, and LINGER.
                let trimmedLine = currentLine.trim();
                if (trimmedLine.startsWith("TIMEOUTALL ")) {
                    let lineParts = trimmedLine.split(" ").filter(part => part.trim() !== "");
                    if (lineParts.length < 2) {
                        errorMessageFunction("There is an issue with the options file: your TIMEOUTALL line is missing the timeout value (in seconds). " +
                            `The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }
                    let timeoutValue = Number(lineParts[1]);
                    if (!Number.isInteger(timeoutValue) || timeoutValue < 0) {
                        errorMessageFunction("There is an issue with the options file: your TIMEOUTALL line has an invalid timeout value. " +
                            `It must be a positive integer (in seconds). The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }
                } else if (trimmedLine.startsWith("TIMEOUT ")) {
                    let lineParts = trimmedLine.split(" ").filter(part => part.trim() !== "");
                    if (lineParts.length < 3) {
                        errorMessageFunction("There is an issue with the options file: your TIMEOUT line is missing information. " +
                            `A TIMEOUT line should be formatted as: TIMEOUT product seconds. The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }
                    let timeoutValue = Number(lineParts[2]);
                    if (!Number.isInteger(timeoutValue) || timeoutValue < 0) {
                        errorMessageFunction("There is an issue with the options file: your TIMEOUT line has an invalid timeout value. " +
                            `It must be a positive integer (in seconds). The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }
                } else if (trimmedLine.startsWith("LINGER ")) {
                    let lineParts = trimmedLine.split(" ").filter(part => part.trim() !== "");
                    if (lineParts.length < 3) {
                        errorMessageFunction("There is an issue with the options file: your LINGER line is missing information. " +
                            `A LINGER line should be formatted as: LINGER product seconds. The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }
                    let lingerValue = Number(lineParts[2]);
                    if (!Number.isInteger(lingerValue) || lingerValue < 0) {
                        errorMessageFunction("There is an issue with the options file: your LINGER line has an invalid linger value. " +
                            `It must be a positive integer (in seconds). The line in question reads as this: \"${currentLine}\".`);
                        return;
                    }
                }
            } else if (lastLineWasAGroupLine === true) {
                let lineWithTabsRemoved = currentLine.replaceAll("\t", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\n", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\r", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\\", "");
                let lineParts = lineWithTabsRemoved.split(" ").filter(part => /\S/.test(part));

                let groupUsers = lineParts.join(' ').trimEnd();
                let groupUserCount = 0;

                // Check if groupUsers is null, empty, or whitespace. If it is, leave the count at 0.
                if (groupUsers?.trim()) {
                    groupUserCount = groupUsers.split(whiteSpaceRegex).length;
                }

                // The GROUP already exists, silly.
                const optionsLineIndexToWriteTo = Object.keys(groupDictionary).find(key => groupDictionary[key].groupName === groupName);

                if (optionsLineIndexToWriteTo !== undefined) {
                    const existingGroupEntry = groupDictionary[optionsLineIndexToWriteTo];
                    const combinedUsers = `${existingGroupEntry.groupUsers} ${groupUsers}`;
                    const combinedCount = existingGroupEntry.groupUserCount + groupUserCount;
                    groupDictionary[optionsLineIndexToWriteTo] = {
                        ...existingGroupEntry,
                        groupUsers: combinedUsers,
                        groupUserCount: combinedCount
                    };
                }

                // Check for wildcards and IP addresses.
                if (groupUsers.includes("*")) {
                    window.wildCardsAreUsed = true;
                }

                if (ipAddressRegex.test(groupUsers)) {
                    window.ipAddressesAreUsed = true;
                }
            } else if (lastLineWasAHostGroupLine === true) {
                let lineWithTabsRemoved = currentLine.replaceAll("\t", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\n", "");
                lineWithTabsRemoved = lineWithTabsRemoved.replaceAll("\r", "");
                let lineParts = lineWithTabsRemoved.split(" ").filter(part => /\S/.test(part));

                let hostGroupClientSpecified = lineParts.join(' ').trimEnd();
                hostGroupClientSpecified = hostGroupClientSpecified.replace('"', "");

                // The HOST_GROUP already exists, silly.
                const optionsLineIndexToWriteTo = Object.keys(hostGroupDictionary).find(key => hostGroupDictionary[key].hostGroupName === hostGroupName);

                if (optionsLineIndexToWriteTo !== undefined) {
                    const existingHostGroupEntry = hostGroupDictionary[optionsLineIndexToWriteTo];
                    const oldUsers = existingHostGroupEntry.combinedUsers ?? existingHostGroupEntry.hostGroupClientSpecified;
                    const combinedUsers = `${oldUsers} ${hostGroupClientSpecified}`;
                    hostGroupDictionary[optionsLineIndexToWriteTo] = {
                        ...existingHostGroupEntry,
                        combinedUsers,
                    };
                }

                // Check for wildcards and IP addresses.
                if (hostGroupClientSpecified.includes("*")) {
                    window.wildCardsAreUsed = true;
                }

                if (ipAddressRegex.test(hostGroupClientSpecified)) {
                    window.ipAddressesAreUsed = true;
                }
            } else { // This should help spot my stupid typos.
                errorMessageFunction("There is an issue with the options file: you have started a line with an unrecognized option. Please make sure you didn't make any typos. " +
                    `The line in question reads as this: \"${currentLine}\".`);
                return;
            }
        }
    } catch (rawErrorMessage) {
        errorMessageFunction(`Something broke really badly in the Gatherer. What a bummer. Here's the automatically generated error: ${rawErrorMessage}`);
    }
}

// Find the closest matching product name from the master list using Levenshtein distance.
function findClosestProduct(input, masterList) {
    let bestMatch = null;
    let bestDistance = Infinity;
    let inputLower = input.toLowerCase();

    for (let product of masterList) {
        let productLower = product.toLowerCase();
        let distance = levenshteinDistance(inputLower, productLower);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = product;
        }
    }

    // Only suggest if the distance is reasonable (less than 40% of the input length).
    let threshold = Math.max(3, Math.ceil(input.length * 0.4));
    return bestDistance <= threshold ? bestMatch : null;
}

function levenshteinDistance(a, b) {
    let matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// Parse "dd-MMM-yyyy" into Date.
function parseDdMmmYyyy(str) {
    const months = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const [day, mon, yr] = str.split('-');
    return new Date(parseInt(yr, 10),
        months[mon.toLowerCase()],
        parseInt(day, 10));
}