#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { parseInputFile } from "./nepenthe";
import { exit } from "process";
import { readFileSync } from "fs";
import {
    modeHelper,
    scoreHelper,
    staffHelper,
    globalHelper,
    banjo5thStrHelper,
} from "./handlebars";
import hbs from "handlebars";

module.exports = { main };

/**
 * The main function for the `nepenthe` command.
 */
function main() {

    // TODO: move actual processing into its own function in nepenthe.ts; 
    // main() should primarily deal with:
    
    // handle args:
    // Positional args:
    // input file ('-' for STDIN)

    // Optional args
    // -f output format; follows lilypond convention (pdf, png, svg) and adds `ly`. If a local lilypond binary is available, defaults to pdf. If not, defaults to `ly`.)
    // -o output file "Set the default output file to FILE or, if a folder with that name exists, direct the output to FOLDER, taking the file name from the input file. The appropriate suffix will be added (e.g. .pdf for pdf) in both cases. (If input file is STDIN, title will be generated from the `title` metadata. If there's no title, the output file will be named with a timestamp.)"
    // -h help summary
    // -v output version number and exit

    // (If you need to use advanced Lilypond command line options, use Nepenthe to generate your .ly file and process it separately with `lilypond`.)

    // PREFLIGHT:
    // - check that output path exists and is writable
    //      - throw error if not
    // - check for ~/.config/nepenthe/nepenthe_config.yml
    //      - If directory/file does not exist, create it and add an annotated 'example_config' file
    // - check for `lilypond` executable in $PATH.
    //      - If not set in nepenthe_config, add it
    //      - If not found and user has requested a graphic output format, throw an error
    // - Determine output filename if format is specified but 

    // POSTFLIGHT:
    // - If user has selected STDOUT, dump data and exit
    // - If output file is a path, write appropriate file and
    //     Display success/failure message as appropriate


    let data = parseInputFile("Herbert Ellis - Firefly Jig.nep"); // TODO parse input args

    hbs.registerHelper("mode", modeHelper);
    hbs.registerHelper("score", scoreHelper);
    hbs.registerHelper("staff", staffHelper);

    hbs.registerPartial(
        "partPartial",
        fs.readFileSync("./src/templates/partials/part.hbs", "utf-8")
    );
    hbs.registerPartial(
        "scorePartial",
        fs.readFileSync("./src/templates/partials/score.hbs", "utf-8")
    );
    hbs.registerPartial(
        "staffPartial",
        fs.readFileSync("./src/templates/partials/staff.hbs", "utf-8")
    );

    // Compile and render the template data from the Nepenthe document
    let tpl = hbs.compile(data.input);
    data.content = tpl(data);

    // Compile and render the base template (passing the rendered Nepenthe doc
    // body from the previous step.)
    let base = hbs.compile(fs.readFileSync("./src/templates/base.hbs", "utf-8"));
    let final = base(data);
    console.log(final);
}

// If index.js has been invoked directly, run the main() function:
if (require.main === module) {
    main();
    exit(0);
}
