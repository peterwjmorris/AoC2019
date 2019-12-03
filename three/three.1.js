import fs from "fs";
import _ from "lodash";

import { int, stringLen, newline } from "parjs";
import { manySepBy, then } from "parjs/combinators";

fs.readFile('three/input', 'utf8', (err, data) => {
    const wireParser = manySepBy(",")(then(int())(stringLen(1)));
    const wires = manySepBy(newline())(wireParser).parse(data).value;
    console.log(wires);
});
