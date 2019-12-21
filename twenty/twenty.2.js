import fs from "fs";
import _ from "lodash";

import { newline, noCharOf } from "parjs";
import { manySepBy, many } from "parjs/combinators";


fs.readFile("twenty/twenty.input", "utf8", (err, data) => {
    let maze = manySepBy(newline())(many()(noCharOf("\n"))).parse(data).value;
    _.map(maze, line => console.log(_.join(line, "")));

    var portals = [];

    for (var i = 0; i < maze[0].length - 1; i++) {
        for (var j = 0; j < maze.length - 1; j++) {
            if (/[A-Z]/.test(maze[j][i])) {
                if (/[A-Z]/.test(maze[j + 1][i])) {
                    if (maze[j + 2] && maze[j + 2][i] === ".") {
                        portals.push([maze[j][i] + maze[j + 1][i], [i, j + 2], j == 0 ? -1 : 1]);
                    } else {
                        portals.push([maze[j][i] + maze[j + 1][i], [i, j - 1], j >= maze.length - 3 ? -1 : 1]);
                    }
                } else if (/[A-Z]/.test(maze[j][i + 1])) {
                    if (maze[j][i + 2] === ".") {
                        portals.push([maze[j][i] + maze[j][i + 1], [i + 2, j], i == 0 ? -1 : 1]);
                    } else {
                        portals.push([maze[j][i] + maze[j][i + 1], [i - 1, j], i >= maze[0].length - 3 ? -1 : 1]);
                    }
                }
            }

        }
    }



    const movesFrom = ([x, y], seen) => {
        const news = [];
        if (maze[y][x + 1] == "." && !_.some(seen, z => _.isMatch(z, [x + 1, y]))) news.push([x + 1, y]);
        if (maze[y][x - 1] == "." && !_.some(seen, z => _.isMatch(z, [x - 1, y]))) news.push([x - 1, y]);
        if (maze[y + 1][x] == "." && !_.some(seen, z => _.isMatch(z, [x, y + 1]))) news.push([x, y + 1]);
        if (maze[y - 1][x] == "." && !_.some(seen, z => _.isMatch(z, [x, y - 1]))) news.push([x, y - 1]);

        // var portalEntrance = _.find(portals, port => _.isMatch(port[1], [x, y]));

        // if (portalEntrance) {
        //     var portalExit = _.find(portals, port => port[0] == portalEntrance[0] && !_.isMatch(port[1], [x, y]));
        //     const nl = l + portalEntrance[2];
        //     if (nl >= 0 && !_.some(seen, z => _.isMatch(z, [portalExit[1], nl]))) {
        //         news.push([portalExit[1], nl]);
        //     }
        // }

        return news;
    }

    const pathsFrom = ([name, pos, dir]) => {
        var poses = [pos];
        var seen = [];

        var paths = [];

        var i = 1;

        while (poses.length > 0) {
            const nseen = _.cloneDeep(poses);
            poses = _.flatMap(poses, pose => movesFrom(pose, seen));

            seen = nseen;

            _.each(_.remove(poses, pose => _.some(portals, port => _.isMatch(port[1], pose))), pose => {
                var port = _.find(portals, port => _.isMatch(port[1], pose));
                paths.push([name, dir, port[0], port[0] == "ZZ" ? 0 : port[2], i]);
            });

            i++;
        }

        return paths;
    }

    var paths = _.flatMap(portals, port => pathsFrom(port));

    _.remove(paths, path => path[0] == "ZZ" || path[2] == "AA")

    //console.log(paths);

    var current = [[[["AA",1]], 0, 0]];

var i = 0;

    while (!_.some(current, (x) => _.last(x[0])[0] == "ZZ" && x[1] == 0) && current.length > 0) {
        current = _.flatMap(current, ([poses, l, s]) => {
            var [pos,d] = _.last(poses);
            var lastPosAndD = _.last(_.initial(poses));
            var outs = _.filter(paths, path => path[0] == pos && path[1] != d && (!lastPosAndD || path[2] !== lastPosAndD[0]) && l + path[3] >= 0);
            return _.map(outs, out => [[...poses, [out[2], out[3]]], l + out[3], s + out[4] + 1])
        });
    }

    console.log(_.find(current, x => _.last(x[0])[0] == "ZZ" && x[1] == 0)[2] - 1);
});

