import { Router } from "express"
import ProductManager from "../daos/fsManagers/ProductManager.js";
import PERSISTENCIA from "../daos/index.js";
import MProductManager from "../daos/mongoManagers/ProductManager.js";

const router = Router()
const productService = new ProductManager();
const mProductService = new MProductManager();
const admin = true

if (PERSISTENCIA === "MONGODB") {
    router.get("/",async(req,res)=>{
        let products = await mProductService.getProducts();
        res.send({status:"sucess",payload:products})
    })
    router.get("/:pid",async(req,res)=>{
        const {pid} = req.params
        const id = parseInt(pid)
        const existsProduct = await mProductService.exists(id);
    if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
        const product = await mProductService.getProductById(id)
        res.send({status:"success",payload:product})
    })

    router.post("/",async(req,res)=>{
        if (admin) {
            const {title,description,thumbnail,price,stock}= req.body;
        if(!title||!description||!thumbnail||!price||!stock) return res.status(400).send({status:"error",error:"Incomplete values"})
        let timestamp = Date.now();
        let code = Math.random().toString(16).slice(2)
        const productToInsert ={
            timestamp,
            title,
            description,
            code,
            thumbnail,
            price,
            stock
        }
        const result = await mProductService.addProduct(productToInsert);
        res.send({status:"success",payload:result})
        } else {
            res.send({status:"error",error:"Admin only"})
        }
    })
    router.put("/:pid",async(req,res)=>{
        if(admin){
            const {pid} = req.params
            const id = parseInt(pid)
            const existsProduct = await mProductService.exists(id);
            if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
            const {title,description,thumbnail,price,stock}= req.body;
        if(!title||!description||!thumbnail||!price||!stock) return res.status(400).send({status:"error",error:"Incomplete values"})
        let timestamp = Date.now();
        let code = Math.random().toString(16).slice(2)
        const productToPut ={
            timestamp,
            title,
            description,
            code,
            thumbnail,
            price,
            stock
        }
        const result = await mProductService.putProduct(productToPut, id)
        res.send({status:"success",payload:result})
        }else{
            res.send({status:"error",error:"Admin only"})
        }
    })

    router.delete("/:pid",async(req,res)=>{
        if(admin){
            const {pid} = req.params
            const id = parseInt(pid)
            const existsProduct = await mProductService.exists(id);
            if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
            const deletedProduct = mProductService.deleteById(id)
            res.send({status:"succes",payload:deletedProduct,message:"Product deleted successfully"})
        }else{
            res.send({status:"error",error:"Admin only"})
        }
    })
} else if(PERSISTENCIA === "FS") {
    router.get("/",async(req,res)=>{
        let products = await productService.getProducts();
        res.send({status:"sucess",payload:products})
    })
    
    router.get("/:pid",async(req,res)=>{
        const {pid} = req.params
        const id = parseInt(pid)
        const existsProduct = await productService.exists(id);
    if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
        const product = await productService.getProductById(id)
        res.send({status:"success",payload:product})
    })
    
    router.post("/",async(req,res)=>{
        if (admin) {
            const {title,description,thumbnail,price,stock}= req.body;
        if(!title||!description||!thumbnail||!price||!stock) return res.status(400).send({status:"error",error:"Incomplete values"})
        let timestamp = Date.now();
        let code = Math.random().toString(16).slice(2)
        const productToInsert ={
            timestamp,
            title,
            description,
            code,
            thumbnail,
            price,
            stock
        }
        const result = await productService.addProduct(productToInsert);
        res.send({status:"success",payload:result})
        } else {
            res.send({status:"error",error:"Admin only"})
        }
    })
    router.put("/:pid",async(req,res)=>{
        if(admin){
            const {pid} = req.params
            const id = parseInt(pid)
            const existsProduct = await productService.exists(id);
            if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
            const {title,description,thumbnail,price,stock}= req.body;
        if(!title||!description||!thumbnail||!price||!stock) return res.status(400).send({status:"error",error:"Incomplete values"})
        let timestamp = Date.now();
        let code = Math.random().toString(16).slice(2)
        const productToPut ={
            timestamp,
            title,
            description,
            code,
            thumbnail,
            price,
            stock
        }
        const result = await productService.putProduct(productToPut, id)
        res.send({status:"success",payload:result})
        }else{
            res.send({status:"error",error:"Admin only"})
        }
    })
    router.delete("/:pid",async(req,res)=>{
        if(admin){
            const {pid} = req.params
            const id = parseInt(pid)
            const existsProduct = await productService.exists(id);
            if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
            const deletedProduct = productService.deleteById(id)
            res.send({status:"succes",payload:deletedProduct,message:"Product deleted successfully"})
        }else{
            res.send({status:"error",error:"Admin only"})
        }
    })
}else{
    console.log("Error, elija una persistencia válida")
}

export default router