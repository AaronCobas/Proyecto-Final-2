import { Router } from "express"
import CartManager from "../daos/fsManagers/CartManager.js";
import ProductManager from "../daos/fsManagers/ProductManager.js";
import MProductManager from "../daos/mongoManagers/ProductManager.js";
import PERSISTENCIA from "../daos/index.js";
import MCartManager from "../daos/mongoManagers/CartManager.js";

const router = Router()
const productService = new ProductManager();
const mProductService = new MProductManager();
const cartService = new CartManager();
const mCartService = new MCartManager();

if(PERSISTENCIA === "MONGODB"){
    router.get("/",async(req,res)=>{
        const newCart = await mCartService.addCart();
        res.send({status:"success",payload:newCart}) //Por algún motivo, la id de las carts (que fueron creadas con Triggers de Atlas) no aparecen apenas se crean,
        //recomiendo usar el .get de abajo ("/carts") para ver los id de todas las carts
    })
    
    router.get("/carts", async(req,res)=>{
        const carts = await mCartService.getCarts();
        res.send({status:"success",payload:carts})
    })
    router.delete("/:cid",async(req,res)=>{
        const {cid} = req.params
        const id = parseInt(cid)
        const existsCart = await mCartService.exists(id);
        if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
        const deletedCart = mCartService.deleteCartById(id)
        res.send({status:"success",payload:deletedCart,message:"Cart deleted successfully"})
    })
    
    router.get("/:cid/products",async(req,res)=>{
        const {cid} = req.params
        const id = parseInt(cid)
        const existsCart = await mCartService.exists(id);
        if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
        const cart = await mCartService.getCartById(id)
        res.send({status:"success",payload:cart})
    })
    
    router.post("/:cid/products",async(req,res)=>{
        const {cid} = req.params
        const {id,quantity}= req.body;
        if(!id||!quantity) return res.status(400).send({status:"error",error:"Incomplete values"})
        const cartId = parseInt(cid)
        const productId = parseInt(id)
        const quantityProducts = parseInt(quantity)
        const existsCart = await mCartService.exists(cartId);
        const existsProduct = await mProductService.exists(productId);
        if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
        if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
        const productCheck = await mCartService.checkProduct(cartId, productId)
        if(productCheck){
            const result = await mCartService.updateCartwithProduct(cartId,productId,quantityProducts)
            res.send({status:"success",payload:result,message:"Product added successfully"})
        }else{
            const result = await mCartService.addProductToCart(cartId,productId,quantityProducts);
            res.send({status:"success",payload:result,message:"Product added successfully"})
        }
    })
    
    router.delete("/:cid/products/:pid",async(req,res)=>{
        const {cid,pid} = req.params
        const cartId = parseInt(cid)
        const productId = parseInt(pid)
        const existsCart = await mCartService.exists(cartId);
        const existsProduct = await mProductService.exists(productId);
        if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
        if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
        const exists = await mCartService.checkProduct(cartId,productId)
        const result = await mCartService.deleteById(cartId,productId)
        if(exists === true){
            res.send({status:"sucess",payload:result,message:"Product deleted successfully"})
        }else{
            res.send({status:"error",message:"Product not Found in Cart"})
        }
    })
}else if(PERSISTENCIA === "FS"){
    router.get("/",async(req,res)=>{
        const newCart = await cartService.addCart();
        const cartId = newCart.id
        res.send({status:"success",payload:newCart, cartId:cartId})
    })
    
    router.delete("/:cid",async(req,res)=>{
        const {cid} = req.params
        const id = parseInt(cid)
        const existsCart = await cartService.exists(id);
        if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
        const deletedCart = cartService.deleteCartById(id)
        res.send({status:"success",payload:deletedCart,message:"Cart deleted successfully"})
    })
    
    router.get("/:cid/products",async(req,res)=>{
        const {cid} = req.params
        const id = parseInt(cid)
        const existsCart = await cartService.exists(id);
        if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
        const cart = await cartService.getCartById(id)
        res.send({status:"success",payload:cart})
    })
    
    router.post("/:cid/products",async(req,res)=>{
        const {cid} = req.params
        const {id,quantity}= req.body;
        if(!id||!quantity) return res.status(400).send({status:"error",error:"Incomplete values"})
        const cartId = parseInt(cid)
        const productId = parseInt(id)
        const quantityProducts = parseInt(quantity)
        const existsCart = await cartService.exists(cartId);
        const existsProduct = await productService.exists(productId);
        if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
        if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
        const productCheck = await cartService.checkProduct(cartId, productId)
        if(productCheck){
            const result = await cartService.updateCartwithProduct(cartId,productId,quantityProducts)
            res.send({status:"success",payload:result})
        }else{
            const result = await cartService.addProductToCart(cartId,productId,quantityProducts);
            res.send({status:"success",payload:result})
        }
    })
    
    router.delete("/:cid/products/:pid",async(req,res)=>{
        const {cid,pid} = req.params
        const cartId = parseInt(cid)
        const productId = parseInt(pid)
        const existsCart = await cartService.exists(cartId);
        const existsProduct = await productService.exists(productId);
        if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
        if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
        const result = await cartService.deleteById(cartId,productId)
        res.send({status:"sucess",payload:result})
    })
}

export default router