module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        id: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
        },
        name: {
            type: Sequelize.STRING
        }
    });

    return Role;
};