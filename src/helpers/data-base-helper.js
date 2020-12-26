const path = require('path');
const fs = require('fs');

module.exports = {
    // Encuentra el archivo y lee la base de datos requerida.
    getAllDataBase: (dataBaseFile) =>{ 
        const dataBasePath = path.join('./src/database', dataBaseFile);
        return JSON.parse(fs.readFileSync(dataBasePath, 'utf-8'));
    },

    // Generar nuevo id a continuacion del ultimo id de la lista en la base de datos.
    generateId: (dataBaseFile) =>{
        const allDataList = module.exports.getAllDataBase(dataBaseFile);
        return allDataList.pop().id +1;
    },

    // Escribir el nuevo dato e incluirlo al final de la lista en la base de datos.
    writeNewDataBase: (dataToSave, dataBaseFile) => {
        const dataToStringify = JSON.stringify(dataToSave, null, ' ');
        const dataBasePath = path.join('./src/database', dataBaseFile);
        return fs.writeFileSync(dataBasePath, dataToStringify);
    }
};