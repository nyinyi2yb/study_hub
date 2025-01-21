const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { secret } = require("../config/auth.config");

const RefreshToken = db.refreshToken;

exports.signup = (req, res) => {
    // Save User to Database

    User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.status(201).send({
                            message: "User was registered successfully!",
                            code: 200
                        });
                    });
                });
            } else {
                // user role = 2
                // user.setRoles([3]).then(() => {
                //     res.status(201).send({
                //         message: "User was registered successfully!",
                //         statusCode: 200
                //     });
                // });
                Role.findAll({
                    where: {
                        name: "user"
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.status(201).send({
                            message: "User was registered successfully!",
                            code: 106
                        });
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Register error!',
                code: 506
            });
        });
};

exports.signin = (req, res) => {
    User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(async(user) => {

            if (!user) {
                return res.send({
                    message: "Email not found.",
                    code: 404
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.send({
                    accessToken: null,
                    message: "Invalid Password!",
                    code: 405
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtExpiration
            });

            let refreshToken = await RefreshToken.createToken(user);

            var authorities = [];

            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                    refreshToken: refreshToken,
                    code: 107,
                    profileImage: user.profileImage
                });
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Login error!',
                code: 507
            });
        });
};

exports.refreshToken = async(req, res) => {

    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
        return res.status(200).send({
            message: 'Refresh token is null!',
            code: 400
        });
    }
    try {
        let getRefreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        if (!getRefreshToken) {
            return res.status(200).send({
                message: 'Refresh token is not in database',
                code: 401
            });
        }
        if (RefreshToken.verifyExpiration(getRefreshToken)) {
            RefreshToken.destroy({ where: { id: getRefreshToken.id } }); // delete refresh token
            return res.status(403).send({
                message: 'Refresh token is expired! Signin again!',
                code: 402
            });
        }

        const user = await getRefreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration
        });

        return res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: getRefreshToken.token
        })

    } catch (err) {

    }
}

exports.getUser = (req, res) => {

    const id = req.params.id;
    User.findByPk(id).then(data => {
            res.send(data);
        },
        err => {
            res.send(err.message);
        })
}

exports.findRoles = (req, res) => {

    User.findAll({
        include: [
            Role
        ]
    }).then(data => {

        res.send(data);

    }).catch(err => {

        res.send(err);
    })
}

exports.changeRole = (req, res) => {

    const id = req.params.id;

    User.findByPk(id).then(user => {

            user.getRoles().then(roles => {

                for (let i = 0; i < roles.length; i++) {

                    if (roles[i].name == "user") {
                        Role.findAll({
                            where: {
                                name: "admin"
                            }
                        }).then(roles => {
                            user.setRoles(roles).then(() => {
                                res.status(201).send({
                                    message: "Successfully change to admin role",
                                    code: 208
                                });
                            });
                        });
                    } else {
                        Role.findAll({
                            where: {
                                name: "user"
                            }
                        }).then(roles => {
                            user.setRoles(roles).then(() => {
                                res.status(201).send({
                                    message: "Successfully change to user role",
                                    code: 209
                                });
                            });
                        });
                    }
                }
            })

        })
        .catch(err => {
            res.status(500).send({
                message: err.message,
                code: 508
            });
        })
}

exports.findByUsername = (req, res) => {

    const username = req.query.username;

    if (username.match(/^\s*$/)) {
        return res.status(200).send({
            success: false,
            code: 208,
            message: `Not allowed white space!`
        })
    }

    var condition = username ? {
        username: {
            [Op.like]: `%${username}%`
        }
    } : null;

    User.findAll({
            where: condition,
            include: [
                Role
            ]
        })
        .then(data => {
            if (data) {

                if (data.length == 0) {
                    return res.status(200).send({
                        success: false,
                        code: 207,
                        message: `Found ${data.length} result for username - ${username}`
                    })
                }
                return res.status(200).json({
                    data,
                    code: 206
                })

            } else {
                return res.status(404).json({
                    meta: { total: data.length },
                    data: 'empty data!',
                    message: `No found username with username = ${title}`,
                    code: 205
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: false,
                error: err.message,
                message: 'Some error occured while retreieving users!',
                code: 509
            })
        });
}

exports.updateUser = (req, res) => {

    const id = req.params.id;

    User.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                return res.status(200).json({
                    success: true,
                    message: 'User was updated successfully!'
                });
            } else {
                res.json({
                    message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`
                });
            }

        })
        .catch(err => {
            return res.status(500).send({
                success: false,
                error: err.message,
                message: 'Error updating user with id =' + id
            })
        })
}

exports.createRoles = (req, res) => {

    const data = {
        name: req.body.name
    }

    Role.create(data)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tutorial."
            });
        });
};
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                return res.status(200).json({
                    success: true,
                    message: 'User was deleted successfully!'
                });
            } else {
                res.json({
                    message: `Cannot delete user with id=${id}. Maybe user was not found or req.body is empty!`
                });
            }

        })
        .catch(err => {
            return res.status(500).send({
                success: false,
                error: err.message,
                message: 'Error deleting user with id =' + id
            })
        })
}
exports.deleteUser = (req, res) => {

    const id = req.params.id;
    User.destroy({ where: {}, turncate: false })
        .then(nums => {
            return res.send({ msg: `${nums} Users deleted succcessfully!` });
        })
        .catch(err => {
            return res.send({ message: err.message });
        });
}