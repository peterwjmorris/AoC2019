import fs from "fs";
import _ from "lodash";

import { int } from "parjs";
import { manySepBy, between } from "parjs/combinators";

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
        outputs: [],
        relativeBase: 0
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

const runRobot = (program, initialColour) => {
    var robotState = {
        direction: "U",
        position: [0,0],
        painted: {},
        colourUnderRobot: initialColour
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

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

fs.readFile("eleven/eleven.input", "utf8", (err, data) => {
    let program = manySepBy(",")(int()).parse(data).value;

    var painted = runRobot(program, 1).painted;
    var justPainted = _.map(_.filter(_.map(painted, (x,i) => [x,i]), ([x,i]) => x == 1), ([x,i]) => manySepBy(",")(int()).parse(i).value);

    var l1 = _.repeat(" ", 40);
    _.map(_.filter(justPainted, ([w,y]) => y == 0), ([x,v]) => { l1 = l1.replaceAt(x, "█"); });
    var l2 = _.repeat(" ", 40);
    _.map(_.filter(justPainted, ([w,y]) => y == -1), ([x,v]) => { l2 = l2.replaceAt(x, "█"); });
    var l3 = _.repeat(" ", 40);
    _.map(_.filter(justPainted, ([w,y]) => y == -2), ([x,v]) => { l3 = l3.replaceAt(x, "█"); });
    var l4 = _.repeat(" ", 40);
    _.map(_.filter(justPainted, ([w,y]) => y == -3), ([x,v]) => { l4 = l4.replaceAt(x, "█"); });
    var l5 = _.repeat(" ", 40);
    _.map(_.filter(justPainted, ([w,y]) => y == -4), ([x,v]) => { l5 = l5.replaceAt(x, "█"); });
    var l6 = _.repeat(" ", 40);
    _.map(_.filter(justPainted, ([w,y]) => y == -5), ([x,v]) => { l6 = l6.replaceAt(x, "█"); });

    console.log(l1);
    console.log(l2);
    console.log(l3);
    console.log(l4);
    console.log(l5);
    console.log(l6);
});
