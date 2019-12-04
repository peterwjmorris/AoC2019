import _ from "lodash";

var tot = 0

const testPass = (v) => {
    const strv = v.toString();

    var hasDouble = false;
    var ascending = true;

    var cur = -1;

    for (var i = 0; i < 6; i++) {
        if (cur == strv[i]
            && cur != strv[i-2]
            && cur != strv[i+1]) hasDouble = true;
        if (strv[i] < cur) ascending = false;

        cur = strv[i];
    }
    
    return (hasDouble && ascending);
}

for (var v = 138307; v <= 654504; v++) 
    if (testPass(v))  
        tot++;

console.log(testPass(112233));
console.log(testPass(123444));
console.log(testPass(111122));

console.log(tot);