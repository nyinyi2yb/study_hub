module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define('course', {
        id: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
        },
        courseTitle: {
            type: Sequelize.STRING
        },
        courseDescription: {
            type: Sequelize.STRING
        },
        images: {
            type: Sequelize.STRING
        }
    });
    return Course;
}