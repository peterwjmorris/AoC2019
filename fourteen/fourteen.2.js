import fs from "fs";
import _ from "lodash";

import { upper, int, whitespace, newline } from "parjs";
import { many, manySepBy, then, thenq, stringify } from "parjs/combinators";

const resourceParser = stringify()(many()(upper()));
const amountParser = int();
const resourceAndAmountParser = then(resourceParser)(thenq(whitespace())(amountParser));
const inputsParser = manySepBy(", ")(resourceAndAmountParser);

const lineParser = then(resourceAndAmountParser)(thenq(" => ")(inputsParser));
const fileParser = manySepBy(newline())(lineParser);

fs.readFile("fourteen/fourteen.input", "utf8", async (err, data) => {
    var transformations = fileParser.parse(data).value;

    var x = 3568000;

    while (true) {
        var resources = [[x, "FUEL"]];

        var ore = 0;

        var extras = [];

        while (_.some(resources)) {
            const allInputs = _.flatMap(resources, ([rn, rr]) => {
                let [inputs, [n, rt]] = _.find(transformations, t => t[1][1] == rr);
                const mult = Math.ceil(rn / n);
                const extra = mult * n - rn;
                var outp = _.map(inputs, ([ni, nt]) => [ni * mult, nt]);
                if (extra) extras.push([extra, rr]);
                return outp;
            });

            resources = glom(allInputs);

            resources = _.map(resources, ([ni, tn]) => {
                var [extra] = _.remove(extras, ([en, et]) => et == tn);
                if (extra) return [ni - extra[0], tn];
                else return [ni, tn];
            });

            resources = _.filter(resources, ([n, x]) => n);

            var newore = _.remove(resources, r => r[1] == "ORE");

            if (newore.length > 0) ore += newore[0][0];
        }

        if (ore > 1000000000000) break;
        x += 1;
        console.log([x, ore]);
    }
    console.log(x);
});

const glom = list =>
    _.map(
        _.groupBy(list, r => r[1]),
        (vs, k) => [_.sumBy(vs, v => v[0]), k]
    );
