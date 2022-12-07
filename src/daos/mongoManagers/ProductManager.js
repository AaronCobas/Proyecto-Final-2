import mongoose, { startSession } from "mongoose";
const connection =  mongoose.connect("mongodb+srv://CoderUser:123@codercluster.qyce1yj.mongodb.net/ProyectoFinal2DB?retryWrites=true&w=majority", err=>{
    if(err) console.log(err);
    else console.log("Connected to Mongo on ProductManager.js")
})

const collection = "products";
const schema = new mongoose.Schema({
    timestamp:{
        type: Number,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    id:{
        type:Number, //En los triggers de Atlas, puse un código que crea un id autoincremental
    }
})

const usersModel = mongoose.model(collection,schema);
export default class MProductManager{

    getProducts = async() =>{
        const products = await usersModel.find()
        return products
    }
    getProductById = async(id)=>{
        const product = await usersModel.find({id:id})
        return product
    }
    exists = async(id)=>{
        let products = await usersModel.exists({id:id})
        if(products === null){
            return false
        } else{
            return true
        }
    }
    addProduct = async(product) =>{
        const newProduct = await usersModel.create(product)
        return newProduct
    }
    deleteById = async(id) =>{
        const deletedProduct = await usersModel.deleteOne({id:id})
        return deletedProduct
    }
    putProduct = async(product,id)=>{
        const updatedProduct = await usersModel.updateOne({id:id},{$set:{timestamp:product.timestamp, title:product.title, description:product.description, code:product.code, thumbnail:product.thumbnail, price:product.price, stock:product.stock}})
        return updatedProduct
    }
}
