const express = require('express'); //Framework
const app = express();
const fileUpdate = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const path = require('path');
const fs = require('fs');

app.use(fileUpdate());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se a podido cargar el archivo'
            }
        });
    }

    //Validacion para saber si la imagen va producto o usuario
    let tiposValidos = ['producto', 'usuario'];

    if (tiposValidos.indexOf(tipo) < 0) {
        res.json({
            ok: false,
            message: 'Solo se permiten extensiones de tipo ' + tiposValidos.join(', '),
            tipo
        });
    }


    let archivo = req.files.archivo;
    let nameArchivo = req.files.archivo.name;
    let cortadoDeExtension = nameArchivo.split('.');
    let extension = cortadoDeExtension[cortadoDeExtension.length - 1];
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extension) < 0) {

        res.json({
            ok: false,
            message: 'Solo se permiten extensiones de tipo ' + extensionesPermitidas.join(', '),
            ext: extension
        });

    }

    //Cambiar nombre al archivo 
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Actualizar la imagen del usuario
        if (tipo === 'usuario') {
            actualizarIMG_usuario(id, res, nombreArchivo);
        } else {
            actualizarIMG_producto(id, res, nombreArchivo);

        }
    });

});

const actualizarIMG_usuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuario');

            return res.status(400).json({
                ok: false,
                err
            });

        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuario');


            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        }


        borraArchivo(usuarioDB.img, 'usuario');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGurdado) => {

            res.json({
                usuario: usuarioGurdado,
                img: nombreArchivo
            });

        });

    });

}

const actualizarIMG_producto = (id, res, nombreArchivo) => {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'producto');

            return res.status(400).json({
                ok: false,
                err
            });

        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'producto');


            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        }


        borraArchivo(productoDB.img, 'producto');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGurdado) => {

            res.json({
                usuario: productoDB,
                img: nombreArchivo
            });

        });

    });

}

const borraArchivo = (nombreImagen, tipo) => {
    let phatImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(phatImagen)) {
        fs.unlinkSync(phatImagen);
    }
}


module.exports = app;