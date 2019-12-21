import fs from "fs";
import _ from "lodash";

import { newline, noCharOf } from "parjs";
import { manySepBy, many } from "parjs/combinators";


fs.readFile("twenty/twenty.input", "utf8", (err, data) => {
    let maze = manySepBy(newline())(many()(noCharOf("\n"))).parse(data).value;
    _.map(maze, line => console.log(_.join(line, "")));

    var portals = [];

    console.log(maze[0].length);
    console.log(maze.length);

    for (var i = 0; i < maze[0].length - 1; i++) {
        for (var j = 0; j < maze.length - 1; j++) {
            if (/[A-Z]/.test(maze[j][i])) {
                if (/[A-Z]/.test(maze[j + 1][i])) {
                    if (maze[j + 2] && maze[j + 2][i] === ".") {
                        portals.push([maze[j][i] + maze[j + 1][i], [i, j + 2]]);
                    } else {
                        portals.push([maze[j][i] + maze[j + 1][i], [i, j - 1]]);
                    }
                } else if (/[A-Z]/.test(maze[j][i + 1])) {
                    if (maze[j][i + 2] === ".") {
                        portals.push([maze[j][i] + maze[j][i + 1], [i + 2, j]]);
                    } else {
                        portals.push([maze[j][i] + maze[j][i + 1], [i - 1, j]]);
                    }
                }
            }

        }
    }

    console.log(portals);

    const [[aa, start]] = _.remove(portals, p => p[0] === 'AA');
    const [[zz, end]] = _.remove(portals, p => p[0] === 'ZZ');

    var steps = 0;

    var current = [start];

    var seen = [start];

    const movesFrom = ([x, y], seen) => {
        const news = [];
        if (maze[y][x + 1] == "." && !_.some(seen, z => _.isMatch(z, [x + 1, y]))) news.push([x + 1, y]);
        if (maze[y][x - 1] == "." && !_.some(seen, z => _.isMatch(z, [x - 1, y]))) news.push([x - 1, y]);
        if (maze[y + 1][x] == "." && !_.some(seen, z => _.isMatch(z, [x, y + 1]))) news.push([x, y + 1]);
        if (maze[y - 1][x] == "." && !_.some(seen, z => _.isMatch(z, [x, y - 1]))) news.push([x, y - 1]);

        var portalEntrance = _.find(portals, port => _.isMatch(port[1], [x, y]));

        if (portalEntrance) {
            var portalExit = _.find(portals, port => port[0] == portalEntrance[0] && !_.isMatch(port[1], [x, y]));
            if (!_.some(seen, z => _.isMatch(z, portalExit[1])))
                news.push(portalExit[1]);
        }

        return news;
    }

    console.log(start);
    console.log(end);

    console.log(portals);

    while (!_.some(current, x => _.isMatch(x, end)) && current.length > 0) {
        current = _.flatMap(current, pos => movesFrom(pos, seen));

        seen = _.concat(seen, current);

        steps++;
    }

    console.log(current);

    console.log(steps);

});

