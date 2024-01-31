const { Sequelize } = require("sequelize")
const logger = require("./logger")
const time = require("./time")

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    timezone: time.getTimezoneShift(),
    logging: (msg) => logger.debug(msg)
})
sequelize.sync({ alter: true }).then()
module.exports.getSequelize = sequelize

const Log = require("../models/Log")
const Device = require("../models/Device")
const Component = require("../models/Component")

memory_db = {}
module.exports.memoryDatabase = memory_db

module.exports.updateStatus = async (type, uuid) => {
    const types = { device: Device, component: Component }
    const lastHeartbeatTime = await Log.findOne({
        attributes: ["createdAt"],
        where: {
            type: type + "_heartbeat",
            target: uuid
        },
        order: ["createdAt", "DESC"]
    })
    const timeDiff = Math.abs(new Date() - lastHeartbeatTime)
    if (timeDiff > 5000) {
        await types[type].update({ status: false }, { where: { uuid: uuid } })
    } else {
        await types[type].update({ status: true }, { where: { uuid: uuid } })
    }
}
