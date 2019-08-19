const express = require('express'); // Framework
const router = express.Router(); // Propiedad para crear rutas mas organizadas y faciles del leer
const { controller } = require('../controllers/usuario'); // Exportacion de la logica de las rutas
const { verificaToken, verificaRole, tokenIMG } = require('../middleware/autentificacion'); //Middle wares para rutas
const { controllersCategoria } = require('../controllers/categorias');
const { controllerProducto } = require('../controllers/producto');
const { controllerImagenes } = require('../controllers/imagenes');




//RUTAS PARA USUARIOS MODIFCAR ETC...
router.get('/usuario', verificaToken, controller.obtenerUsuario); //Obtinie todos los usuarios especificados con ciertos limites para mostrar tienes que tener una secion  con token inciada
router.post('/usuario', [verificaToken, verificaRole], controller.crearUsuario); // Crea un usuario verifica el token y que seas admin role 
router.put('/usuario/:id', [verificaToken, verificaRole], controller.actualizarUsuario); // Actuliza un usuario por medio de su id verfica el token y que seas admin role 
router.delete('/usuario/:id', [verificaToken, verificaRole], controller.borrarUsuario); // Borra (Cambia a flase el estado de un usuario) verfica el token y que seas admin role
router.post('/login', controller.login); // Login para generar el token y que puedas usar los demas servicios dependiendo de tu role
router.post('/google', controller.google);



//RUTAS PARA CATEGORIAS MODIFCAR ETC...
router.post('/categoria', [verificaToken, verificaRole], controllersCategoria.crearCategoria);
router.get('/categoria', verificaToken, controllersCategoria.obtenerCategorias);
router.delete('/categoria/:id', [verificaToken, verificaRole], controllersCategoria.borrarCategoria);
router.put('/categoria/:id', [verificaToken, verificaRole], controllersCategoria.actulizarCategoria);
router.get('/categoria/:id', verificaToken, controllersCategoria.obtenerCategoria);

//RUTAS PARA PRODUCTOS MODIFCAR ETC...
router.post('/producto', verificaToken, controllerProducto.crearProducto); // Crea un nuevo producto
router.get('/producto', verificaToken, controllerProducto.obetenerProductos); // Obtiene todos los productos
router.put('/producto/:id', verificaToken, controllerProducto.actualizarProducto); // Actualiza un rpoducto
router.delete('/producto/:id', verificaToken, controllerProducto.borrarProducto); // Borra un producto
router.put('/productoAct/:id', verificaToken, controllerProducto.activarProdcuto); // Activa denuevo un producto borrado
router.get('/productos/buscar/:termino', verificaToken, controllerProducto.buscarProducto); // Busca Producto por su nombre

//RUTAS PARA SUBIR ARCHIVOS
//router.put('/upload', controllerArchivos.subirArchivo);

//RUTAS PARA OBTENER IMAGENES
router.get('/imagen/:tipo/:img', tokenIMG, controllerImagenes.obtenerImagenes);


module.exports = router; //Exporta todas las rutas