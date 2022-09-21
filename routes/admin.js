const express = require('express')
const router = express.Router()
//usando model externo
const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('categories')
require('../models/Posts')
const Post = mongoose.model('posts')


// categorias
router.get('/category',(req,res)=>{
    Category.find().sort({sort:'desc'}).then(( categories)=>{

        res.render('admin/category',{categories: categories})
    }).catch((e)=>{
        req.flash("error_msg", "Falha ao carregar categorias")   
        res.redirect('/admin')
    })    
})

router.get('/category/add-category',(req,res)=>{
    res.render('admin/add-category')
})

router.post('/category/new',(req,res)=>{
    var erros = [];

    if (!req.body.nome || req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido'})
    }if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug inválido'})
    }if(req.body.nome.length < 2){
        erros.push({texto:'nome muito curto'})
    }if(erros.length >0){
        res.render('admin/add-category',{erros:erros})
    }else{
        const newCategory ={
            nome:req.body.nome,
            slug:req.body.slug
        }
    
        new Category(newCategory).save().then(()=>{
            req.flash("success_msg", "categoria criada com sucesso")
            res.redirect('admin/category')
        }).catch((e)=>{
            req.flash("error_msg", "Erro ao salvar categoria")
            
            res.redirect('/admin')
        })
    }  

})

router.get('/category/edit/:id',(req,res)=>{
    
    Category.findOne({_id: req.params.id}).then((category)=>{ 
        res.render('admin/edit-category', {category:category})
    }).catch((e)=>{
        req.flash('error_msg','esta categoria não existe')
        res.redirect('/admin/category')
    }) 
})

router.post('/category/edit',(req,res)=>{
   Category.findOne({id:req.body.id}).then((category)=>{
        category.nome = req.body.nome
        category.slug = req.body.slug
        category.save().then(()=>{
            req.flash('success_msg','Categoria editada')
            res.redirect('/admin/category')
        }).catch((e)=>{
            req.flash('error_msg','Falha ao editar Categoria')
            res.redirect('/admin/category')
        })
   }).catch((e)=>{
    req.flash('error_msg','Falha ao editar Categoria2 ')
    res.redirect('/admin/category')
})    
})


router.post('/category/delete',(req,res)=>{
    Category.remove({_id:req.body.id}).then(()=>{
        req.flash('success_msg','categoria deletada')
        res.redirect('/admin/category')
    }).catch((e)=>{
        req.flash('error_msg','falha ao deletada categoria ')
        res.redirect('/admin/category')
    })
})

//POSTS
router.get('/posts',(req,res)=>{
    Post.find().populate('categoria').sort({date:'desc'}).then((posts)=>{
        res.render('admin/posts', {posts:posts})

    })
})



router.get('/posts/add-post',(req,res)=>{
    Category.find().then(( categories)=>{
        res.render('admin/add-post',{categories: categories})
    }).catch((e)=>{
        req.flash("error_msg", "Falha ao carregar formulário")   
        res.redirect('/admin/postagens')
    })  
})


router.post('/posts/new',(req,res)=>{
    var erros = [];

    if (!req.body.titulo || req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: 'titulo inválido'})
    }if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug inválido'})
    }if(req.body.titulo.length < 2 ){
        erros.push({texto:'titulo muito curto'})
    }if(!req.body.description || req.body.description == undefined || req.body.description == null ||req.body.description.length < 2 ){
        erros.push({texto:'descrição inválida'})
    }if(req.body.categories == '1' || req.body.categories == '0'){
        erros.push({texto:'categoria invalida'})
    }if(!req.body.content || req.body.content == undefined || req.body.content == null ||req.body.description.length < 2 ){
        erros.push({texto:'conteudo inválido'})
    }if(erros.length >0){
        res.render('admin/add-post',{erros:erros})
    }else{

        const newPost = {
           titulo: req.body.titulo,
           slug: req.body.slug,
           description: req.body.description,
           conteudo: req.body.content,
           categoria: req.body.categories
        }

        new Post(newPost).save().then(()=>{
            req.flash('success_msg','postagem salva com sucesso')
            res.redirect('/admin/posts')
        }).catch((e)=>{
            req.flash('error_msg','Falha ao salvar postagem')
            console.log(e)
            res.redirect('/admin/posts')
        })
    }
})

router.get('/posts/edit/:id',(req,res)=>{
    Post.findOne({_id:req.params.id}).then((posts)=>{
        Category.find().then((categories)=>{
            res.render('admin/edit-post', {categories:categories, posts:posts})
        }).catch(()=>{
            req.flash('error_msg','falha recuperar dados de categorias')
            res.redirect('/admin/postagens')
        })
       
    }).catch((e)=>{
        req.flash('error_msg','falha recuperar dados')
        res.redirect('/admin/postagens')
    })
})

router.post('/posts/edit',(req,res)=>{
    Post.findOne({_id: req.body.id}).then((posts)=>{
        posts.titulo= req.body.titulo,
        posts.slug= req.body.slug,
        posts.description= req.body.description,
        posts.conteudo= req.body.content,
        posts.categoria = req.body.categories,
        posts.save().then(()=>{
            req.flash('success_msg','Postagem editada')
            res.redirect('/admin/posts')
        }).catch((e)=>{
            req.flash('error_msg','Falha ao editar Postagem')
            res.redirect('/admin/posts')
        })
    }).catch((e)=>{
        req.flash('error_msg','Falha ao editar postagem 1')
        res.redirect('/admin/posts')
    }) 
})

router.post('/posts/delete', (req,res)=>{
    Post.remove({_id:req.body.id}).then(()=>{
        req.flash('success_msg','post deletado')
        res.redirect('/admin/posts')
    }).catch((e)=>{
        req.flash('error_msg','falha ao deletar o post ')
        res.redirect('/admin/posts')
    })
})



module.exports = router;
