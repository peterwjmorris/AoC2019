import fs from "fs";
import _ from "lodash";

import { stringLen } from "parjs";
import { many } from "parjs/combinators";


fs.readFile("eight/eight.input", "utf8", (err, data) => {
    const image = many()(stringLen(25 * 6)).parse(data).value;
    const biggestLayer = _.minBy(image, layer => _.filter(layer, pixel => pixel == 0));

    console.log(_.filter(biggestLayer, pixel => pixel == 1).length * _.filter(biggestLayer, pixel => pixel == 2).length)
});