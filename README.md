# Options File Checker
A simple program designed to help you spot obvious errors in your options file used for MathWorks Products.

To download this program, click the green <>Code button, select "Download ZIP", extract the ZIP archive, if it isn't done automatically, go into the newly extracted folder, go into the wwwroot folder, and then double-click the index.html folder.

Notes for user:
- This tool is not created by nor associated with MathWorks.
- The top box displays warnings, the bottom displays the seat count and what is subtracting from it, if anything.
- Not all errors can be accounted for. For example, if you're getting an error -38, there isn't a way for this to detect that (or at least, not any good way IMO.)
- Seat count calculations ignore HOST, GROUP_HOST, INTERNET, PROJECT, and DISPLAY on non-RESERVE lines. Multiple people could be coming from these client types, so there's no way to calculate seat count with these.
- Yes, options= and port= aren't technically needed on the DAEMON line, but MathWorks says you should use them.
- I _think_ it's possible in the options file to specify multiple entries (ex: INCLUDE MATLAB USER rob) without creating a line break. This program does not support this type of formatting and probably never will.
- In general, with FlexNet, USERs are case-sensitive. Additionally, if you have the exact same INCLUDE line multiple times, each one will be counted separately and will subtract from the seat count. Because FlexNet does this, so does this program.
- Since spaces cannot be in USER names with FlexNet, this program will treat a space as an indicator of a separate entry.
- If you combined your license file with non-MathWorks products, this will not work. Support for other products is not planned.

To-do:
- Identify bad INCREMENT lines (possibly counting lineParts?)
- Investigate: the Checker and Editor have different master product lists (~280 vs ~171 products). Audit both against MathWorks' current product catalog and unify them.
- Investigate: detect duplicate members within a GROUP definition (e.g., GROUP engineers alice bob alice). This inflates the member count and causes incorrect seat subtraction since FlexLM silently deduplicates.
- Investigate: RESERVE + INCLUDE double-counting. If you both RESERVE seats for a group and INCLUDE the same product for the same group, both currently subtract seats. In FlexLM, RESERVE carves out seats that are then used by INCLUDE, so they may overlap rather than stack.
- Investigate: inline comments (# at the end of directive lines). FlexLM supports trailing comments like "INCLUDE MATLAB USER alice # Senior engineer". Verify the parser correctly strips these rather than treating # and everything after it as part of the client specification.
- Investigate: username/hostname character validation. FlexLM doesn't allow spaces in usernames (already noted), but characters like @, ;, or unicode in usernames/hostnames could cause silent failures. Consider validating that these contain only valid FlexLM characters.
- Investigate: line continuation (\) support on non-GROUP/HOST_GROUP lines. FlexLM supports \ continuation on any line, but the parser currently only handles this for GROUP and HOST_GROUP. Other multi-line directives could be misparsed.
