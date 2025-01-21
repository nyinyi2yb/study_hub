module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const controller = require('../controllers/course.controller');

    //add course
    router.post('/', controller.createCourse);

    //get couses
    router.get('/', controller.getAllCourses);

    //get course by id
    router.get('/:id', controller.findById);

    //update course
    router.put('/:id', controller.updateCourse);

    //delete course
    router.delete('/:id', controller.deleteCourse);

    //delete all courses
    router.delete('/', controller.deleteAll);

    app.use('/api/courses', router);
}