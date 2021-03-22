import fs from "fs";
import path from "path";



export default function makeJson ( filePath, fileName ) {
    var text = fs.readFileSync( path.join( filePath, fileName ), 
    "utf8", (err) => {
        console.log(err);
    });

    // fs.writeFile("./DB/exemploPedido.txt", extractSlice( 3000 ), (err) => {
    //         if (err) {
    //             console.log(err);
    //         };
    //     });


    const getOrders = function ( ordersText ) {
        var ret1 = ordersText.split("Dados");
        var ret2 = [];
        for (let thing of ret1) {
            // ret2.push(thing.slice(0, thing.search( "Impressão" )).split("\r\n"));
            ret2.push(thing.slice(0, thing.search( "Total" ) + 16 ).split("\n"));            
        };
        for ( let thing of ret2 ) {
            if ( thing[thing.length - 1] === '' ) {
                thing.pop();
            };
        };
        ret2.shift();
        return ret2;
    };

    // const countR$ = function ( string ) {
    //     if ( string.includes('R$') === false ) {
    //         return 0
    //     } else if (  ) {

    //     }

    // }

    const treatOrder = function ( splittedOrder ) {
        var treated = splittedOrder
        for ( let idx = 0; idx < 12; idx ++ ) {
            treated.shift();
        };
        // for ( let idx = 0; idx < 1; idx ++ ) {
        //     treated.pop();
        // };

        

        return treated;
    } 

    const separateTreated = function ( treatedOrder ) {
        var ret1 = treatedOrder.filter(string => string.includes('R$'));
        var ret2 = treatedOrder.filter(string => string.includes('R$') === false);


        return [ret1, ret2];
    };

    const getProductIndices = function ( splittedOrder ) {
        var ret = [];
        for ( let idx = 0; idx < splittedOrder.length; idx ++ ) {
            if ( splittedOrder[idx].includes("Disponibilidade") ) {
                ret.push(idx);
            };
        };
        // ret.shift();
        return ret;
    };

    const treatProductName = function ( megaString ) {
        // var productName = '';
        // for ( let string of strings ){
        //     productName += string + ' '
        // };
        return  megaString
        .replace('Código Nome', "")
        .replace('unitário', "")
        .replace('Valor total', "")
        .replace('Valor', "")
        .replace('Qtd.', "")
        .replace('Produtos', "")
        .replace('úteis', "")
        .replace('pedido - Cesta Camponesa', "")
        .replace('https://app.lojaintegrada.com.br/painel/pedido/imprimi...', "")
        .replace('Código ', "");


        // '21, 19:59Impressão pedido - Cesta Camponesa 18 of 34 PGWHRWK7T Vinho de Mesa Branco Seco 750ml https://app.lojaintegrada.com.br/painel/pedido/imprimi...

        
    };

    const makeProductsName = function ( productsArray ) {
        // console.log(productsArray);
        // console.log( productsArray[3].includes('Dispon') );
        
        var megaString = '';

        for ( let element of productsArray ) {
            megaString += element + ' ';
        }

        var ret = megaString.split("Disponibilidade:");

        // const indices = getProductIndices( productsArray );
        // var ret = [];
        // var toAppend = [];
        // for ( let element of productsArray ) {
        //     if ( element.includes("Dispon") === false ) {
        //         // console.log(element);
        //         // console.log('banana');
        //         ret.push(toAppend);
        //         var toAppend = [];
        //     } else {
        //         // console.log('apple');
        //         toAppend.push(element);
        //         // console.log(toAppend);
        //     };
        // };
        return ret;
    }

    const matchProducts = function ( separatedOrder ) {
        var productNames = makeProductsName(separatedOrder[1]);
        var treatedNames = [];
        for (let product of productNames) {
            treatedNames.push(treatProductName( product ))
        };
        if ( treatedNames.length > 1 ) {
            treatedNames.pop();
        };

        // var productsCost = separatedOrder[0];
        var productsCost = separatedOrder[0].map( product => product.split(' ') );
        // var productsCost = [
        //     productsCost1[1],
        //     productsCost1[2],
        //     productsCost1[4]
        // ];
        // console.log(productsCost);
        // var ret = [];
        // var productsCost = productsCost.split(' ');
        // console.log(productsCost);
        // for ( let idx = 0; idx < productsCost.length; idx ++) {
        //     ret.push( productNames[idx], productsCost[idx].split(' ') );
        // }
        var ret = [];

        for ( let idx = 0; idx < productsCost.length; idx ++) {
            var productObject = {}
            console.log(separatedOrder);
            productObject['product name'] = treatedNames[idx].slice(9);
            productObject['cost'] = productsCost[idx][1];
            productObject['quantity'] = productsCost[idx][2];
            productObject['product total'] = productsCost[idx][4];
            ret.push(productObject);
        }


        return ret;
    }

    const searchAfter = function ( text, character, subString ) {
        var text1 = text.slice( character );
        // console.log(text1);
        // console.log( text1.search(subString) ); 
        return text1.search(subString) + character;
    };

    const getAllIndices = function (text, subString) {
        var ret = [];


        // while (text.length > 0) {
        //     var idx = text.search(subString);
        //     if (idx > -1) {
        //         ret.push(idx);
        //         text = text.substring( idx );
        //         console.log(text.length);
        //     } else {
        //         text = "";
        //     };
        // };
        // getAllIndices( text, subString, collection );
        return ret;
    };

    // var a = "soyuz nerushimy respublik svobodnikh";
    // console.log( searchAfter ( a, 10, " " ) );
    // console.log(a.search(" "));
    // console.log(getAllIndices( a, " " ));

    // console.log(a.slice( 3, 10 ));
    // console.log(a);

    const extractSlice = function ( initialCharacter ) {
        var firstText = text.slice ( initialCharacter );
        var secondText = firstText.slice ( firstText.search("Dados") );
        return secondText.slice(0, secondText.search("Impressão"));
    };

    const extractClientInfo = function ( splittedOrder ) {
        var ret = {
            "name": splittedOrder[2],
            "email": splittedOrder[4].slice( 8 ),
            "phone": splittedOrder[5].slice( 18 ),
            "address": splittedOrder[7],
            "bairro": splittedOrder[8].replace("- Rio De Janeiro / RJ", " ")
        };
        return ret;
    };

    const extractTotalsInfo = function ( splittedOrder ) {
        var ret = {
            "subtotal": 'R$' + splittedOrder[splittedOrder.length - 3].split('R$')[1],
            "frete": 'R$' + splittedOrder[splittedOrder.length - 2].split('R$')[1],
            "TOTAL" : 'R$' + splittedOrder[splittedOrder.length - 1].split('R$')[1]
        };
        splittedOrder.pop();
        splittedOrder.pop();
        splittedOrder.pop();

        return ret;
    };

    const getR$ = function ( splittedOrder ) {
        var ret = [];
        for (let idx = 0; idx < splittedOrder.length; idx ++) {
            if ( splittedOrder[idx].includes('R$') ) {
                ret.push(idx);
            };
        };
        return ret;
    };

    const getPrices = function ( splittedOrder ) {
        var ret = [];
        for (let idx = 0; idx < splittedOrder.length; idx ++) {
            if ( splittedOrder[idx].includes('R$') ) {
                // if (  ) {

                // };
                var toPush =  splittedOrder[idx].split(' ');
                ret.push(toPush);
            };
        };
        // for ( let idx2 = 0; idx2 < ret; idx2 ++ )  {
        //     if ( ret[idx2] === 'R$' ) {
        //         ret.splice(idx2, 1);
        //     };
        // }

        // for ( let idx = 0; idx < ret.length; idx ++ ) {
        //     if ( ret[idx].length < 5 ) {
        //         console.log( splittedOrder );
        //         // console.log(ret[idx] + ret[idx + 1] );
        //     };
            // ret[idx].trim();
            // if ( ret[idx][0] === '' ) {
            //     ret[idx].shift();
            // };
            // const newRet = ret[idx].filter( array => array.length < 3 )
            // ret[idx].filter(3);

            // if ( ret[idx].length === 1 ) {
            //     ret[idx] = ret[idx] + ret[idx + 1]
            // };
        // };

        // for ( let thing of ret ) {
        //     if ( thing[0] === '' ) {
        //         thing.shift();
        //     };
        //     if ( thing.length === 1 ) {
        //         thing 
        //     };
        // };


        ////////////////////// RELEVANT INFO ARE IN INDICES 1, 2, 4;
        return ret;
        // return ret.filter( element => element !== 'R$');
    };

    const treatNameLine = function ( line ) {
        line = line.slice(9);
        var size = (line.length - 11)/3;
        return line.slice(0, size - 2);
    };

    const treatPriceLine = function ( str ) {
        // var primeIdx = str.search(",");

        var spl = str.split(",")
        // console.log(spl);
        var index = spl[1].search("R");
        // console.log(index);
        return [spl[0] + ',' + spl[1][0]+spl[1][1],
        spl[1].slice(2, index ),
        spl[1].slice(index) + ',' + spl[2][0] + spl[2][1]
        ];
        // console.log(str);
        // var temp = searchAfter(str, 10, "R$");
        // console.log(temp);
        // console.log(str.slice( primeIdx, temp ));

        // return [str.slice(0, primeIdx + 3)]
    };



    const extractProductInfo = function ( splittedOrder ) {
        var productIndices = getProductIndices( splittedOrder );
        // console.log( productIndices );

        var ret = [];
 
        if (productIndices[0] === 13) {
            var treatedTotals = treatPriceLine(splittedOrder[14]);
            ret.push(
                // {"product name": splittedOrder[productIndices[0] - 1].slice(9),
                {"product name": splittedOrder[12].slice(9),
                // {"product name":  treatNameLine ( splittedOrder[productIndices[idx] - 1] ),
                "cost": treatedTotals[0],
                "quantity":  treatedTotals[1],
                "product total": treatedTotals[2],
                });

        } else if (productIndices[0] === 14) {
            var treatedTotals = treatPriceLine(splittedOrder[15]);
            ret.push(
                
                {"product name":  splittedOrder[12].slice(9) + splittedOrder[13],
                "cost": treatedTotals[0],
                "quantity":  treatedTotals[1],
                "product total": treatedTotals[2],
                });

        } else { 
            console.log( splittedOrder[productIndices[0]] );
        };

        for ( let idx = 1; idx < productIndices.length; idx ++ ) {
            // console.log(idx);
            var treatedTotals = treatPriceLine(splittedOrder[productIndices[idx] + 1]) 

            if ( productIndices[idx] === productIndices[idx - 1] + 3 ) {
                // console.log(splittedOrder[productIndices[idx]+1]);
                // var treatedTotals = splittedOrder[productIndices[idx] + 1];
                // TODO: EXTRACT NAME CORRECTLY
                // TODO: EXTRACT PRODUCT CORRECTLY
                // console.log('banana');
                ret.push(
                    {"product name": splittedOrder[productIndices[idx] - 1].slice(9),
                    // {"product name":  treatNameLine ( splittedOrder[productIndices[idx] - 1] ),
                    "cost": treatedTotals[0],
                    "quantity":  treatedTotals[1],
                    "product total": treatedTotals[2],
                    });
            } else if ( productIndices[idx] === productIndices[idx - 1] + 4 ) {
                // TODO: EXTRACT NAME CORRECTLY
                // TODO: EXTRACT PRODUCT CORRECTLY
                // console.log('apple');
                ret.push(
                    {"product name":  splittedOrder[productIndices[idx] - 2].slice(9) + splittedOrder[productIndices[idx] - 1],
                    "cost": treatedTotals[0],
                    "quantity":  treatedTotals[1],
                    "product total": treatedTotals[2],
                    });
                // console.log( splittedOrder[14] );
                // console.log( splittedOrder[productIndices[idx]] );
                // console.log( splittedOrder[productIndices[idx] + 1] );
                // console.log( splittedOrder[productIndices[idx + 2]] );
            };
        };



        // for ( var idx = 0; idx < splittedOrder.length; idx ++ ) {
        //     if ( splittedOrder[idx].includes("Disponibilidade") ) {
        //         var treatedTotals = treatPriceLine(splittedOrder[idx + 1]) 
        //         // TODO: EXTRACT NAME CORRECTLY
        //         // TODO: EXTRACT PRODUCT CORRECTLY
        //         ret.push(
        //             {"product name":  treatNameLine ( splittedOrder[idx - 1] ),
        //             "cost": treatedTotals[0],
        //             "quantity":  treatedTotals[1],
        //             "product total": treatedTotals[2],
        //             });
        //     };
        // };


        return ret;
    };

    // const treatProductName = function () {

    // };

    const testfun = function () {
        var a = "aasssaaa"
        return a.includes("sss");
    }

    const extractOrderInfo = function ( splittedOrder ) {
        var ret = {"client": extractClientInfo( splittedOrder ), 
        // "products" : extractProductInfo( splittedOrder ),
        "totals": extractTotalsInfo( splittedOrder ),
        "products": matchProducts( separateTreated( treatOrder(splittedOrder ) ) )
        // separado = separateTreated( treatOrder( order ) )
        };

        if ( extractTotalsInfo( splittedOrder )['subtotal'] === 'R$undefined') {
            console.log(splittedOrder);
        };


        return ret;
    };

    const makeFinalJson = function ( splittedOrders ) {
        var jFile = { 'orders': [] };
        for ( let order of splittedOrders ) {
            jFile['orders'].push( extractOrderInfo ( order ) );
        };
        let data = JSON.stringify(jFile);
        fs.writeFileSync('./DB/17-03-21.json', data);
        // return jFile;


    }

    const orders = getOrders ( text );
    makeFinalJson(orders);
    // console.log( orders[1] );
    // console.log(orders[1]);
    // extractTotalsInfo(orders[3]);
    // var separado = separateTreated( treatOrder( orders[3] ) );
    // console.log(separado);
    // console.log( matchProducts(separado) );

    // console.log( makeProductsName( separado[1] ) );
    // for ( let thing of makeProductsName( separado[1] ) ) {
    //     console.log( treatProductName( thing ) );
    // }
    // console.log(treatProductName([separado[1][0], separado[1][1], separado[1][2], separado[1][3]]));

    // for ( let order of orders ) {
    //     const client = extractClientInfo(order);
    //     extractTotalsInfo(order);
    //     var separado = separateTreated( treatOrder( order ) );
    //     console.log( [client['name'], matchProducts(separado)] );
    //     // var separacoes = getProductIndices( separado[1] );



    //     // console.log(separacoes);
    //     // console.log( separado[3] );


        
    //     // var precos1 = getR$( order );
    //     // var precos2 = getPrices( order );
        
    //     // console.log( order[precos[0]] );
    //     // console.log( precos2 );
    //     // console.log( precos2.filter( preco => preco.length > 2 ) );
    //     // console.log( treatOrder( order ) );



    //     // for ( let preco of precos2 ) {
    //     //     console.log(preco.split('R$'));
    //     //     console.log(preco.split('R$').length);
    //     // };

        
    // };



}



makeJson( "./DB", "/17-03-21.txt" );
