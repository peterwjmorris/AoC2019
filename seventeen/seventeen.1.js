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

const getPicture = (program) => {
    var state = makeInitialState(program, []);


    state = runIntCode(state);

    return _.map(state.outputs, i => String.fromCharCode(i)).join("");
};

fs.readFile("seventeen/seventeen.input", "utf8", (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    var pic = getPicture(program);

    var width = pic.indexOf('\n');
    var height = (pic.length - 1) / (width + 1);

    console.log(pic)
    console.log(width + 'x' + height);

    const inx = (i, j) => i + (width + 1) * j

    var align = 0

    for (var j = 1; j < height - 1; j++) {
        for (var i = 1; i < width - 1; i++) {
            if (pic[inx(i, j)] == "#" && pic[inx(i - 1, j)] == "#" && pic[inx(i + 1, j)] == "#" && pic[inx(i, j - 1)] == "#" && pic[inx(i, j + 1)] == "#")
                align += i * j;
        }
    }

    console.log(align);

});
