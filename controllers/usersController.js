const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');


module.exports = {

    async getAll(req, res, next){
        try{
    
            const data = await User.getAll();
            console.log(`Usuarios :  ${data}`);

            return res.status(201) .json(data);
        }
        catch(error){
            console.log(`Error : ${error}`);
            return res.status(501).json({
                success: false,
                message : `Error al obtener los usuarios`
        });
        }
    },

    async findDeliveryMen(req, res, next) {
        try {
            const data = await User.findDeliveryMen();    
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async register(req, res, next){

        try{    
            const user= req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 1);
            const token = jwt.sign({
                id: data.id,
                email : user.email,

            }, keys.secretorKey,{
                //expiresIn:
            })

            const myData = {
                id: data.id,
                name : user.name,
                lastname : user.lastname,
                email : user.email,
                phone : user.phone,
                image : user.image,
                session_token : `JWT ${token}`
    
            };

            return res.status(201).json({
                success: true,
                message : 'El registro se realizo correctamente',
                data: myData
            });
            
        }catch(error){
            console.log(`Error :  ${error}`);
            return res.status(501).json({
                success: false,
                message : 'Error con el registro del usuario',
                error: error
            });
        }
    },

    async login(req,res, next){

        try {

            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);
            if(!myUser){
                return res.status(401).json({
                    success: false,
                    message : 'El email no fue encontrado'
                })
            }

            const isPasswordValid = await 
            bcrypt.compare(password, myUser.password);

            if(isPasswordValid){
                const token = jwt.sign({
                    id: myUser.id,
                    email : myUser.email,

                }, keys.secretorKey,{
                    //expiresIn:
                })

                const data = {
                    id: myUser.id,
                    name : myUser.name,
                    lastname : myUser.lastname,
                    email : myUser.email,
                    phone : myUser.phone,
                    image : myUser.image,
                    session_token : `JWT ${token}`,
                    roles : myUser.roles
        
                }
             
                await User.updateSessionToken(myUser.id, `JWT ${token}`);

                return res.status(201).json({
                    success : true,
                    data : data,
                    message : 'El usuario ha sido autenticado'
                });
            }
            else{
                //Contraseña incorrecta o no autorizado valores no estan
                //bien definidos
                return res.status(401).json({
                    success : false,
                    data : data,
                    message : 'La contraseña es incorrecta',
                });

            }

        }catch(error){
            console.log(`Error :  ${error}`);
            return res.status(501).json({
                success: false,
                message : 'Hubo un error con el login del usuario',
                error: error
            });
        }
    },

    async update(req, res, next){

        try{

            console.log('Usuario',req.body.user);
            const user = JSON.parse(req.body.user); // CLIENTE ENVIA UN OBEJTO USER CON TODO LOS DAOTS
            console.log('Usuario Parseado', user);

            const files = req.files;

            if(files.length > 0){

                const pathImage = `image_${Date.now()}`;//Nombre del Archivo
                const url = await storage(files[0] , pathImage);

                if(url != undefined && url != null){
                    user.image = url
                }

            }

            await User.update(user); // Guardando la url en la base de datos campo imagen

            return res.status(201).json({
                success: true,
                message: 'Los datos del usuario se han actualziado',
                data: user
            })

        }catch(error){

            console.log(`Error :  ${error}`);
            return res.status(501).json({
                success: false,
                message : 'Hubo un error al actualziar los datos del usuario',
                error: error
            });
        }

    }, 
    async updateWithoutImage(req, res, next){

        try{

            console.log('Usuario',req.body);
            const user = req.body; // CLIENTE ENVIA UN OBEJTO USER CON TODO LOS DAOTS
            console.log('Usuario Parseado', user);

            await User.update(user); // Guardando la url en la base de datos campo imagen

            return res.status(201).json({
                success: true,
                message: 'Los datos del usuario se han actualziado',
                data: user
            })

        }catch(error){
            console.log(`Error :  ${error}`);
            return res.status(501).json({
                success: false,
                message : 'Hubo un error al actualziar los datos del usuario',
                error: error
            });
        }

    }

};

