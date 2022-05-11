const express = require('express')
const app = express();
const PORT = 8080;
const { knexMysql } = require('./options/mariaDB');
const { knexSqLite } = require('./options/sqlLite3');

app.set('view engine', 'ejs'); //se define extension (motor de plantilla)
app.use(express.static(__dirname + "/public"));
app.use(express.json()); //tiene q estar para qe se llene el req body
const urlencodedParser = app.use(express.urlencoded({extended:true}))

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const contenedor = require("./contenedor.js")
const mensaje = require("./mensaje.js")

const newContenedor = new contenedor('productos.txt');
const chat = new mensaje('chat.txt');

//mandar al cliente 

//Productos
io.on('connection', async(socket) => {
    const prod = await newContenedor.getAll(knexMysql).then( (obj) =>{  
        socket.emit('products', obj);
    })

    socket.on('new-products', async data => {
        console.log("producto nuevo : ",data);
        const saveObj = await newContenedor.save(knexMysql,data);
        io.sockets.emit('products', newContenedor.getAll(knexMysql));
    })
})
//chat
io.on('connection', async (socket) => {
    const text = await chat.getAll(knexSqLite).then( (obj) =>{  
        socket.emit('text', obj);
    })
    socket.on('new-text', async data => {
        console.log("Chat nuevo : ",data);
        const saveObj = await chat.save(knexSqLite,data);
        io.sockets.emit('text', chat.getAll(knexSqLite));
    })
})

app.get('/', function (req, res) {
    listExists = false;
    listNotExists = false;
    
    const prod = newContenedor.getAll(knexMysql).then( (obj) =>{
        obj.length  > 0 ?  res.render('pages/index', {listExists: true }) : res.render('pages/index', {listNotExists: true}) ;
    })  
})
 
const connectedServer = httpServer.listen(PORT, () =>{
    console.log('Servidor escuchando en el puerto '+ connectedServer.address().port);
})
connectedServer.on('error', error => console.log('Error en el servidor ' + error))