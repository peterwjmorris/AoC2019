import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

const step = (pc, fn, program) => {
    program[program[pc+3]] = fn(program[program[pc+1]], program[program[pc+2]]);
};

const foo = (pc, program) => {
    switch (program[pc]) {
        case 99:
            return [false, program];
        case 1:
            step(pc, (x,y) => x+y, program);
            return [true, program];
        case 2:
            step(pc, (x,y) => x*y, program);
            return [true, program];
        default:
            throw program[pc];
    }
}

fs.readFile('two.input', 'utf8', (err, data) => {
    const dprogram = manySepBy(",")(int()).parse(data).value;
    
    for (var noun = 0; noun < 100; noun++) {
        for (var verb = 0; verb < 100; verb++) {
            let pc = 0;
            let runnable = true;
            let program = _.cloneDeep(dprogram);

            program[1] = noun;
            program[2] = verb;

            while (runnable) {
                [runnable, program] = foo(pc, program);
                pc += 4;
            }

            if (program[0] == 19690720)
                throw [noun, verb];
        }
    }
});
