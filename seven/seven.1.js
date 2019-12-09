import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

import { runIntCode } from "./intCode";

const perms = list => {
    if (list.length == 0) return [[]];
    return _.flatMap(list, x => _.map(perms(_.without(list, x)), sp => [x, ...sp]));
};

fs.readFile("seven/seven.input", "utf8", (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    console.log(
        _.maxBy(
            _.map(perms([0, 1, 2, 3, 4]), phases => {
                let [output1] = runIntCode(_.clone(program), [phases[0], 0]);
                let [output2] = runIntCode(_.clone(program), [phases[1], output1]);
                let [output3] = runIntCode(_.clone(program), [phases[2], output2]);
                let [output4] = runIntCode(_.clone(program), [phases[3], output3]);
                let [output5] = runIntCode(_.clone(program), [phases[4], output4]);

                return [phases, output5];
            }),
            ([a, b]) => b
        )
    );
});
