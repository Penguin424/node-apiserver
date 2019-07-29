const mongoose = require('mongoose');
const unVa = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

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

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let useObject = user.toObject();
    delete useObject.password;

    return useObject;
}

usuarioSchema.plugin(unVa, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('usuario', usuarioSchema);