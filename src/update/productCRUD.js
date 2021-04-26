import mongoose from 'mongoose';
import productSchema from '../DB/Models/produto.js'
mongoose.connect( 'mongodb://localhost:27017/rzs_server' );
const productModel = productSchema;

const produto = await productModel.find({ liId:76968609 } )
console.log( produto );

mongoose.connection.close();
