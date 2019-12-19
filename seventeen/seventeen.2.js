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

const moveVacuum = (program) => {
    var instructionsAscii = "A,B,B,A,C,A,C,A,C,B\n" +
        "R,6,R,6,R,8,L,10,L,4\n" +
        "R,6,L,10,R,8\n" +
        "L,4,L,12,R,6,L,10\n" +
        "n\n";

    var instructions = _.map(instructionsAscii, i => i.charCodeAt(0))

    program[0] = 2;

    var state = makeInitialState(program, instructions);

    state = runIntCode(state);

    return state.outputs;
};

fs.readFile("seventeen/seventeen.input", "utf8", (err, data) => {
    let program = _.map(manySepBy(",")(int()).parse(data).value, (n) => parseInt(n));

    var pic = moveVacuum(program);

    console.log(_.map(_.initial(pic), i => String.fromCharCode(i)).join(""));

    console.log(_.last(pic));

});


