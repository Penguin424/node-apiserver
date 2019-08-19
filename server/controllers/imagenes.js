const path = require('path')
const fs = require('fs');


const controllerImagenes = {
    obtenerImagenes: (req, res) => {
        let tipo = req.params.tipo;
        let img = req.params.img;

        let noImage = path.resolve(__dirname, '../assets/no-image.jpg');
        let phatImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

        if (fs.existsSync(phatImagen)) {
            res.sendFile(phatImagen);
        } else {
            res.sendFile(noImage);

        }


    }
}

module.exports = { controllerImagenes };