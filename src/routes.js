const axios = require('axios')
const express = require('express')

const routes = express.Router()

routes.get('/', (request, response) => {
    response.status(200).json({ok:true})
})

routes.post('/array/count', async (request, response) => {
    try{
        const  arrayBodyRequest = await request.body
        
        if (!Array.isArray(arrayBodyRequest)) {
            return response.status(400).json({ error: 'No corpo da requisição deve conter um array JSON.' })        
        }

        const numberOfElements = arrayBodyRequest.length

        return response.status(200).json({"Número total de elementos do array":numberOfElements});

    } catch (error) {
        console.error('Falha ao processar sua solicitação:', error.message);
        response.status(500).json({ error: 'Falha ao processar sua solicitação.' })
    }

    }
);

routes.post('/array/order', async (request, response) => {
    function isArrayValid(array){
        const camposNecessarios = ["id", "cesto", "pais", "quantidade", "condicao_pagamento"]

        if (!Array.isArray(array) || !array.length > 0) {
            return false        
        }     
    
        return array.every(elemento =>
            camposNecessarios.every(campo => campo in elemento)
        );
    } 

    try{
        const  arrayBodyRequest = await request.body
        
        if(!isArrayValid(arrayBodyRequest)){
            return response.status(400).json({ error: 'No corpo da requisição deve conter um array JSON com todos os elementos necessarios para o processamento' })  
        }

        const elementWithPrevision = arrayBodyRequest.map((element) => {
            element.previsao_consumo = element.quantidade * 5;
            return element;
          });

        const orderArray = elementWithPrevision.sort((elementA, elementB) => {
            const greaterQuantity = elementB.quantidade - elementA.quantidade;

            const paymentPriorities = { DIN: 0, '30': 1, R60: 2, '90': 3, '120': 4 }

            const bestCondition = paymentPriorities[elementA.condicao_pagamento] - paymentPriorities[elementB.condicao_pagamento]

            const designationPORT = elementA.pais === 'PORT' ? -1 : elementB.pais === 'PORT' ? 1 : 0

            const totalWeighting = 0.5 * greaterQuantity + 0.3 * bestCondition + 0.2 * designationPORT
      
            return totalWeighting;
          }) 

        return response.status(200).json(orderArray)

    } catch (error) {
        console.error('Erro ao processar a requisição:', error.message)
        response.status(500).json({ error: 'Erro interno do servidor.' })
    }

    }
);

routes.get('/array/api', async (request, response) => {
    const apiUrl = "https://pastebin.pl/view/raw/8fced5f8"

    try {
        const result = await axios.get(apiUrl)
        const {data} = result

        response.status(200).json(data)

    } catch (error) {
        response.status(500).json({ error: 'Erro ao consumir a API.' })
        console.error('Erro ao consumir a API:', error.message)  
    }
})  

module.exports = routes; 