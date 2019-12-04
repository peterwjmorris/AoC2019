import _ from "lodash";

var tot = 0

const testPass = (v) => {
    const strv = v.toString();

    var hasDouble = false;
    var ascending = true;

    var cur = -1;

    for (var i = 0; i < 6; i++) {
        if (cur == strv[i]) hasDouble = true;
        if (strv[i] < cur) ascending = false;

        cur = strv[i];
    }
    
    return (hasDouble && ascending);
}

for (var v = 138307; v <= 654504; v++) 
    if (testPass(v))  
        tot++;

console.log(testPass(111111));
console.log(testPass(223450));
console.log(testPass(123789));

console.log(tot);