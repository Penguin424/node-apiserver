const express = require('express'); // Framework
const router = express.Router(); // Propiedad para crear rutas mas organizadas y faciles del leer
const { controller } = require('../controllers/usuario'); // Exportacion de la logica de las rutas
const { verificaToken, verificaRole } = require('../middleware/autentificacion'); //Middle wares para rutas

router.get('/usuario', verificaToken, controller.obtenerUsuario); //Obtinie todos los usuarios especificados con ciertos limites para mostrar tienes que tener una secion  con token inciada
router.post('/usuario', [verificaToken, verificaRole], controller.crearUsuario); // Crea un usuario verifica el token y que seas admin role 
router.put('/usuario/:id', [verificaToken, verificaRole], controller.actualizarUsuario); // Actuliza un usuario por medio de su id verfica el token y que seas admin role 
router.delete('/usuario/:id', [verificaToken, verificaRole], controller.borrarUsuario); // Borra (Cambia a flase el estado de un usuario) verfica el token y que seas admin role
router.post('/login', controller.login); // Login para generar el token y que puedas usar los demas servicios dependiendo de tu role
router.post('/google', controller.google);

module.exports = router; //Exporta todas las rutas