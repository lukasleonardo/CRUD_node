//Imports
    const express = require('express')
    const {engine} = require('express-handlebars')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const app = express()
    const admin = require('./routes/admin')
    const users = require('./routes/users')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Posts')
    const Post = mongoose.model('posts')
    require('./models/Category')
    const Category = mongoose.model('categories')

//Configs
    //sessão
        app.use(session({
            secret:'cursodenode',
            resave:true,
            saveUninitialized:true
        }))
        app.use(flash())
    //Middleware
        app.use((req,res,next)=>{ 
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp',).then(()=>{
            console.log('conectado...')
        }).catch((e)=>{
            console.log('erro ao connectar. erro: '+ e)
        })
    //bodyParser
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())
    //handleBars
        app.engine('handlebars', engine({defaultLayout:'main',runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }}))
        app.set('view engine','handlebars')
        app.set('views','./views')
    //public
        app.use(express.static(path.join(__dirname,'public')))




//Rotas
    
    app.get('/',(req,res)=>{ 
        Post.find().populate('categoria').sort({date:'desc'}).then((posts)=>{
            res.render('index',{posts:posts})
        }).catch((e)=>{
            req.flash('error_msg','Falha ao carregar as postagens')
            res.redirect('/404')
        })
        
    })

    app.get('/posts/:slug',(req,res)=>{
        Post.findOne({slug:req.params.slug}).then((posts)=>{ 
            if(posts){
                res.render('posts/index',{posts:posts})
            }else{
                res.redirect('/404')
            }     
        }).catch((e)=>{
            req.flash('error_msg','Falha ao carregar a postagem')
            res.redirect('/404')
        })
    })

    app.get('/category',(req,res)=>{
        Category.find().then((categories)=>{
            res.render('category/categories',{categories:categories})
        }).catch((e)=>{
            req.flash('error_msg','Falha ao listar as categorias')
            console.log(e)
            res.redirect('/404')
        })
    })

    app.get('/category/:slug',(req,res)=>{
        Category.findOne({slug: req.params.slug}).then((categories)=>{ 
            if(categories){
                Post.find({categoria: categories._id}).then((posts)=>{
                    res.render('category/index',{posts:posts, categories:categories})
                }).catch((e)=>{
                    req.flash('error_msg','Falha ao listar os posts')
                    res.redirect('/')
                })
                
            }else{
                res.redirect('/404')
            }
        }).catch((e)=>{
            req.flash('error_msg','Falha ao carregar a categoria')
            res.redirect('/404')
        })
    })

    app.get('/404',(req,res)=>{
        res.send('ERRO 404! Page not Found')
    })

    app.use('/admin',admin)
    app.use('/users', users)

//Outros
const PORT = 8081
app.listen(PORT,()=>{ console.log('Servidor Funcionando... http://localhost:8081/')})