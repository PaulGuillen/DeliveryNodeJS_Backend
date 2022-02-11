const MercadoPagoController = require('../controllers/mercadoPagoController');
const passport = require('passport');

module.exports = (app) => {


    // GUARDAR DATOS
    app.post('/api/payments/create', passport.authenticate('jwt', {session: false}), MercadoPagoController.createPayment);


}