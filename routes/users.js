const express = require("express");
const router  = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')

router.get( '/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',(req,res)=>{

    var erros =[]

    if(!req.body.nome|| typeof req.body.nome == undefined || req.body.nome==null){
        erros.push({texto:"nome inválido"})
    }if(!req.body.email|| typeof req.body.email == undefined || req.body.email==null){
        erros.push({texto:"E-mail inválido"})
    }if(!req.body.senha|| typeof req.body.senha == undefined || req.body.senha==null ){
        erros.push({texto:"senha inválida"})
    }if(req.body.senha.length < 8){
        erros.push({texto:"senha muito curta"})
    }if(req.body.rsenha != req.body.senha){
        erros.push({texto:"senhas não correspondentes"})
    }if(erros.length > 0){
        res.render('users/register',{erros:erros})
    }else{
         const newUser ={
            nome:req.body.nome,
            email:req.body.email,
            senha:req.body.senha
        }

        new User(newUser).save().then(()=>{
            req.flash('success_msg','Usuário cadastrado com sucesso')
            res.redirect('/register')
        }).catch((e)=>{
            req.flash('error_msg','Usuário não pode ser cadastrado')
            res.redirect('/register')
        }) 
    }

})






module.exports = router