import fs from "fs";
import _ from "lodash";

import { digit } from "parjs";
import { many } from "parjs/combinators";

const round = (inp, inpl) => {
    for (var j = inpl - 2; j >= 0; j--) {
        inp[j] = (inp[j] + inp[j + 1]) % 10;
    }
};

//_.map(inp, (x, i) => Math.abs(_.sum(_.drop(inp, i))) % 10);

fs.readFile("sixteen/sixteen.input", "utf8", (err, data) => {
    let input = _.map(many()(digit()).parse(data).value, i => parseInt(i));

    const moffset = parseInt(_.replace(_.join(_.take(input, 7)), /,/g, ""));

    input = _.flatten(_.fill(new Array(10000), input));

    input = _.drop(input, moffset);

    const rounds = 100;

    const inpl = input.length;

    for (var i = 0; i < rounds; i++) {
        round(input, inpl);
    }

    console.log(parseInt(_.replace(_.join(_.take(input, 8)), /,/g, "")));
});
