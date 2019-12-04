import fs from "fs";
import _ from "lodash";

import { int, stringLen, newline } from "parjs";
import { manySepBy, then } from "parjs/combinators";

const addTo = (x, ab, tot) => x || tot;

const move = (state, dir, dist, ab) => {
    for (var x = 0; x < dist; x++) {
        state.tot++;
        switch (dir) {
            case "U":
                state.posy++;
                break;
            case "D":
                state.posy--;
                break;
            case "R":
                state.posx++;
                break;
            case "L":
                state.posx--;
                break;
        }

        if (ab == "A") state.box[([state.posx, state.posy])] = addTo(state.box[([state.posx, state.posy])], ab, state.tot);

        if (ab == "B" && state.box[([state.posx, state.posy])] > 0) state.intersections.push([Math.abs(state.posx) + Math.abs(state.posy), state.box[([state.posx, state.posy])] + state.tot]);
    }
}

fs.readFile('three/input', 'utf8', (err, data) => {
    const wireParser = manySepBy(",")(then(int())(stringLen(1)));
    var wires = manySepBy(newline())(wireParser).parse(data).value;


    const box = {};
    box[([0,0])] = "O";

    const state = {
        box: box,
        posx: 0,
        posy: 0,
        tot: 0
    }

    _.forEach(wires[0], ([dir, dist]) => move(state, dir, dist, "A"));

    const state2 = { 
        box: state.box,
        posx: 0,
        posy: 0,
        intersections: [],
        tot: 0
    }

    _.forEach(wires[1], ([dir, dist]) => move(state2, dir, dist, "B"));

    console.log(state2.intersections);
    console.log(_.minBy(state2.intersections, x => x[1]));

});
