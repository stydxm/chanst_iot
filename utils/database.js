const { Sequelize } = require("sequelize")
const logger = require("./logger")
const time = require("./time")

sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    timezone: time.getTimezoneShift(),
    logging: (msg) => logger.debug(msg)
})

sequelize.sync({ alter: true }).then()

module.exports.getSequelize = sequelize
