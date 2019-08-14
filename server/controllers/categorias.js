const Categoria = require('../models/categoria');

const controllersCategoria = {
    obtenerCategorias: async(req, res) => {
        let desde = parseInt(req.get('desde') || 0);
        let hasta = parseInt(req.get('hasta') || 5);

        await Categoria.find({})
            .sort('descripcion')
            .populate('usuarios', 'nombre email')
            .exec((err, busquedaDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Categoria.countDocuments((errc, conteo) => {

                    if (errc) {
                        return res.status(400).json({
                            ok: false,
                            errc
                        });
                    }

                    res.json({
                        ok: true,
                        categoria: busquedaDB,
                        conteo
                    })

                });

            });
    },

    crearCategoria: (req, res) => {
        let body = req.body;
        let usuario = req.usuario

        let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario: usuario._id
        });

        categoria.save((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
    },

    borrarCategoria: (req, res) => {

        let id = req.params.id;

        Categoria.findByIdAndRemove(id, { new: true, runValidators: true, context: 'query' }, (err, borradoDb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!borradoDb) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'el usuario no existe' }
                });
            }

            res.json({
                ok: true,
                borradoDb
            })

        });

    },

    actulizarCategoria: (req, res) => {
        let id = req.params.id;
        let body = req.body
        let usuario = req.usuario._id
        let modify = { descripcion: body.descripcion, usuario: usuario }

        Categoria.findByIdAndUpdate(id, modify, { new: true, runValidators: true, context: 'query' }, (err, actualizadoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!actualizadoDB) {
                return res.status(404).json({ ok: true, err });
            }

            res.json({
                ok: true,
                actualizadoDB
            });

        });

    },

    obtenerCategoria: (req, res) => {
        let id = req.params.id;

        Categoria.findById(id, (err, buscadoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!buscadoDB) {
                return res.status(404).json({ ok: true, err });
            }

            res.json({
                ok: true,
                buscadoDB
            });

        })
    }
}


module.exports = { controllersCategoria };