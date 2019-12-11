import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy } from "parjs/combinators";

import { runIntCodeABit } from "../intCode";

const perms = list => {
    if (list.length == 0) return [[]];
    return _.flatMap(list, x => _.map(perms(_.without(list, x)), sp => [x, ...sp]));
};

const makeInitialState = (program, initInput) => {
    return {
        runnable: true,
        program: _.clone(program),
        pc: 0,
        inputs: [initInput],
        outputs: []
    };
};

const paintAndMove = ([colour,turnTo], robotState) => {
    robotState.painted[robotState.position] = colour;
    robotState.direction = turn(robotState.direction, turnTo);
    robotState.position = move1(robotState.position, robotState.direction);
    robotState.colourUnderRobot = robotState.painted[robotState.position] || 0;

    return robotState;
}

const turn = (from, to) => {
    switch (from) {
        case "U": return to == 0 ? "L" : "R";
        case "L": return to == 0 ? "D" : "U";
        case "D": return to == 0 ? "R" : "L";
        case "R": return to == 0 ? "U" : "D";
    }
}

const move1 = ([x,y], dir) => {
    switch (dir) {
        case "U": return [x,y+1];
        case "L": return [x-1,y];
        case "D": return [x,y-1];
        case "R": return [x+1,y];
    }
}

const runRobot = (program) => {
    var robotState = {
        direction: "U",
        position: [0,0],
        painted: {},
        colourUnderRobot: 0
    }

    var robotCode = makeInitialState(program, robotState.colourUnderRobot);

    while (robotCode.runnable) {
        robotCode = runIntCodeABit(robotCode);

        robotState = paintAndMove(robotCode.outputs, robotState);

        robotCode.outputs = [];
        robotCode.inputs = [robotState.colourUnderRobot];
        robotCode.needsMoreInput = false;
    }

    return robotState;
};

fs.readFile("eleven/eleven.input", "utf8", (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    console.log(_.keys(runRobot(program, 0).painted).length);
});
