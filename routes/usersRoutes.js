const UsersController = require('../controllers/usersController');
const passport = require('passport');


module.exports = (app , upload) =>{

    //Get de obtener datos
    app.get('/api/users/getAll', UsersController.getAll);
    app.get('/api/users/findDeliveryMen',
     passport.authenticate('jwt', {session: false}),
      UsersController.findDeliveryMen);
    
    //GUARDAR DATOS
    app.post(`/api/users/create`, UsersController.register);
    app.post(`/api/users/login`, UsersController.login);

    //Actualziar DATOS
    //401 No autorizado
    app.put('/api/users/update', passport.authenticate('jwt', {session:false}),
     upload.array('image',1), UsersController.update);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session:false}),
    UsersController.updateWithoutImage);

}