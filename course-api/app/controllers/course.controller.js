const db = require('../models');
const Course = db.course;
const User = db.user;
const Op = db.Sequelize.Op;

//Create new course
exports.createCourse = (req, res) => {

    //Validation request
    if (!req.body.courseTitle) {
        return res.send({
            success: false,
            code: 303,
            message: 'Content cannot be empty!'
        });
    }

    //add course
    const course = {
        courseTitle: req.body.courseTitle,
        courseDescription: req.body.courseDescription,
        images: req.body.images ? req.body.images : null,
        userId: req.body.userId
    }

    //save course in database
    Course.create(course).then(data => {
        return res.status(201).send({
            success: true,
            message: 'course was created!',
            code: 100
        });
    }).catch(err => {
        return res.status(500).send({
            success: false,
            code: 500,
            message: 'Error occured while creating course!'
        });
    })
}

exports.getAllCourses = (req, res) => {

    const title = req.query.title;


    // if (title.match(/^\s*$/)) {
    //     return res.status(200).send({
    //         success: false,
    //         code: 107,
    //         message: `Not allowed white space!`
    //     })
    // }

    var condition = title ? {
        courseTitle: {
            [Op.like]: `%${title}%`
        }
    } : null;

    Course.findAll({
        where: condition,
        attributes: {
            exclude: ['updatedAt', 'id', 'userId', 'createdAt']
        },
        include: [{
            model: User,
            as: 'user',
            attributes: ['username', 'profileImage']
        }],
    }).then(data => {

        if (data.length == 0) {
            return res.status(200).send({
                success: false,
                code: 106,
                message: `Found ${data.length} result for = ${title}`,
            })
        } else {
            return res.status(200).send({
                success: true,
                code: 101,
                data
            })
        }

    }).catch(err => {
        return res.status(500).send({
            success: false,
            code: 501,
            message: 'Error occured while retrieving courses'
        })
    })
}

exports.findById = (req, res) => {

    const id = req.params.id;

    Course.findByPk(id).then(data => {
        if (data) {
            return res.status(200).send({
                success: true,
                code: 102,
                data
            })
        } else {
            return res.send({
                success: false,
                message: `Not match course with id = ${id}`,
                code: 300,
            })
        }
    }).catch(err => {
        return res.status(500).send({
            success: false,
            code: 502,
            message: 'Error occured while retrieving courses with id ' + id
        })
    })
}

exports.updateCourse = (req, res) => {

    const id = req.params.id;

    Course.update(req.body, {
        where: {
            id: id
        }
    }).then(num => {
        if (num == 1) {
            return res.status(200).send({
                success: true,
                code: 103,
                message: 'Updated successfully!'
            });
        } else {
            return res.send({
                success: false,
                message: `Not match course with id = ${id}`,
                code: 301,
            })
        }
    }).catch(err => {
        return res.status(500).send({
            success: false,
            code: 503,
            message: 'Error occured while updating course with id ' + id
        })
    })
}

exports.deleteCourse = (req, res) => {
    const id = req.params.id;

    Course.destroy({
        where: {
            id: id
        }
    }).then(num => {
        if (num == 1) {
            return res.status(200).send({
                success: true,
                code: 104,
                message: 'Deleted successfully!'
            });
        } else {
            return res.send({
                success: false,
                message: `Not match course with id = ${id}`,
                code: 302,
            })
        }
    }).catch(err => {
        return res.status(500).send({
            success: false,
            code: 504,
            message: 'Error occured while deleting course with id ' + id
        })
    })
}


exports.deleteAll = (req, res) => {

    Course.destroy({
        where: {},
        turncate: false
    }).then(nums => {
        console.log('nums ---', nums);
        res.send({ message: `${nums} Courses deleted successfully!`, code: 105 });
    }).catch(err => {
        return res.status(500).send({
            success: false,
            code: 505,
            message: 'Error occured while deleting all courses ' || err.message
        })
    })
}