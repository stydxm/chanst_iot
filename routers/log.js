const logger = require("../utils/logger")
const Log = require("../models/Log")

module.exports = (req, res, next) => {
    const data = {
        type: "http",
        operator: req.ip,
        target: req.originalUrl,
        content: JSON.stringify(req.body)
    }
    logger.info(JSON.stringify(data))
    Log.create(data)
    next()
}
