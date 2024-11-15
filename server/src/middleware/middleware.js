import express from 'express'


export const applyMiddleware=(app)=>{
    app.use(express.json())
    
}