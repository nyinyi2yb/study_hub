module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        profileImage: {
            type: Sequelize.STRING
        }
    });

    return User;
};