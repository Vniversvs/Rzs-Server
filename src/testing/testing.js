import { json } from 'express';
import fs from 'fs';
import model from '../DB/Models/todo.js'
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
const app = express();
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect( 'mongodb://localhost:27017/rzs_server' );
const Todo = model;

// app.use('/', express.static(path.resolve(__dirname, 'assets')));
app.use(bodyParser.json(  ));

app.get('/ping', async (req, res) => {
    // console.log('banana');
    res.send('pong');
    const record = await Todo.find({ name: 'httt3' });
    console.log(record);
    // const 
    // console.log(record);
    // const response = await Todo.create({
    //     "name": "httt3",
    //     "age": 31  
    // });
    // console.log(response);
}); 

// Todo.create({
// // const response = await Todo.create({
//     "name": "httt",
//     "age": 31  
// });


// app.post('/api/create', async (req, res) => {
//    const record = req.body;
//    console.log(record);
//    res.json({ status: 'ok' }) 
// });

app.listen(13371, () => {
    console.log('server up');
});

// mongoose.connect('mongodb://localhost/noderest' );
// mongoose.Promise = global.Promise;

// module.exports = mongoose;

// const getRowDate = ( row ) => new Date( Date.parse( row.getCell(12).value ) );
// const compareRowDate = ( row, date ) => getRowDate( row ) > date;

// var workbook = new ExcelJS.Workbook(); 
// workbook.xlsx.readFile( './DB/pedidos-2021-03-25.xlsx' )
//     .then( () => {
//         const worksheet = workbook.getWorksheet( 'Sheet1' );
//         // const date = getRowDate( worksheet.getRow(20) );
//         const date = new Date( '2021-03-20T00:00:00' );
//         worksheet.eachRow( { includeEmpty: true }, function (row , rowNumber) {

//             console.log(compareRowDate( row, date ) );
//             console.log(date);
//             console.log( getRowDate( row ) );
//             console.log('--------------');

//             // console.log( getRowDate( row ) );
//         })});




