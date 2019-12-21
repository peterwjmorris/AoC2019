
import _ from 'lodash';

const updateVelocity = (x, vx, xs) => {
    const left = _.filter(xs, (ax) => x < ax).length;
    const right = _.filter(xs, (ax) => x > ax).length;

    return vx - (right - left);
}

const updatePosition = (x, vx) => {
    return x + vx;
}

var xs = [-10,5,3,1];
var ys = [-10,5,8,3];
var zs = [-13,-9,-16,-3];

const periodity = (xs, vs) => {
    const prev = [[xs,vs].toString()];

    while (true) {
        vs = _.map(xs, (x,i) => updateVelocity(x, vs[i], xs));
        xs = _.map(xs, (x, i) => updatePosition(x, vs[i]));

        const nxsvs = [xs, vs].toString();
        if (_.includes(prev, nxsvs)) return prev.length - prev.indexOf(nxsvs);
        prev.push(nxsvs);
    }
}

console.log(periodity(xs , [0,0,0,0]));
console.log(periodity(ys , [0,0,0,0]));
console.log(periodity(zs , [0,0,0,0]));


