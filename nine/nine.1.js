import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

import { runIntCode } from "../intCode";

fs.readFile("nine/nine.input", "utf8", (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    var endState = runIntCode(_.clone(program), [1]);

    console.log(endState.outputs);
});
