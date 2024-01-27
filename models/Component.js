const { DataTypes } = require("sequelize")
const sequelize = require("../utils/database").getSequelize
const ComponentType = require("./ComponentType")
const Device = require("./Device")

module.exports = sequelize.define(
    "Component",
    {
        uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        device_id: { type: DataTypes.UUID, allowNull: false, references: { model: Device, key: "uuid" } },
        parent_id: { type: DataTypes.UUID, allowNull: false },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: ComponentType, key: "id" }
        },
        status: { type: DataTypes.INTEGER, allowNull: false },
        owner_id: { type: DataTypes.UUID, allowNull: false },
        position: { type: DataTypes.STRING, allowNull: true },
        worktime: { type: DataTypes.STRING, allowNull: false, defaultValue: 0 }
    },
    { freezeTableName: true, tableName: "chanst_components" }
)
