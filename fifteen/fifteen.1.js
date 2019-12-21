import fs from "fs";
import _ from "lodash";

import { runIntCodeABit, makeInitState, parseIntCode } from "../intCode";

const typeOf = x => {
    switch (x) {
        case 0:
            return "█";
        case 1:
            return " ";
        case 2:
            return "O";
    }
};

const nextDir = x => {
    switch (x) {
        case "":
            return ["N", 1];
        case "N":
            return ["E", 4];
        case "E":
            return ["S", 2];
        case "S":
            return ["W", 3];
        case "W":
            return ["D", 0];
    }
};

const move = (dir, [x, y]) => {
    switch (dir) {
        case "N":
            return [x, y - 1];
        case "S":
            return [x, y + 1];
        case "W":
            return [x - 1, y];
        case "E":
            return [x + 1, y];
    }
};

fs.readFile("fifteen/fifteen.input", "utf8", async (err, data) => {
    let program = parseIntCode(data);

    var state = makeInitState(program, []);

    var path = [["", [0, 0]]],
        grid = {
            "0,0": "X"
        };

    const lines = _.fill(new Array(50), _.repeat(" ", 50));

    lines[25] = lines[25].replaceAt(25, "X");
    var i = 0;

    while (path.length > 0) {
        const [completed, pos] = _.last(path);
        const [next, nextins] = nextDir(completed);
        path = _.initial(path);

        if (next == "D") {
            if (path.length == 0) break;

            const [back, bpos] = _.last(path);

            var backIns = 0;

            if (bpos[1] < pos[1])
                // north
                backIns = 1;
            else if (bpos[1] > pos[1])
                // south
                backIns = 2;
            else if (bpos[0] < pos[0])
                // west
                backIns = 3;
            else if (bpos[0] > pos[0])
                // east
                backIns = 4;

            state.inputs = [backIns];
            state.needsMoreInput = false;

            state = runIntCodeABit(state);
            state.outputs = [];
            continue;
        }

        path.push([next, pos]);

        const nextPos = move(next, pos);
        if (grid[nextPos] == null) {
            state.inputs = [nextins];
            state.needsMoreInput = false;
            state = runIntCodeABit(state);

            const [result] = state.outputs;

            state.outputs = [];

            var typeOfResult = typeOf(result);
            grid[nextPos] = typeOfResult;
            lines[nextPos[1] + 25] = lines[nextPos[1] + 25].replaceAt(
                nextPos[0] + 25,
                typeOfResult
            );

            if (typeOfResult == "O") console.log(_.join(_.map(path, p => _.last(p[0]))));
            if (typeOfResult != "█") path.push(["", nextPos]);
        }
    }

    _.map(lines, line => console.log(line));
});
