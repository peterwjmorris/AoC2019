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
    var ndir = "";
    switch (x) {
        case "":
            ndir = "N";
            break;
        case "N":
            ndir = "E";
            break;
        case "E":
            ndir = "S";
            break;
        case "S":
            ndir = "W";
            break;
        case "W":
            ndir = "D";
            break;
    }
    return [ndir, toIns(ndir)];
};

const toIns = x => {
    switch (x) {
        case "N":
            return 1;
        case "E":
            return 4;
        case "S":
            return 2;
        case "W":
            return 3;
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

    var state = makeInitState(
        program,
        _.map(
            [
                "S",
                "S",
                "E",
                "E",
                "N",
                "N",
                "E",
                "E",
                "E",
                "E",
                "N",
                "N",
                "E",
                "E",
                "E",
                "E",
                "E",
                "E",
                "S",
                "S",
                "W",
                "W",
                "S",
                "S",
                "W",
                "W",
                "S",
                "S",
                "W",
                "W",
                "N",
                "N",
                "W",
                "W",
                "S",
                "S",
                "S",
                "S",
                "W",
                "W",
                "N",
                "N",
                "W",
                "W",
                "S",
                "S",
                "S",
                "S",
                "E",
                "E",
                "S",
                "S",
                "W",
                "W",
                "W",
                "W",
                "W",
                "W",
                "N",
                "N",
                "W",
                "W",
                "S",
                "S",
                "W",
                "W",
                "W",
                "W",
                "S",
                "S",
                "S",
                "S",
                "W",
                "W",
                "W",
                "W",
                "W",
                "W",
                "N",
                "N",
                "W",
                "W",
                "N",
                "N",
                "E",
                "E",
                "E",
                "E",
                "S",
                "S",
                "E",
                "E",
                "N",
                "N",
                "N",
                "N",
                "W",
                "W",
                "W",
                "W",
                "W",
                "W",
                "W",
                "W",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "E",
                "E",
                "E",
                "E",
                "S",
                "S",
                "W",
                "W",
                "S",
                "S",
                "E",
                "E",
                "E",
                "E",
                "N",
                "N",
                "E",
                "E",
                "S",
                "S",
                "E",
                "E",
                "S",
                "S",
                "E",
                "E",
                "N",
                "N",
                "E",
                "E",
                "N",
                "N",
                "N",
                "N",
                "W",
                "W",
                "N",
                "N",
                "E",
                "E",
                "N",
                "N",
                "E",
                "E",
                "S",
                "S",
                "S",
                "S",
                "E",
                "E",
                "N",
                "N",
                "N",
                "N",
                "E",
                "E",
                "E",
                "E",
                "E",
                "E",
                "N",
                "N",
                "N",
                "N",
                "W",
                "W",
                "S",
                "S",
                "W",
                "W",
                "W",
                "W",
                "W",
                "W",
                "W",
                "W",
                "N",
                "N",
                "W",
                "W",
                "W",
                "W",
                "S",
                "S",
                "S",
                "S",
                "W",
                "W",
                "S",
                "S",
                "E",
                "E",
                "S",
                "S",
                "W",
                "W",
                "W",
                "W",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "W",
                "W",
                "S",
                "S",
                "W",
                "W",
                "S",
                "S",
                "W",
                "W",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "N",
                "E",
                "E",
                "N",
                "N",
                "E",
                "E",
                "N",
                "N",
                "W",
                "W",
                "W",
                "W",
                "S",
                "S"
            ],
            toIns
        )
    );

    state = runIntCodeABit(state);
    state.outputs = [];

    var path = [["", [0, 0]]],
        grid = {
            "0,0": "X"
        };

    var maxPLen = 0;

    while (path.length > 0) {
        if (path.length > maxPLen) maxPLen = path.length;
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

            if (typeOfResult != "█") path.push(["", nextPos]);
        }
    }
    console.log(maxPLen);
});
