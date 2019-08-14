const Producto = require('../models/producto');
const _ = require('underscore');

const controllerProducto = {

    crearProducto: (req, res) => {
        let body = req.body;

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: body.categoria,
            usuario: req.usuario._id
        });

        producto.save((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            });
        });

    },

    obetenerProductos: (req, res) => {
        let desde = parseInt(req.get('desde') || 0);
        let hasta = parseInt(req.get('hasta') || 5);

        Producto.find({ disponible: true })
            .skip(desde)
            .limit(hasta)
            .sort('descripcion')
            .populate('usuario', 'email nombre')
            .populate('categoria', 'descripcion')
            .exec((err, producto) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Producto.countDocuments({ disponible: true }, (err, contadorproductos) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        producto,
                        contadorproductos
                    });

                });

            });
    },

    actualizarProducto: (req, res) => {
        let id = req.params.id
        let body = req.body;
        let modify = { nombre: body.nombre, precioUni: body.precioUni, descripcion: body.descripcion, categoria: body.categoria }
            //let body = _.pick(req.doby, ['nombre', 'precioUni', 'descripcion', 'categoria']);

        Producto.findByIdAndUpdate(id, modify, { new: true, runValidators: true, context: 'query' }, (err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            })

        });
    },

    borrarProducto: (req, res) => {
        let id = req.params.id;

        Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            })

        });
    },

    activarProdcuto: (req, res) => {
        let id = req.params.id;

        Producto.findByIdAndUpdate(id, { disponible: true }, { new: true, runValidators: true, context: 'query' }, (err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            })

        });
    },

    buscarProducto: (req, res) => {
        let desde = parseInt(req.get('desde') || 0);
        let hasta = parseInt(req.get('hasta') || 5);
        let termino = req.params.termino;
        let regex = new RegExp(termino, 'i');

        Producto.find({ nombre: regex })
            .skip(desde)
            .limit(hasta)
            .sort('descripcion')
            .populate('categoria', 'descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, productos) => {


                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                Producto.countDocuments({ disponible: true }, (err, contadorproductos) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        productos,
                        contadorproductos
                    });

                });



            });
    }

}


module.exports = { controllerProducto };