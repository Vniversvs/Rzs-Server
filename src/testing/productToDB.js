import mongoose from 'mongoose';
import productSchema from '../DB/Models/produto.js';
import ExcelJS from 'exceljs';

// console.log('banana');
mongoose.connect( 'mongodb://localhost:27017/rzs_server' );
const productModel = productSchema;

export default function productReader(path, fileName) {
    var workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile( path + fileName )
        .then(() => {
            const sheet = workbook.getWorksheet( 'Sheet1' )
            sheet.eachRow( (row, rowNumber) =>  {
                // if ( rowNumber < 40 ) {
                //     console.log( row.getCell( 11 ).value );
                // }
                if ( 6 < rowNumber && rowNumber < 10 ) {
                    console.log( row.getCell( 11 ).value );
                    productModel.create({
                        // const response = await Todo.create({
                            "name": row.getCell( 11 ).value,
                            "precoCompra": row.getCell( 21 ).value,
                            "precoVenda": row.getCell( 22 ).value 
                        });
        
                }

            });
        });
};

productReader('./DB/', 'produtos-2021-04-06-09-39-73ccc35d0b.xlsx')


