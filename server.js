const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');

admin.initializeApp({
    credentials: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});


/*
*Rutas
*/

const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');

const port = process.env.PORT || 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ 
    extended : true 
}));


app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

/*LLamo a la ruta que quiero*/
users(app,upload);
categories(app, upload);
address(app);
orders(app);
products(app, upload);

server.listen(3000, 'Your IP' || 'localhost', function () {
    console.log('Aplicacion de NodeJs ' + port + ' Iniciado...')
});

app.get('/',(req,res) =>{
    res.send('Ruta raiz del backend');
});
//Manejo de Errores
app.use((err,req,res,next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server : server,
}


//200 - Respuesta exitosa 
// 404 - La url no existencia
// 500 - Error interno del servidor (Codigo del vservidor)
