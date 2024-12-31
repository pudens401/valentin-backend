const {createServer,connectDb} = require("./utils/server")
require("dotenv").config();

const app = createServer()
connectDb()
const PORT = process.env.PORT?process.env.PORT:8000
app.listen(PORT,()=>{
    console.log(`Connected to server on ${PORT}`)
})