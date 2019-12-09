import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

import { runIntCodeABit, runIntCode } from "./intCode";

const perms = list => {
    if (list.length == 0) return [[]];
    return _.flatMap(list, x => _.map(perms(_.without(list, x)), sp => [x, ...sp]));
};

const makeInitialState = (program, phase) => {
    return {
        runnable: true,
        program: _.clone(program),
        pc: 0,
        inputs: [phase],
        outputs: []
    };
};

const rewire = (amps, j, i) => {
    if (amps[j].outputs.length > 0) {
        amps[i].inputs = amps[j].outputs;
        amps[j].outputs = [];
        amps[i].needsMoreInput = false;
    }
};

const runInFeedbackLoop = (program, phases) => {
    var amps = _.map(phases, phase => makeInitialState(program, phase));

    amps[0].inputs.push(0);

    while (true) {
        amps = _.map(amps, runIntCodeABit);

        if (_.some(amps, amp => amp.runnable)) {
            rewire(amps, 4, 0);
            rewire(amps, 0, 1);
            rewire(amps, 1, 2);
            rewire(amps, 2, 3);
            rewire(amps, 3, 4);
        } else break;
    }

    return amps[4].outputs[0];
};

fs.readFile("seven/seven.input", "utf8", (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    console.log(
        _.maxBy(
            _.map(perms([5, 6, 7, 8, 9]), phases => [phases, runInFeedbackLoop(program, phases)]),
            ([a, b]) => b
        )
    );
});
