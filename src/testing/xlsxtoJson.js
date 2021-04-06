import fs from 'fs';
import ExcelJS from 'exceljs';
import makeXLSX from "./xlsxMaker.js";

// TODO: 
////  1) MAKE IT FULLY ASYNC
////  2) INTEGRATE INTO INDEX.JS WORKFLOW (probably by returning json at the end)
////  3) refactor and optimize

export default function xlsxReader ( path, fileName, initialRow ) {

    const getRowDate = ( row ) => new Date( Date.parse( row.getCell(12).value ) );
    const compareRowDate = ( row, date ) => getRowDate( row ) > date;
    
    var orders = { "orders": [] };
    const addOrder = function ( orderJson, row, treatedOrders ) {
        orderJson[ "orders" ].push({
            "client": {
            "email": row.getCell(2).value,
            "name": row.getCell(13).value,
            "phone": row.getCell(22).value,
            "address": `${row.getCell(23).value}, ${row.getCell(24).value}, ${row.getCell(25).value}`,
            "bairro": row.getCell(27).value
            },
            "products": treatedOrders,
            "totals": {
                "subtotal": row.getCell(7).value,
                "frete": row.getCell(8).value,
                "TOTAL": row.getCell(10).value
            }
        });
    };

    const treatProducts = function ( row, productJson ) {
        var order = row.getCell(46).value.split('}');
        var treatedOrders = [];
        
        for ( let product of order ) {
            var treatedProduct = product.concat('}').slice(1);
            if ( treatedProduct.includes( 'linha' ) ) {
                var treatedProduct2 = JSON.parse( treatedProduct );  
                // if ( productJson[treatedProduct2["produto_id"]] === null ) {
                //     console.log( treatedProduct2["produto_id"] );
                // };

                treatedOrders.push({
                    "quantity": treatedProduct2["quantidade"],
                    "product name": productJson[treatedProduct2["produto_id"]],
                    "cost": treatedProduct2["preco_venda"],
                    "product total": treatedProduct2["preco_venda"] * treatedProduct2["quantidade"] 
                });
            }
        };

        return treatedOrders;
    };

    const treatProducts2 = function ( row, productJson ) {
        var orderProducts = JSON.parse(`{ "orders": ${row.getCell(46).value} }`)["orders"];
        var newOrderProducts = [];
        for ( var product of orderProducts ) {
            newOrderProducts.push({
                "quantity": product["quantidade"],
                "product name": productJson[product["produto_id"]],
                "cost": product["preco_venda"],
                "product total" : product["preco_cheio"] * product["quantidade"],
            });
        }
        return newOrderProducts;
    };

    // const makeProductionJson = function () {
    //     var 
    // }

    var workbook = new ExcelJS.Workbook(); 
    workbook.xlsx.readFile( path + fileName )
        .then( () => {
            var productJson = JSON.parse(fs.readFileSync('./DB/produtos.json', 'utf8'));
            const worksheet = workbook.getWorksheet( 'Sheet1' );
            worksheet.eachRow( { includeEmpty: true }, function (row , rowNumber) {
                if ( rowNumber >= initialRow ) {
                    var treatedProducts2 = treatProducts2( row, productJson );
                    addOrder( orders, row, treatedProducts2 );
                };
            });
            let data = JSON.stringify(orders);
            fs.writeFileSync( `./DB/${fileName}.json`, data);
            makeXLSX( orders );
        });
    };

xlsxReader( './DB/', 'pedidos-2021-03-25.xlsx', 80 );



// TRASH


// const makeJson = function ( ordersJson, row, treatedOrders ) {
//     ordersJson["orders"].push({
//         "client": {
//             "email": row.getCell(2).value,
//             "name": row.getCell(13).value,
//             "phone": row.getCell(22).value,
//             "address": `${row.getCell(23).value}, ${row.getCell(24).value}, ${row.getCell(25).value}`,
//             "bairro": row.getCell(27).value
//         },
//         "products": treatedOrders,
//         "totals": {
//             "subtotal": row.getCell(7).value,
//             "frete": row.getCell(8).value,
//             "total": row.getCell(10).value
//         }
//     });
// return ordersJson;  
// };

                // ordersJson["orders"].push({
                //         "client": {
                //             "email": row.getCell(2).value,
                //             "name": row.getCell(13).value,
                //             "phone": row.getCell(22).value,
                //             "address": `${row.getCell(23).value}, ${row.getCell(24).value}, ${row.getCell(25).value}`,
                //             "bairro": row.getCell(27).value
                //         },
                //         "products": treatedOrders,
                //         "totals": {
                //             "subtotal": row.getCell(7).value,
                //             "frete": row.getCell(8).value,
                //             "TOTAL": row.getCell(10).value
                //         }
                //     }
                // );


                // var order = row.getCell(46).value.split('}');
                // // console.log( rowNumber );
                // var treatedOrders = [];
                // for ( let product of order ) {
                //     var treatedProduct = product.concat('}').slice(1);
                //     if ( treatedProduct.includes( 'linha' ) ) {
                //         var treatedProduct2 = JSON.parse( treatedProduct );  
                //         if ( productJson[treatedProduct2["produto_id"]] === null ) {
                //             // console.log( treatedProduct2["produto_id"] );
                //         };

                //         treatedOrders.push({
                //             "quantity": treatedProduct2["quantidade"],
                //             "product name": productJson[treatedProduct2["produto_id"]],
                //             "cost": treatedProduct2["preco_venda"],
                //             "product total": treatedProduct2["preco_venda"] * treatedProduct2["quantidade"] 
                //         });
                //     }
                // };
