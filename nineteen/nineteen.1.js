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

const deployDrone = (program, x, y) => {
    var state = makeInitialState(program, [x, y]);

    state = runIntCode(state);

    return state.outputs[0];
};

fs.readFile("nineteen/nineteen.input", "utf8", (err, data) => {
    let program = _.map(manySepBy(",")(int()).parse(data).value, i => parseInt(i));

    var tot = 0;

    var lasti = 0;

    var x = 0;
    var y = 0;

    for (var j = 101; j < 10000; j++) {
        if (x > 0 && y > 0) break;
        for (var i = lasti; i < 10000; i++) {
            if (deployDrone(program, i, j)) {
                lasti = i;
                if (i < 101)
                    break;
                if (deployDrone(program, i + 99, j - 99)) {
                    x = i;
                    y = j - 99;

                }
                break;
            }
        }
    }

    console.log(x*10000 +y);
});
