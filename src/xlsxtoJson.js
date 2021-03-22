import fs from 'fs';
import ExcelJS from 'exceljs';

export default function xlsxReader ( pathtoFile ) {

    const treatJson = function ( jsonString ) {
        var items = jsonString.split( ',' );
        for ( let item of items ) {
            item = item
            .replace('{', '')
            .replace('}', '')
        };
    };

    const makeJson = function ( ordersJson, row, treatedOrders ) {
        ordersJson["orders"].push({
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
                "total": row.getCell(10).value
            }
        });
    return ordersJson;  
    };

    var workbook = new ExcelJS.Workbook(); 
    workbook.xlsx.readFile( pathtoFile )
        .then( () => {
            var productJson = JSON.parse(fs.readFileSync('./DB/produtos.json', 'utf8'));
            const worksheet = workbook.getWorksheet( 'Sheet1' );
            var ordersJson = { "orders": [] };
            worksheet.eachRow( { includeEmpty: true }, function (row , rowNumber) {
                var order = row.getCell(46).value.split('}');
                var treatedOrders = [];
                for ( let product of order ) {
                    var treatedProduct = product.concat('}').slice(1);
                    if ( treatedProduct.includes( 'linha' ) ) {
                        var treatedProduct2 = JSON.parse( treatedProduct );  
                        if ( productJson[treatedProduct2["produto_id"]] === null ) {
                            console.log( treatedProduct2["produto_id"] );
                        };

                        treatedOrders.push({
                            "quantity": treatedProduct2["quantidade"],
                            "product name": productJson[treatedProduct2["produto_id"]],
                            "cost": treatedProduct2["preco_venda"],
                            "product total": treatedProduct2["preco_venda"] * treatedProduct2["quantidade"] 
                        });
                    }
                };

                ordersJson["orders"].push({
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
                    }
                );
                let data = JSON.stringify(ordersJson);
                fs.writeFileSync('./DB/22-03-2021.json', data);
            });

        });
        // return data;
    };

xlsxReader('./DB/pedidos-2021-03-22-07-00-fe9f055900.xlsx');
