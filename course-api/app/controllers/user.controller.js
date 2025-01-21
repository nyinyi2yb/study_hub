const db = require('../models');
const User = db.user;
const Course = db.course;
const Role = db.role
const Op = db.Sequelize.Op;

const auth = require('../controllers/auth.controller');

const jwt_decode = require('jwt-decode');

exports.token = (req, res) => {
    res.status(200).send({
        message: 'Token existed!'
    })
}

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {

    // get roles

    User.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'password']
        },
        include: [{
            model: Role,
            attributes: ['name'],
        }],
    }).then(data => {
        console.log('data.id', data.id);
        res.send({
            message: 'Success',
            code: 300,
            data,
        });
    }).catch(err => {
        res.send(err);
    })
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

exports.getMyCourses = (req, res) => {

    Course.findAll({
        attributes: {
            exclude: ['updatedAt', 'createdAt']
        },
    }).then(data => {

        User.findByPk(req.userId).then(user => {

            console.log('user -------- ', user);

            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {

                    if (roles[i].name === "admin") {

                        return res.status(200).send({
                            success: true,
                            message: 'Admin Content',
                            stautsCode: 200,
                            data
                        });

                    } else {

                        let userData = data.filter(data => { // Check userId == decodedId
                            return data.userId == req.userId;
                        });

                        return res.status(200).send({
                            success: true,
                            message: 'User Content',
                            stautsCode: 200,
                            userData,
                        })
                    }
                }
                res.status(403).send({
                    message: "Require role",
                    statusCode: 405
                });
                return;
            });
        });


    }).catch(err => {
        return res.status(200).send({
            success: false,
            statusCode: 509,
            message: 'Error occured while retrieving courses'
        })
    });
}


exports.findCourse = (req, res) => {

    const title = req.query.title;

    if (title.match(/^\s*$/)) {
        return res.status(200).send({
            success: false,
            code: 203,
            message: `Not allowed white space!`
        })
    }

    var condition = title ? {
        courseTitle: {
            [Op.like]: `%${title}%`
        }
    } : null;

    Course.findAll({
        where: condition,
        attributes: {
            exclude: ['updatedAt', 'createdAt']
        },
        include: [{
            model: User,
            as: 'user',
            attributes: ['username']
        }],
    }).then(data => {

        let userData = data.filter(data => { // Check userId == decodedId
            return data.userId == req.userId;
        });

        User.findByPk(req.userId).then(user => {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name == 'admin') {

                        if (data.length == 0) {
                            return res.status(200).send({
                                success: false,
                                code: 202,
                                message: `Found ${userData.length} result for = ${title}`,
                            })
                        } else {
                            return res.status(200).send({
                                success: true,
                                code: 204,
                                data
                            })
                        }
                    } else {
                        if (userData.length == 0) {
                            return res.status(200).send({
                                success: false,
                                code: 202,
                                message: `Found ${userData.length} result for = ${title}`,
                            })
                        } else {
                            return res.status(200).send({
                                success: true,
                                code: 201,
                                userData,
                            })
                        }
                    }
                }
            })
        }).catch(err => {
            res.status(500).send({
                message: err.message
            })
        })

    }).catch(err => {
        return res.status(500).send({
            success: false,
            code: 501,
            message: 'Error occured while retrieving courses'
        })
    })
}


const checkDataLength = (data) => {
    if (data.length == 0) {
        return res.status(200).send({
            success: false,
            code: 202,
            message: `Found ${userData.length} result for = ${title}`,
        })
    }
}