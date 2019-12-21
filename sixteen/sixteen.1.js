import fs from "fs";
import _ from "lodash";

import { digit } from "parjs";
import { many } from "parjs/combinators";

const patternFor = fo => {
    var reps = fo + 1;

    return _.flatMap([0, 1, 0, -1], x => _.fill(new Array(reps), x));
};

const multByPattern = (inp, pat) => {
    var patlen = pat.length;
    return _.map(inp, (x, i) => x * pat[(1 + i) % patlen]);
};

const round = inp => {
    const sums = _.map(inp, (x, i) => {
        const pat = patternFor(i);
        const muls = multByPattern(inp, pat);
        return _.sum(muls);
    });

    return _.map(sums, m => parseInt(_.last(m.toString())));
};

fs.readFile("sixteen/sixteen.input", "utf8", (err, data) => {
    let input = many()(digit()).parse(data).value;

    const rounds = 100;

    for (var i = 0; i < rounds; i++) {
        input = round(input);
    }

    console.log(parseInt(_.replace(_.join(_.take(input, 8)), /,/g, "")));
});
