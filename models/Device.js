const { DataTypes } = require("sequelize")
const sequelize = require("../utils/database").getSequelize
const DeviceType = require("./DeviceType")

module.exports = sequelize.define(
    "Device",
    {
        uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        type_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: DeviceType, key: "id" } },
        name: { type: DataTypes.STRING },
        owner_id: { type: DataTypes.UUID, allowNull: false },
        position: { type: DataTypes.STRING, allowNull: true },
        health: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },
        worktime: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 } //单位小时
    },
    { freezeTableName: true, tableName: "chanst_devices" }
)
