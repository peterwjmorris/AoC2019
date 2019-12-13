
import _ from 'lodash';

const updateVelocity = ([[x,y,z], [vx,vy,vz]], xs) => {
    const left = _.filter(xs, ([[ax,ay,az], [avx,avy,avz]]) => x < ax).length;
    const right = _.filter(xs, ([[ax,ay,az], [avx,avy,avz]]) => x > ax).length;
    const above = _.filter(xs, ([[ax,ay,az], [avx,avy,avz]]) => y < ay).length;
    const below = _.filter(xs, ([[ax,ay,az], [avx,avy,avz]]) => y > ay).length;
    const front = _.filter(xs, ([[ax,ay,az], [avx,avy,avz]]) => z < az).length;
    const behind = _.filter(xs, ([[ax,ay,az], [avx,avy,avz]]) => z > az).length;

    return [[x,y,z], [vx - (right - left), vy - (below - above), vz - (behind - front)]];
}

const updatePosition = ([[x,y,z], [vx,vy,vz]]) => {
    return [[x + vx, y + vy, z + vz], [vx,vy,vz]];
}

const sumAbs = (xs) => _.sum(_.map(xs, (y) => Math.abs(y)));

const totEnergyMoon = ([xs, vs]) => sumAbs(xs) * sumAbs(vs);

const totEnergy = (ms) => _.sum(_.map(ms,(m) =>totEnergyMoon(m)));


var moons = [
    [[-10,-10,-13],[0,0,0]],
    [[5,5,-9],[0,0,0]],
    [[3,8,-16],[0,0,0]],
    [[1,3,-3],[0,0,0]]
];


//<x=-10, y=-10, z=-13>
//<x=5, y=5, z=-9>
//<x=3, y=8, z=-16>
//<x=1, y=3, z=-3>

const its = 1000;

for (var i = 0; i < its; i++) {
    moons = _.map(moons, moon => updateVelocity(moon, moons));
    moons = _.map(moons, moon => updatePosition(moon));
}

console.log(totEnergy(moons));


