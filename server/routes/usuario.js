const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');


app.get('/usuario', (req, res) => {

    let desde = parseInt(req.query.desde || 0);
    let limite = parseInt(req.query.limite || 5);


    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                // if (usuarioDB.estado === true) {
                res.json({ ok: true, usuarioDB, cuantos: conteo })
                    //}


            })



        });
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDb.password = null

        res.json({
            ok: true,
            usuario: usuarioDb
        });

    });


});

app.put('/usuario/:id', (req, res) => {
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let id = req.params.id
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {

        if (err) {

            return res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, usuario: userDB });


    });
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err })
        }

        if (!userDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            })
        }


        res.json({ ok: true, usuario: userDB });

    });

});

module.exports = app;