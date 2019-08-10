const mongoose = require('mongoose'); // Libreria para creacion de schemas en bases de datos de mongoDB
const unVa = require('mongoose-unique-validator'); // Libreria para validacion de parametos unique y required

let rolesValidos = { // Solo un JSON con los roles permitidos para proporcionar al usuario 
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema; //Schema para los usuarios 

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        unique: true

    },
    password: {
        type: String,
        required: [true, 'el password es necesario']
    },
    img: {
        type: String,
        required: false
    }, //no es obligatoria 
    role: {
        type: String,
        required: [true, 'El rool es necesario o se ortagara uno por defecto'],
        default: 'USER_ROLE',
        enum: rolesValidos
    }, // default : 'use_role'
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false
    } //boolean

});

usuarioSchema.methods.toJSON = function() { //Oculta las contraseñas de todos los usuarios para que el cliente no las pueda ver
    let user = this;
    let useObject = user.toObject();
    delete useObject.password;

    return useObject;
}

usuarioSchema.plugin(unVa, { message: '{PATH} debe ser unico' }); // Plugin que te muestra error de validacion es para efectutrar los valores unique o rquired en el json del schema para la base de datos

module.exports = mongoose.model('usuario', usuarioSchema); // Exportacion del Schema para usuarlo posterior mente