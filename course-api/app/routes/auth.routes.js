const { verifySignUp } = require("../middleware");
const { addUserValidation } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup", [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted,
        ], [addUserValidation.addUserValidation], controller.signup
    );

    app.post("/api/auth/signin", controller.signin);

    app.post("/api/auth/refreshtoken", controller.refreshToken);

    app.get("/api/auth/", controller.findByUsername);

    // app.get("/api/users/:id", controller.getUser);

    app.put("/api/auth/:id", controller.updateUser);

    app.get("/api/auth/roles", controller.findRoles);

    app.get("/api/auth/:id", controller.changeRole);

    // app.post("/api/auth/createroles", controller.createRoles);

    app.delete('/api/auth/user/:id', controller.delete);

    app.delete('/api/auth/users', controller.deleteUser);


};