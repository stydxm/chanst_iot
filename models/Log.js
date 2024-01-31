const { DataTypes } = require("sequelize")
const sequelize = require("../utils/database").getSequelize

module.exports = sequelize.define(
    "Log",
    {
        uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        type: { type: DataTypes.STRING, allowNull: false },
        operator: { type: DataTypes.STRING, allowNull: false },
        target: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" }
    },
    { freezeTableName: true, tableName: "chanst_logs", updatedAt: false }
)
