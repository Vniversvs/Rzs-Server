import fs from 'fs';
import ExcelJS from 'exceljs';

// console.log(orderData['orders'][2]);

// const ExcelJS = require('exceljs');

// console.log(typeof orders);

// planilha1.addRow([1,2,3,4]);
// planilha1.
// const testRow = planilha1.addRow({id: 1, name: 'John Doe', dob: "date"});
// const testRow2 = planilha1.addRow([1,2,3]);
// const testRow = planilha1.getRow(1)

// console.log(planilha1.eachRow());
// console.log(testRow.values);
// console.log(testRow2.values);


export default function makeXLSX ( fileName ) {

    var orderData = JSON.parse(fs.readFileSync( fileName, 'utf8'));
    // console.log(orderData['orders'][2]);
    const book = new ExcelJS.Workbook();
    const book2 = new ExcelJS.Workbook();
    const createWorkSheet = function ( workSheetName, workBook ) {
        
        const workSheet = workBook.addWorksheet(workSheetName);
        // planilha1.columns = [
        //     { header: 'Id', key: 'id', width: 10 },
        //     { header: 'Name', key: 'name', width: 32 },
        //     { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
        //   ];
        // creates xlsx with columns
        return workSheet;
    }

    const makeArrayfromJson = function ( jsonObject ) {
        // transform JSON into array of arrays for workSheet.
        var ret = [];
        for ( let thing in jsonObject ) {
            ret.push(jsonObject[thing]);
        };
        return ret
    };

    const makeClientArray = function ( clientJson ) {
        return [
            clientJson['address'],
            clientJson['name'],
            clientJson['bairro'].replace('-', ''),
            clientJson['phone']
        ];
    };

    const makeProductArray = function ( productsArray ) {
        var ret = [];
        for ( let idx = 0; idx < productsArray.length; idx ++ ) {
            //qtd, nome, preço, total
            ret.push(
                [
                    productsArray[idx]['quantity'],
                    productsArray[idx]['product name'],
                    productsArray[idx]['cost'],
                    productsArray[idx]['product total']
                ]
            );
        };
        return ret;
    };

    const makeTotalsArray = function ( totalsJson ) {
        return [
            [
                'subtotal',
                totalsJson['subtotal'],
                'frete',
                totalsJson['frete'],
            ],
            [
                '',
                '',
                'TOTAL',
                totalsJson['TOTAL']
            ]

        ];
    };

    const makeArrayed = function ( orderJson ) {
        var arrayedJson = [makeClientArray(orderJson['client'])];
        for ( let product of makeProductArray(orderJson['products']) ) {
            arrayedJson.push(product);
        }
        arrayedJson.push(
                    makeTotalsArray(orderJson['totals'])[0],
                    makeTotalsArray(orderJson['totals'])[1] 
                    );
        return arrayedJson;
    };

    const makeEntregaArray = function ( orderJson ) {
        return [orderJson['client']['address'],
        orderJson['client']['name'],
        orderJson['client']['bairro'],
        orderJson['client']['phone'],
        orderJson['totals']['TOTAL']
        ];
    };

    const embedOrder = function ( arrayedJson, workSheet ) {
        // place arrayedJson in workSheet
        for ( let idx = 0; idx < arrayedJson.length; idx ++ ) {
            // console.log(arrayedJson[idx]);
            workSheet.addRow( arrayedJson[idx] );
        }
        workSheet.addRow( ['', '', '', ''] );
        workSheet.addRow( ['', '', '', ''] );
    };

    const makeFinal = function () {
        // makes the full xlsx file.
        var planilha = createWorkSheet('planilha', book);
        var planilha2 = createWorkSheet('planilha', book2);
        for ( let order of orderData['orders'] ) {
            embedOrder( makeArrayed( order ), planilha );        
            // console.log( makeEntregaArray( order ) );
            planilha2.addRow( makeEntregaArray( order ) );
        };
        
        // embedOrder( makeArrayed( orderData['orders'][2] ), planilha )
        book.xlsx.writeFile('./22-03-2021 Pedidos.xlsx');
        book2.xlsx.writeFile('./22-03-2021 Entregas.xlsx');
    };


    makeFinal();

////////////////// tests



    // const row = planilha.getRow(2);
    // console.log(row.values);

    // console.log(createWorkSheet('planilha1'));
    // console.log( makeArrayfromJson( orderData['orders'][2]['client'] ) )
    // console.log( makeClientArray( orderData['orders'][2]['client'] ) );
    // console.log( makeProductArrays( orderData['orders'][2]['products'] ) );
    // console.log( makeTotalsArrays( orderData['orders'][2]['totals'] ) );
    // console.log( embedOrder( orderData['orders'][2] ) );


};



makeXLSX( './DB/22-03-2021.json' );