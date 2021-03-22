import fs from "fs";
import { get } from "http";
import path from "path";



export default function treatTxt ( filePath, fileName ) {
    var text = fs.readFileSync( path.join( filePath, fileName ), 
    "utf8", (err) => {
        console.log(err);
    });

    const getLine = function ( arrayOfStrings, string ) {
        const line = arrayOfStrings.find( line => line.includes(string) );
        const lineIndex = arrayOfStrings.indexOf(line);
        return {'line': line, 'index': lineIndex }; 
    };

    const getLastElement = function ( array ) {
        return array[array.length - 1]
    };

    const findStrAfter = function ( substring, string, index ) {
        var newString = string.slice(index);
        return newString.find(substring);
    };

    const getOrders = function ( ordersText ) {
        var ret1 = ordersText.split("Dados");
        var ret2 = [];
        for (let thing of ret1) {
            // var 
            // ret2.push(thing.slice(0, thing.search( "Impressão" )).split("\r\n"));
            ret2.push( thing.slice(0, thing.search( "Total" ) + 16 ).split("\n"));            
        };
        for ( let thing of ret2 ) {
            if ( thing[thing.length - 1] === '' ) {
                thing.pop();
            };
        };
        ret2.shift();

        return ret2;
    };

    const separateOrders = function ( txt ) {
        var ret = [];
        var untreatedOrders = txt.split('Dados'); 

        for ( let untreatedOrder of untreatedOrders ) {
            var treatedOrder1 = firstTreatment( untreatedOrder.split('\n') ); 
            if ( getLastElement( treatedOrder1 ) === '' ) {
                treatedOrder1.pop();
            }
            ret.push(treatedOrder1);
        };
        ret.shift();
        return ret;
    };

    const firstTreatment = function ( orderArray ) {
        for ( let idx = 0; idx < orderArray.length; idx ++ ) {
            if ( orderArray[idx].slice(0, 6) === 'https:' ) {
                orderArray.splice( idx, 1 );
            };
        };
        return orderArray;
    };

    const getTotalInfo = function ( orderArray ) {
        // NOT ALL FREIGHTS ARE FOUND BY 'MOTOBOY'

        var ret = [
            orderArray.find( line => line.includes('Subtotal') ),
            orderArray.find( line => line.includes('Motoboy') )
        ];
        // const line = orderArray.find( line => line.includes('Total') )
        const total = getLine( orderArray, 'Total' )
        // const lineIndex2 = orderArray.indexOf(line); 
        if ( orderArray[total['index']].includes('R$') ) {
            ret.push( total['line'] );
        } else if ( orderArray[total['index'] + 1].includes('R$') ) {
            ret.push( total['line'] + orderArray[total['index'] + 1] )
        };
        if ( ret.length !== 3 ) {
            console.log( orderArray );
        };
        return ret;
    };

    const totalJson = function ( totalArray ) {

    };

    const getClientInfo = function ( orderArray ) {
        //TODO ADD TESTS AND ERRORS
 
        const email = getLine( orderArray, "E-mail" );
        const cep = getLine( orderArray, "CEP" );
        const bairroLine = orderArray[cep['index'] - 1];
        const addressLine = orderArray[cep['index'] - 2];
        var mixedLine = orderArray[cep['index'] - 3]
        var ret = [
            email['line'],
            bairroLine,
            addressLine
        ];
        if ( mixedLine.includes('celular') ) {
            var idx = mixedLine.indexOf('-');
            ret.push( mixedLine.slice(idx - 10, idx + 5), mixedLine.slice(idx + 5) );
        } else {
            ret.push( orderArray[cep['index'] - 4], mixedLine  );
        };
        return ret;
    };

    const treatPhone = function ( line ) {
        if (line.includes('celular')) {
            return line.slice(line.search('celular') + 9)
        } else {
            return line;
        };
    };

    const clientJson = function ( clientInfo ) {
        // const bairro = clientInfo[1];
        // console.log(bairro);
        var ret = {
            'email': clientInfo[0],
            'bairro': clientInfo[1].slice( 0, clientInfo[1].search('-') ),
            'address': clientInfo[2],
            'name': clientInfo[4],
            'phone': treatPhone( clientInfo[3] )
        };
        return ret;
    };

    const separateParts = function ( orderArray ) {
        const produtos = getLine( orderArray, 'Produtos' );
        const subtotal = getLine( orderArray, 'Subtotal' );
        return {
            'client-info': orderArray.slice( 0, produtos['index'] + 1 ),
            'products-info': orderArray.slice( produtos['index'] + 1, subtotal['index'] ),
            'totals-info': orderArray.slice( subtotal['index'] )
        }
    }

    const getProductInfo = function () {

    };

    const productJson = function () {

    };

    const fullTreatment = function () {

    };

    ////////////////////////// TEST SECTION

    const orders = getOrders( text );
    const orders2 = separateOrders( text )
    // console.log(separateOrders( text ));
    // console.log( firstTreatment( text ) );
    // console.log(  getOrders( text ) );
    // console.log( getLastElement( getOrders( text ) ) );
    // console.log( firstTreatment( getLastElement( getOrders( text ) ) ) );
    // console.log( treatTotal ( orders[4] ) );
    // console.log(orders2[1]);

    for ( let order of orders2 ) {
        // var primeLine = getLine( order, 'Produtos' );
        // if ( treatTotal( order ) === undefined ) {
        //     // console.log(treatTotal( order ));
        //     console.log(order);
        // }

        // console.log( primeLine['line'] );
        // console.log(order);

        console.log( separateParts( order )['products-info'] );

        // console.log( getTotalInfo( order )[1] );
        // console.log( order.slice(0, 12) );
        // console.log( getClientInfo( order )[4] );
        // console.log( getClientInfo( order ) );
        // console.log( clientJson( getClientInfo( order ) )['bairro'] );
    };


    // console.log(orders.length);
    // console.log(orders2.length);
}

treatTxt( "./DB", "/maisumteste.txt" );
