const { DataTypes } = require("sequelize")
const sequelize = require("../utils/database").getSequelize

const ComponentType = sequelize.define(
    "ComponentType",
    {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        type: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        note: { type: DataTypes.STRING, allowNull: true }
    },
    { freezeTableName: true, tableName: "chanst_component_types", timestamps: false }
)
ComponentType.bulkCreate([
    { id: 0, type: "temperature_sensor", category: "sensor", name: "温度传感器", note: "单位C" },
    { id: 1, type: "pressure_sensor", category: "sensor", name: "压力传感器", note: "单位kpa" },
    { id: 2, type: "tof_sensor", category: "sensor", name: "距离传感器", note: "单位mm" },
    { id: 3, type: "key_sensor", category: "sensor", name: "开关传感器", note: "no单位" },
    { id: 4, type: "motor_controller", category: "operator", name: "电机", note: "控制0-100%" },
    { id: 5, type: "heater", category: "operator", name: "加热器", note: "控制0-100%" },
    { id: 6, type: "preesure_controller", category: "operator", name: "压力控制器", note: "控制0-100%" },
    { id: 7, type: "speaker", category: "operator", name: "蜂鸣器" },
    { id: 8, type: "key_controller", category: "operator", name: "开关（继电器）" }
]).catch(() => {})
module.exports = ComponentType
