import express from "express"
import prodcutsRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"

const app = express()
const PORT = process.env.PORT ||8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/products",prodcutsRouter)
app.use("/api/cart",cartRouter)

const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))