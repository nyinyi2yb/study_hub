const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

const courseController = require('../controllers/course.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);

    app.get(
        "/api/test/user", [authJwt.verifyToken],
        controller.userBoard,
    );

    app.get(
        "/api/test/mod", [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        "/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );

    app.get(
        "/api/test/courses", [authJwt.verifyToken],
        controller.getMyCourses
    );

    app.get(
        "/api/test/findcourses", [authJwt.verifyToken],
        controller.findCourse
    );

    // verify token & expired date 
    app.get("/api/test/token", [authJwt.verifyToken], controller.token);
};