const { DataTypes } = require("sequelize")
const sequelize = require("../utils/database").getSequelize

const DeviceType = sequelize.define(
    "DeviceType",
    {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        type: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false }
    },
    { freezeTableName: true, tableName: "chanst_device_types", timestamps: false }
)
DeviceType.bulkCreate([
    { id: 0, type: "sls_printer", name: "激光烧结打印" },
    { id: 1, type: "fdm_printer", name: "层叠打印机" },
    { id: 2, type: "sla_printer", name: "光固化打印" },
    { id: 3, type: "imm", name: "注塑机" },
    { id: 4, type: "sls_cleaner", name: "激光烧结清洗机" },
    { id: 5, type: "sla_cleaner", name: "光固化清洗机" },
    { id: 6, type: "cnc", name: "数控车床" },
    { id: 7, type: "sla_repository", name: "树脂仓库" },
    { id: 8, type: "sls_repository", name: "金属粉末仓库" },
    { id: 9, type: "imm_repository", name: "塑料仓库" },
    { id: 10, type: "packager", name: "打包机" }
]).catch(() => {})
module.exports = DeviceType
