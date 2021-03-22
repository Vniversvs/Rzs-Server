import fs from "fs";
import PDFParser from "pdf2json";


const DB = fs.readdirSync("DB");
let pdfParser = new PDFParser(this, 1);
pdfParser.loadPDF("./DB/teste1.pdf");

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", (pdfData) => {
    const raw = pdfParser.getRawTextContent();
    console.log(raw);
    fs.writeFile("./DB/teste3.txt", raw, (err) => {
    // fs.writeFile("./DB/teste1.json", pdfData, (err) => {    
        if (err) {
            console.log(err);
        };
    });
});

pdfParser.loadPDF("./DB/teste1.pdf");



