const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config()
const logger = require("./utils/logger")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require("./routers/log"))
app.use("/device", require("./routers/device"))
app.use("/component", require("./routers/component"))
app.use("/trigger", require("./routers/trigger"))

app.listen(process.env.PORT || 3000, () => {
    logger.info("starting server")
})
