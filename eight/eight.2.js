import fs from "fs";
import _ from "lodash";

import { stringLen } from "parjs";
import { many, exactly } from "parjs/combinators";

const replaceChar = (string, i, char) => {
    return string.slice(0, i).concat(char, string.slice(i + 1));
};

const processLayer = (layer, image) => {
    _.forEach(layer, (row, i) =>
        _.forEach(row, (pixel, j) => {
            if (pixel != 2 && image[i][j] == 2) {
                image[i] = replaceChar(image[i], j, pixel);
            }
        })
    );
};

fs.readFile("eight/eight.input", "utf8", (err, data) => {
    const image = many()(exactly(6)(stringLen(25))).parse(data).value;

    var finalImage = [
        "2222222222222222222222222",
        "2222222222222222222222222",
        "2222222222222222222222222",
        "2222222222222222222222222",
        "2222222222222222222222222",
        "2222222222222222222222222"
    ];

    _.forEach(image, layer => processLayer(layer, finalImage));

    console.log(finalImage[0].replace(/1/g, "█").replace(/0/g, " "));
    console.log(finalImage[1].replace(/1/g, "█").replace(/0/g, " "));
    console.log(finalImage[2].replace(/1/g, "█").replace(/0/g, " "));
    console.log(finalImage[3].replace(/1/g, "█").replace(/0/g, " "));
    console.log(finalImage[4].replace(/1/g, "█").replace(/0/g, " "));
    console.log(finalImage[5].replace(/1/g, "█").replace(/0/g, " "));
});
