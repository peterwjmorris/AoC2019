import fs from "fs";
import _ from "lodash";

import ioHook from "iohook";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

import { runIntCodeABit, makeInitState } from "../intCode";

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

const tile = x => {
    switch (x) {
        case 0:
            return " ";
        case 1:
            return "█";
        case 2:
            return "#";
        case 3:
            return "_";
        case 4:
            return "o";
    }
};

const lines = _.fill(new Array(21), _.repeat(" ", 50));

var px = 0;
var bx = 0;
var s = 0;

const printGameState = outputs => {
    console.clear();
    for (var i = 0; i < outputs.length; i = i + 3) {
        if (outputs[i] == -1 && outputs[i + 1] == 0 && outputs[i + 2] > 0) s = outputs[i + 2];
        else {
            lines[outputs[i + 1]] = lines[outputs[i + 1]].replaceAt(
                outputs[i],
                tile(outputs[i + 2])
            );
            if (outputs[i + 2] == 3) px = outputs[i];
            if (outputs[i + 2] == 4) bx = outputs[i];
        }
    }

    _.map(lines, line => console.log(line));
    console.log(s);
};

const getJoystick = () => {
    if (px < bx) return 1;
    if (px > bx) return -1;
    if (px == bx) return 0;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fs.readFile("thirteen/thirteen.input", "utf8", async (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    program[0] = 2;

    var state = makeInitState(program, []);

    while (true) {
        state = runIntCodeABit(state);

        printGameState(state.outputs);
        await sleep(50);
        state.outputs = [];

        if (state.needsMoreInput) {
            state.inputs = [getJoystick()];
            state.needsMoreInput = false;
        } else break;
    }
});
