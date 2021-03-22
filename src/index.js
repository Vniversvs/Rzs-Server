import getText from "./txtConverter.js";
import express from "express"

const app = express();

app.listen(3000, () => {
    console.log("express")
});

app.get("/test", (req, res) => {
    // console.log(text1);
    res.send(text1);
});

// let fs = require('fs'),
//     PDFParser = require("pdf2json");

let text1 = getText('./DB/teste1.txt');

// console.log(text1);




// const DB = fs.readdirSync("DB");
// let pdfParser = new PDFParser(this, 1);
// pdfParser.loadPDF("./DB/teste1.pdf");

// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// pdfParser.on("pdfParser_dataReady", (pdfData) => {
//     const raw = pdfParser.getRawTextContent();
//     // console.log(raw);
//     fs.writeFile("./DB/teste1.txt", raw, (err) => {
//     // fs.writeFile("./DB/teste1.json", pdfData, (err) => {    
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("success");
//         }
//     });
// });

// pdfParser.loadPDF("./DB/teste1.pdf");

// let pdfParser = new PDFParser();

// const pdfParser = new PDFParser();
// const file = pdfParser.loadPDF(`DB/teste1.pdf`);
// pdfParser.on("pdfParser_dataReady", (pdfData) => {

//     const raw1 = pdfParser.getRawTextContent().replace(/\r\n/g, " ");

//     console.log(raw1);

// });



// console.log(file);

// (async () => {

//     await Promise.all(DB.map(async (file) => {
//         // console.log(this === file);
//         // console.log(this);
//         console.log(file);
//         let pdfParser = new PDFParser(this, 1);

//         // console.log(pdfParser);

//         // pdfParser.loadPDF(`DB/${file}`);
//         pdfParser.loadPDF(`DB/teste1.pdf`);

//         pdfParser.on("pdfParser_dataReady", (pdfData) => {

//             // const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
//             const raw = pdfParser.getRawTextContent();

//             // console.log(raw);
//         });

//         // console.log(pdfParser);

//         // let patient = await new Promise(async(resolve, reject) => {

//         //     pdfParser.on("pdfParser_dataReady", (pdfData) => {

//         //         // const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
//         //         const raw = pdfParser.getRawTextContent();

//         //         console.log(raw);
//         //     });

//         // });

//     }));

// })();
