import fs from 'fs';
import ExcelJS from 'exceljs';




export default function productxlsxReader ( pathtoFile ) {

    const concatenate = function ( array ) {
        var ret = '';
        for ( let element of array ) {
            ret += `${element} `;
        }
        return ret;
    }

    const findProductRow = function ( skuCode ) {

    };

    var workbook = new ExcelJS.Workbook(); 
    workbook.xlsx.readFile( pathtoFile )
        .then(function() {
            const worksheet = workbook.getWorksheet( 'Sheet1' );
            var produtosJSON = {};
            worksheet.eachRow( { includeEmpty: true }, function (row , rowNumber) {
                if ( row.getCell( 11 ).value === null ) {
                    // console.log( row.getCell( 1 ).value );
                    var skuCode = row.getCell( 4 ).value.split('-')[0];
                    var variationCode =  concatenate( row.getCell( 4 ).value.split('-').slice( 1 ) );
                    // console.log( variationCode );
                    worksheet.eachRow( {includeEmpty: true}, (row2, rowNumber2 ) => {
                        if ( row2.getCell( 11 ).value !== null && row2.getCell( 4 ).value === skuCode ) {
                        // if ( row2.getCell( 4 ).value === skuCode ) {
                            // console.log('banana');
                            // MAKE OTHER PRODUTOSJSON
                            // console.log(produtosJSON);
                            console.log( row2.getCell( 11 ).value + ' ' + variationCode );
                            produtosJSON[ row.getCell( 1 ).value ] = row2.getCell( 11 ).value + ' ' + variationCode;                            
                            // console.log( row2.getCell( 11 ).value + ' ' + variationCode );
                            // console.log(row2.getCell( 11 ).value);
                            // console.log( variationCode );
                        };
                    });
                    // console.log( skuCode, variationCode );
                } else {
                    produtosJSON[ row.getCell( 1 ).value ] = row.getCell( 11 ).value;   
                };
                // produtosJSON[ row.getCell( 1 ).value ] = row.getCell( 11 ).value; 
            });
            let data = JSON.stringify( produtosJSON );
            fs.writeFileSync('./DB/produtos.json', data);
        });
    };

productxlsxReader('./DB/produtos-2021-03-17-18-04-1444029e2d.xlsx');

