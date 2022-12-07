import fs from "fs";
import { pid } from "process";
import __dirname from "../../utils.js";
export default class CartManager {
    constructor() {
        this.path = `${__dirname}/files/carts.json`
        this.init();
    }

    init = async() =>{
        if(!fs.existsSync(this.path)) await fs.promises.writeFile(this.path, JSON.stringify([]));
    }

    readFile = async() =>{
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
    }

    getCarts = async()=>{
        return this.readFile();
    }

    getCartById = async(id) =>{
        const carts = await this.readFile();
        const cart = carts.find(cart =>cart.id === id);
        return cart.cartProducts;
    }

    exists = async(id) =>{
        const carts = await this.readFile();
        return carts.some(cart => cart.id === id);
    }

    addCart = async () =>{
        const carts = await this.readFile();
        const newCart = {
            id : carts.length===0 ? 1 : carts[carts.length - 1].id + 1,
            timestamp: Date.now(),
            cartProducts: [] // Las colecciones siempre se inician vacías
        }
        carts.push(newCart);
        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,"\t"))
        return newCart
    }

    checkProduct = async(cid, pid)=>{
        const carts = await this.readFile();
        const cart = carts.find(cart=> cart.id === cid)
        const exists = cart.cartProducts.some(cProduct=> cProduct.id === pid)
        return exists
    }

    updateCartwithProduct = async(cid,pid,quantity)=>{
        const carts = await this.readFile();
        const cart = carts.find(cart=> cart.id === cid)
        const productInCart = cart.cartProducts.find(cProduct=> cProduct.id === pid)
        const actualQuantity = productInCart.quantity
        const finalQuantity = actualQuantity + quantity
        productInCart.quantity = finalQuantity
        console.log(cart.cartProducts)
        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,"\t"))
        return cart.cartProducts
    }

    addProductToCart = async(cid,pid,quantity) =>{
        const carts = await this.readFile();
        let updatedCart;
        const newCarts = carts.map(cart=>{
            if(cart.id===cid){
                updatedCart = cart;
                const newProduct = {
                    id: pid,
                    quantity:quantity
                }
                cart.cartProducts.push(newProduct);
            }
            return cart;
        })
        await fs.promises.writeFile(this.path,JSON.stringify(newCarts,null,"\t"))
        return updatedCart
    }

    deleteCartById = async (id) =>{
        if(!id) {
        return{
        status:"error",
        message: "ID is required",
        };
        }
        if (fs.existsSync(this.path)) {
            const carts = await this.readFile()
        let newCarts = carts.filter((cart) => cart.id != id)
        await fs.promises.writeFile(
        this.path,
        JSON.stringify(newCarts, null, "\t")
        );
        return{
        status: "success",
        message:"Product deleted successfully",
        }
        } else{
        return{
        status: "error",
        message: "No prodcuts found",
        }
        }
        }

    deleteById = async (cid,pid) =>{
        const carts = await this.readFile();
        const cart = carts.find(cart=> cart.id === cid)
        const productInCart = cart.cartProducts.find(cProduct=> cProduct.id === pid)
        const indexOfProduct= cart.cartProducts.indexOf(productInCart)
        cart.cartProducts.splice(indexOfProduct,1);
        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,"\t"))
        return cart.cartProducts
}
}