const express = require("express")
const app = express()
app.use(express.json())
const port = 3000
const uuid = require("uuid")

const pedidos = []


// Middleware da url e method
const pesquisar = (request, response, next) =>{
    
    const {url, method} = request
    const requisicao = {url, method}
    console.log(requisicao)

    next()
}
// Middleware para verificar se o ID existe
const checkId = (request, response, next) =>{
    const {id} = request.params
    const index = pedidos.findIndex (pedido => pedido.id === id)
    
    if (index <0){
        return response.status(404).json({error: "Order not found"})
    }
    request.pedidoIndex = index
    request.pedidoId = id
    
    next()
}
// Rota dos pedidos
app.get('/order', pesquisar, (request, response) =>{
    
    return response.json(pedidos)
   
})
// Rota para criar pedidos
app.post('/order', pesquisar, (request, response) => {
    const {orders, clientName, price} = request.body
    const status = "em preparação"
   
    const pedido = {id:uuid.v4(), orders, clientName, price, status}

    pedidos.push(pedido)
    return response.status(201).json(pedido)
})
// Rota para atualizar pedidos
app.put('/order/:id', checkId, pesquisar, (request, response) =>{
    
    const {orders, clientName, price} = request.body
    const index = request.pedidoIndex
    const id = request.pedidoId

    const update = {id, orders, clientName, price}
    
    pedidos[index] = update
    console.log(update)
    return response.json(update)
})
// Rota para deletar pedidos
app.delete('/order/:id', checkId, pesquisar, (request, response) =>{
   
    const index = request.pedidoIndex
    
    pedidos.splice(index,1)

    return response.status(201).json({message: "Deleted Order"})
})
// Rota para buscar pedido especifico
app.get('/order/:id', checkId, pesquisar, (request, response) =>{
    
    const index = request.pedidoIndex
    const search = pedidos[index]
  
   return response.status(201).json(search)
}) 
// Rota para atualizar como pronto pedido especifico
app.patch('/order/:id', checkId, pesquisar, (request, response) =>{
    
    const index = request.pedidoIndex
    const status = "pronto"
    const pedido = {...pedidos[index], status}

   return response.status(201).json(pedido)
}) 
// Port
app.listen(port, () =>{
    console.log(`🤙 Server started on port ${port}`)
})
