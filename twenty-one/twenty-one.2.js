import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

import { runIntCode } from "../intCode";

const makeInitialState = (program, initInput) => {
    return {
        runnable: true,
        program: _.clone(program),
        pc: 0,
        inputs: initInput,
        outputs: [],
        relativeBase: 0
    };
};

const runJump = program => {
    var instructionsAscii = [
        "NOT A J", // A = 1, J = 1
        "NOT B T", // B = 0, T = 0
        "OR T J", // T = 0, J = 1, J = 1
        "NOT C T",
        "OR T J",
        "NOT D T", // D = 1, T = 0
        "NOT T T", // T = 0, T = 1
        "AND T J", // T = 1, J = 1, J = 1
        "NOT H T",
        "NOT T T",
        "OR E T",
        "AND T J",
        "RUN",
        ""
    ];

    var instructions = _.map(_.join(instructionsAscii, "\n"), i => i.charCodeAt(0));

    var state = makeInitialState(program, instructions);

    state = runIntCode(state);

    return state.outputs;
};

fs.readFile("twenty-one/twenty-one.input", "utf8", (err, data) => {
    let program = _.map(manySepBy(",")(int()).parse(data).value, n => parseInt(n));

    var pic = runJump(program);

    console.log(_.map(_.initial(pic), i => String.fromCharCode(i)).join(""));

    console.log(_.last(pic));
});
