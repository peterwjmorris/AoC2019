import { stringLen, newline } from "parjs";
import { manySepBy, thenq, then } from "parjs/combinators";

import _ from "lodash";

import fs from 'fs';

const parser = manySepBy(newline())(then(stringLen(3))(thenq(")")(stringLen(3))));

fs.readFile('six/six.input', 'utf8', function(err, contents) {
    const orbits = parser.parse(contents).value;

    let routes = [["COM"]];

    let routeEndingInYOU, routeEndingInSAN;

    let done = false;

    let x = 0;

    while (!done) {
        routes = _.flatMap(routes, route => _.map(_.filter(orbits, orbit => orbit[0] == _.last(route)), orbit => {
            const croute = _.cloneDeep(route);
            croute.push(orbit[1]);
            return croute;
        }));

        routeEndingInYOU = routeEndingInYOU || _.find(routes, route => _.last(route) == "YOU");
        routeEndingInSAN = routeEndingInSAN || _.find(routes, route => _.last(route) == "SAN");

        done = routeEndingInSAN && routeEndingInYOU;
    }

    const prefixLen = _.filter(_.zip(routeEndingInYOU, routeEndingInSAN), ([x,y]) => x == y).length;

    console.log(routeEndingInYOU.length + routeEndingInSAN.length - (2 * prefixLen) - 2);
});
