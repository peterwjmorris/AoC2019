import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

import { runIntCodeABit, makeInitState } from "../intCode";

fs.readFile("thirteen/thirteen.input", "utf8", (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    var initState = makeInitState(program, []);

    const finalState = runIntCodeABit(initState);

    const blocks = _.filter(finalState.outputs, (x, i) => i % 3 == 2 && x == 2);

    console.log(blocks.length);
});
