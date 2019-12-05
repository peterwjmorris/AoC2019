import _ from "lodash";

var tot = 0

const testPass = (v) => {
    const strv = v.toString();

    var hasDouble = false;
    var ascending = true;

    for (var i = 0; i < 6; i++) {
        hasDouble = hasDouble || (strv[i-1] == strv[i]);
        ascending = ascending && !(strv[i-1] != null && strv[i] < strv[i-1]);
        if (!ascending) break;
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