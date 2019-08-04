const express = require('express');
const router = express.Router();
const { controller } = require('../controllers/usuario');
const { verificaToken, verificaRole } = require('../middleware/autentificacion');

router.get('/usuario', verificaToken, controller.obtenerUsuario);
router.post('/usuario', [verificaToken, verificaRole], controller.crearUsuario);
router.put('/usuario/:id', [verificaToken, verificaRole], controller.actualizarUsuario);
router.delete('/usuario/:id', [verificaToken, verificaRole], controller.borrarUsuario);
router.post('/login', controller.login);

module.exports = router;