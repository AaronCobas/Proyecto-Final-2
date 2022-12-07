import mongoose from "mongoose";
const connection =  mongoose.connect("mongodb+srv://CoderUser:123@codercluster.qyce1yj.mongodb.net/ProyectoFinal2DB?retryWrites=true&w=majority", err=>{
    if(err) console.log(err);
    else console.log("Connected to Mongo on CartManager.js")
})

const collection = "carts";
const schema = new mongoose.Schema({
    id:{
        type:Number, //En los triggers de Atlas, puse un código que crea un id autoincremental
    },
    timestamp:{
        type: Number,
        required: true
    },
    cartProducts:{
        type:Array,
        required: true
    }
})

const cartsModel = mongoose.model(collection,schema);

export default class MCartManager{

    getCarts = async()=>{
        return cartsModel.find()
    }

    getCartById = async(id) =>{
        return cartsModel.find({id:id})
    }

    exists = async(id)=>{
        let carts = await cartsModel.exists({id:id})
        if(carts === null){
            return false
        } else{
            return true
        }
    }

    addCart = async() =>{
        const cart = await cartsModel.create({timestamp:Date.now(),cartProducts:[]})
        return cart
    }

    checkProduct = async(cid, pid)=>{
        const exists = await cartsModel.find({$and:[{id:cid},{cartProducts:{$elemMatch:{id:pid}}}]}).count()
        if(exists === 0){
            return false
        }else{
            return true
        }
    }

    updateCartwithProduct = async(cid,pid,quantity)=>{
        const prodInCart= await cartsModel.updateOne({id:cid, "cartProducts.id":pid},{$inc:{"cartProducts.$.quantity":quantity}});
        return prodInCart
    }

    addProductToCart = async(cid,pid,quantity)=>{
        const prodInCart = await cartsModel.updateOne({id:cid},{$push:{cartProducts:{id:pid,quantity:quantity}}})
        return prodInCart
    }

    deleteCartById = async(id)=>{
        if(!id){
            return{
                status:"error",
                message:"ID is required"
            }
        }
        const deletedCart = await cartsModel.deleteOne({id:id})
        return deletedCart
    }

    deleteById = async(cid,pid) =>{
            const deletedProduct = await cartsModel.updateOne({id:cid},{$pull:{cartProducts:{id:pid}}})
            return deletedProduct
    }
}

const a = new MCartManager
