import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

const getValAt = (program, inx, mode) => (mode ? inx : program[inx]);

const instructions = {
    "01": (modes, { program, pc, inputs, outputs }) => {
        program[program[pc + 3]] =
            getValAt(program, program[pc + 1], modes[0]) +
            getValAt(program, program[pc + 2], modes[1]);
        return {
            runnable: true,
            program,
            pc: pc + 4,
            inputs,
            outputs
        };
    },
    "02": (modes, { program, pc, inputs, outputs }) => {
        program[program[pc + 3]] =
            getValAt(program, program[pc + 1], modes[0]) *
            getValAt(program, program[pc + 2], modes[1]);
        return {
            runnable: true,
            program,
            pc: pc + 4,
            inputs,
            outputs
        };
    },
    "03": (modes, { program, pc, inputs, outputs }) => {
        program[program[pc + 1]] = inputs[0];
        return {
            runnable: true,
            program,
            pc: pc + 2,
            inputs: _.tail(inputs),
            outputs
        };
    },
    "04": (modes, { program, pc, inputs, outputs }) => {
        outputs.push(getValAt(program, program[pc + 1], modes[0]));
        return {
            runnable: true,
            program,
            pc: pc + 2,
            inputs,
            outputs
        };
    },
    "99": (modes, { program, pc, inputs, outputs }) => {
        return {
            runnable: false,
            program,
            pc,
            inputs,
            outputs
        };
    }
};

const step = ({ program, pc, inputs, outputs }) => {
    let instructionAndModes = program[pc].toString();

    instructionAndModes = _.repeat("0", 5 - instructionAndModes.length) + instructionAndModes;

    const instruction = instructions[instructionAndModes[3] + instructionAndModes[4]];

    const modes = [parseInt(instructionAndModes[2]), parseInt(instructionAndModes[1]), parseInt(instructionAndModes[0])];

    return instruction(modes, { program, pc, inputs, outputs });
};

fs.readFile("five/five.input", "utf8", (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    let state = { program, pc: 0, inputs: [1], outputs: [], runnable: true }

    while (state.runnable) {
        state = step(state);
    }

    console.log(state);
});
