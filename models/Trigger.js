const { DataTypes } = require("sequelize")
const sequelize = require("../utils/database").getSequelize

module.exports = sequelize.define(
    "Trigger",
    {
        uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        condition: { type: DataTypes.STRING, allowNull: false },
        operation: { type: DataTypes.STRING, allowNull: false },
        priority: { type: DataTypes.INTEGER, allowNull: false },
        enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    { freezeTableName: true, tableName: "chanst_triggers" }
)
