const express = require ('express');
const app = express();
app.use (express.json());
app.use (express.urlencoded({extended: false}));
const mysql = require('mysql2');
const jwt = require ('jsonwebtoken');
require ('dotenv').config();


// let conexion = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'alejo123abc..',
//     database: 'jwt'
// });

// conexion.connect((error) => {
//     if (error) {
//         console.error("Error al conectar con la db", error);
//     }

//     console.log("Conexión establecida con la base de datos");
// });



app.get ('/', (req, res)=>{
    res.send ("HELLO");
})



app.get ('/api',  ValidateToken ,(req,res)=>{
    
    res.json ({
        tuits: [
            {
                id: 0,
                text: 'Primer Tuit',
                username : 'Alejo'
            },
            {
                id: 0,
                text :'Segundo tuit',
                username : 'Jhoan'
            }
        ]
    })

})

app.get ('/login', (req,res)=>{
    res.send(`<html>
    <head>
        <title>Document</title>
    </head>
    <body>
        <form action="/auth" method="post">
    
            Name : <input type="text" name="name">
            Password : <input type="password" name="pass">
            <input type="submit" value="Ingresar">
        </form>
    
    </body>
    </html>`)
})

app.post ('/auth', (req,res)=>{
     const {username, password} =req.body;
     const user = {username : username};
     const accessToken = generateAccessToken (user);
     res.header('authorization', accessToken).json({
        message : 'Exitosa Conexion',
        token: accessToken
     })
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, {expiresIn : '5m'})
    
}

function ValidateToken(req, res, next) {
    const accessToken = req.headers['authorization'] || req.query.accesstoken;
    if (!accessToken) res.send ('Access deneid')
    
    jwt.verify(accessToken, process.env.SECRECT, (err,user)=>{
        if (err){
            res.send ('Access deneid, token expired or incorrect')
        }
        else{
            next();
        }
    })
}

app.listen(3000,()=>{
    console.log("Servidor : true");
})