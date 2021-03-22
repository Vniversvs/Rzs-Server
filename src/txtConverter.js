import * as fs from "fs";
// import path from "path";

export default function getText ( pathtoDir ) {
    return fs.readFileSync( pathtoDir, "utf8", (err) => {
        console.log(err);
    } );
}

// const text = getText('./DB/teste1.txt')

// console.log(text);

// export default getText();
