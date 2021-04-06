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



// TODO: 
////  1) CLEAN UP THE TRASH
////  2) PRODUCTION XLSX
////  3) 


export default function makeXLSX ( orderData ) {
// export default function makeXLSX ( fileName ) {

    var products = Object.values( JSON.parse(fs.readFileSync('./DB/produtos.json', 'utf8')) );
    // var orderData = JSON.parse(fs.readFileSync( fileName, 'utf8'));

    const makeProductSum = function () {
        var ordered = {};
        for ( var product of products ) {
            ordered[product] = 0;
        };

        for ( var product of products ) {
            for ( var orderJson of orderData["orders"] ) {
                for ( var orderProducts of orderJson["products"] ) {
                    if ( product === orderProducts["product name"] ) {
                        ordered[product] += orderProducts["quantity"] ;
                    };
                };
            };
        };

        var ret = [];
        for ( var thing of Object.keys(ordered) ) {
            if ( ordered[thing] !== 0 ) {
                ret.push( [thing, ordered[thing]] )
            };
        };

        return ret;
    };

    const book = new ExcelJS.Workbook();
    const book2 = new ExcelJS.Workbook();
    const book3 = new ExcelJS.Workbook();
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
        var productSum = makeProductSum();
        var planilha = createWorkSheet('planilha', book);
        var planilha2 = createWorkSheet('planilha', book2);
        var planilha3 = createWorkSheet('planilha', book3);
        for ( let order of orderData['orders'] ) {
            embedOrder( makeArrayed( order ), planilha );        
            // console.log( makeEntregaArray( order ) );
            planilha2.addRow( makeEntregaArray( order ) );
        };
        for ( var thing of productSum ) {
            planilha3.addRow( thing );
        };
    
        // embedOrder( makeArrayed( orderData['orders'][2] ), planilha )
        book.xlsx.writeFile('./teste5 Pedidos.xlsx');
        book2.xlsx.writeFile('./teste5 Entregas.xlsx');
        book3.xlsx.writeFile('./teste5 Produção.xlsx');
    };

    makeFinal();

};

// var orderData = JSON.parse(fs.readFileSync( './DB/pedidos-2021-03-25.xlsx.json', 'utf8'));
// makeXLSX( orderData );

// makeXLSX( './DB/pedidos-2021-03-25.xlsx.json' );