import _ from "lodash";

const getValAt = (program, inx, mode, relativeBase) => {
    return program[getPos(program, inx, mode, relativeBase)] || 0;
};

const getPos = (program, inx, mode, relativeBase) => {
    switch (mode) {
        case 0:
            return program[inx];
        case 1:
            return inx;
        case 2:
            return program[inx] + relativeBase;
    }
};


const instructions = {
    "01": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        program[getPos(program, pc + 3, modes[2], relativeBase)] =
            getValAt(program, pc + 1, modes[0], relativeBase) +
            getValAt(program, pc + 2, modes[1], relativeBase);
        return {
            runnable: true,
            program,
            pc: pc + 4,
            relativeBase,
            inputs,
            outputs
        };
    },
    "02": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        program[getPos(program, pc + 3, modes[2], relativeBase)] =
            getValAt(program, pc + 1, modes[0], relativeBase) *
            getValAt(program, pc + 2, modes[1], relativeBase);
        return {
            runnable: true,
            program,
            pc: pc + 4,
            relativeBase,
            inputs,
            outputs
        };
    },
    "03": (modes, { program, pc, inputs, outputs, relativeBase }) => {
        if (inputs.length == 0) {
            return {
                runnable: true,
                program,
                pc,
                needsMoreInput: true,
                inputs,
                outputs,
                relativeBase
            };
        }

        program[getPos(program, pc + 1, modes[0], relativeBase)] = inputs[0];
        return {
            runnable: true,
            program,
            pc: pc + 2,
            inputs: _.tail(inputs),
            outputs,
            relativeBase
        };
    },
    "04": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        outputs.push(getValAt(program, pc + 1, modes[0], relativeBase));
        return {
            runnable: true,
            program,
            pc: pc + 2,
            relativeBase,
            inputs,
            outputs
        };
    },
    "05": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        const pcp = !getValAt(program, pc + 1, modes[0], relativeBase)
            ? pc + 3
            : getValAt(program, pc + 2, modes[1], relativeBase);
        return {
            runnable: true,
            program,
            pc: pcp,
            relativeBase,
            inputs,
            outputs
        };
    },
    "06": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        const pcp = !!getValAt(program, pc + 1, modes[0], relativeBase)
            ? pc + 3
            : getValAt(program, pc + 2, modes[1], relativeBase);
        return {
            runnable: true,
            program,
            pc: pcp,
            relativeBase,
            inputs,
            outputs
        };
    },
    "07": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        program[getPos(program, pc + 3, modes[2], relativeBase)] =
            getValAt(program, pc + 1, modes[0], relativeBase) <
            getValAt(program, pc + 2, modes[1], relativeBase)
                ? 1
                : 0;
        return {
            runnable: true,
            program,
            pc: pc + 4,
            relativeBase,
            inputs,
            outputs
        };
    },
    "08": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        program[getPos(program, pc + 3, modes[2], relativeBase)] =
            getValAt(program, pc + 1, modes[0], relativeBase) ==
            getValAt(program, pc + 2, modes[1], relativeBase)
                ? 1
                : 0;
        return {
            runnable: true,
            program,
            pc: pc + 4,
            relativeBase,
            inputs,
            outputs
        };
    },
    "09": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        relativeBase += getValAt(program, pc + 1, modes[0]);
        return {
            runnable: true,
            relativeBase,
            program,
            pc: pc + 2,
            inputs,
            outputs
        };
    },
    "99": (modes, { program, pc, relativeBase, inputs, outputs }) => {
        return {
            runnable: false,
            program,
            pc,
            relativeBase,
            inputs,
            outputs
        };
    }
};

const step = ({ program, pc, inputs, outputs, relativeBase }) => {
    let instructionAndModes = program[pc].toString();

    instructionAndModes = _.repeat("0", 5 - instructionAndModes.length) + instructionAndModes;

    const instruction = instructions[instructionAndModes[3] + instructionAndModes[4]];

    const modes = [
        parseInt(instructionAndModes[2]),
        parseInt(instructionAndModes[1]),
        parseInt(instructionAndModes[0])
    ];

    return instruction(modes, { program, pc, inputs, outputs, relativeBase });
};

export const runIntCode = (program, inputs) => {
    let state = { program, pc: 0, inputs: inputs, outputs: [], runnable: true, relativeBase: 0 };

    while (state.runnable) {
        state = step(state);
    }

    return state;
};

export const runIntCodeABit = state => {
    while (state.runnable && !state.needsMoreInput) {
        state = step(state);
    }

    return state;
};
