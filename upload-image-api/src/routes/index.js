const express = require('express');
const router = express.Router();

const controller = require('../controller/file.controller');
const resizedUpload = require('../middleware/resized.upload');

let routes = app => {
    //upload resized file
    router.post('/uploadresizefile', resizedUpload, controller.uploadResizeFile);

    //get all files
    router.get('/files', controller.getFileList);

    //download file
    router.get('/files/:name', controller.download);

    //get seleted uploaded file
    router.get('/uploadedFiles/:name', controller.getSelectedFile);

    //delete file
    router.delete('/removefile/:name', controller.removeFile);

    app.use(router);
}

module.exports = routes;