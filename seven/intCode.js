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
        if (inputs.length == 0) {
            return {
                runnable: true,
                program,
                pc, 
                inputs, 
                outputs,
                needsMoreInput: true
            }
        }

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
    "05": (modes, { program, pc, inputs, outputs }) => {
        const pcp = !getValAt(program, program[pc + 1], modes[0]) ? (pc + 3) : getValAt(program, program[pc + 2], modes[1]);
        return {
            runnable: true,
            program,
            pc: pcp,
            inputs,
            outputs
        };
    },
    "06": (modes, { program, pc, inputs, outputs }) => {
        const pcp = !!getValAt(program, program[pc + 1], modes[0]) ? (pc + 3) : getValAt(program, program[pc + 2], modes[1]);
        return {
            runnable: true,
            program,
            pc: pcp,
            inputs,
            outputs
        };
    },
    "07": (modes, { program, pc, inputs, outputs }) => {
        program[program[pc + 3]] = getValAt(program, program[pc + 1], modes[0]) < getValAt(program, program[pc + 2], modes[1]) ? 1 : 0;
        return {
            runnable: true,
            program,
            pc: pc + 4,
            inputs,
            outputs
        };
    },
    "08": (modes, { program, pc, inputs, outputs }) => {
        program[program[pc + 3]] = getValAt(program, program[pc + 1], modes[0]) == getValAt(program, program[pc + 2], modes[1]) ? 1 : 0;
        return {
            runnable: true,
            program,
            pc: pc + 4,
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

export const runIntCode = (program, inputs) => { 
    let state = { program, pc: 0, inputs: inputs, outputs: [], runnable: true }

    while (state.runnable) {
        state = step(state);
    }

    return state.outputs;
};

export const runIntCodeABit = (state) => { 
    while (state.runnable && !state.needsMoreInput) {
        state = step(state);
    }

    return state;
};
