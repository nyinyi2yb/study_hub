const uploadFile = require('../middleware/upload');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const baseUrl = 'http://localhost:8000/files/'

const upload = async(req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(200).send({
                message: 'You must select a file!',
                code: 404
            });
        }

        return res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            fileName: req.file.originalname,
            code: 200
        })


    } catch (err) {
        return res.status(500).send({
            message: `Could not upload this file ${req.file.originalname} . ${err}`
        })
    }
}


const getFileList = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/resized";

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send({
                message: err.message
            });
        }
        var fileInfos = [];
        files.forEach(file => {
            fileInfos.push({
                name: file,
                url: baseUrl + file
            });
        })
        res.status(200).send({
            file: fileInfos,
            code: 200
        });
    });
}

const download = (req, res) => {

    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/resized/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            return res.status(500).send({
                message: `Cannot download this file ${fileName}`
            });
        }
    })
}

const getSelectedFile = (req, res) => {

    const fileName = req.params.name;

    const directoryPath = __basedir + "/resources/static/assets/uploads/resized";

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: err.message
            });
        }
        const filterImage = files.filter(file => {
            return file == fileName
        });

        const image = [];
        image.push({
            success: true,
            name: filterImage,
            url: baseUrl + filterImage
        })
        res.status(200).send({
            success: true,
            img: image,
            filterImage,
            code: 202
        });
    });
}


const removeFile = (req, res) => {
    const fileName = req.params.name;

    const directoryPath = __basedir + "/resources/static/assets/uploads/resized/";

    fs.unlink(directoryPath + fileName, (err) => {
        if (err) return res.send(err);
        res.send({
            success: true,
            message: 'File deleted successfully!',
            code: 203
        });
    })
}


const uploadResizeFile = async(req, res) => {

    const { filename: file } = req.file;
    const directoryPath = __basedir + "/resources/static/assets/uploads/resized";

    try {

        await sharp(req.file.path)
            .resize(700, 400)
            .jpeg({ quality: 100 })
            .toFile(
                path.resolve(directoryPath, file)
            )

        fs.unlinkSync(req.file.path);
        if (req.file == undefined) {
            return res.status(200).send({
                message: 'You must select a file!',
                code: 404
            });
        }

        return res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            fileName: req.file.originalname,
            code: 201
        })

    } catch (err) {
        return res.status(500).send({
            message: `Could not upload this file ${req.file.originalname} . ${err}`
        })
    }
}

const resizeImage = (req, res) => {

}

module.exports = {
    upload,
    getFileList,
    download,
    getSelectedFile,
    removeFile,
    uploadResizeFile
}