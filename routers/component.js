const router = require("express").Router()
const Device = require("../models/Device")
const Component = require("../models/Component")
const Log = require("../models/Log")
const account = require("../utils/account")
const database = require("../utils/database")

router.get("/listall", async (req, res) => {
    const count = await Component.count()
    const page = req.query["page"] || 1
    if (count !== 0 && count > (page - 1) * 50) {
        res.send(await Component.findAll({ offset: (page - 1) * 50, limit: 50 }))
    } else {
        res.send("{}")
    }
})

router.get("/list", async (req, res) => {
    if ("device_id" in req.query) {
        const count = await Component.count({ where: { device_id: req.query["device_id"] } })
        if (count !== 0) {
            res.send(await Component.findAll({ where: { device_id: req.query["device_id"] } }))
        } else {
            res.send("{}")
        }
    } else {
        res.status(400).send("param missing")
    }
})

router.post("/create", (req, res) => {
    const params = ["device_id", "component_name", "type_id", "token"]
    for (const param of params) {
        if (!(param in req.body)) {
            res.status(400).send("param missing")
            return
        }
    }
    const owner = account.getUsername(req.body["token"])
    if (owner !== undefined) {
        // 验证token
        const device = Device.findOne({ where: { uuid: req.body["device_id"], owner_id: owner } })
        if (device != null) {
            Component.create({
                device_id: req.body["device_id"],
                component_name: req.body["component_name"],
                type_id: req.body["type_id"],
                parent_id: req.body["parent_id"] || account.defaultUuid
            })
                .then(() => {
                    res.send("ok")
                })
                .catch(() => {
                    res.status(400).send("wrong param")
                })
        }
    } else {
        res.status(403).send("invalid token")
    }
})

router.get("/query", async (req, res) => {
    if ("component_id" in req.query) {
        const component = await Component.findByPk(req.query["component_id"])
        if (component == null) {
            await database.updateStatus("component", component["uuid"])
            res.status(404).send("not found")
        } else {
            res.send(component)
        }
    } else {
        res.status(400).send("param missing")
    }
})

router.post("/set", (req, res) => {
    const params = ["component_id", "value", "token"]
    for (const param of params) {
        if (!(param in req.body)) {
            res.status(400).send("param missing")
            return
        }
    }
    const owner = account.getUsername(req.body["token"])
    if (owner !== undefined) {
        // 验证token
        database.memoryDatabase["component_set"][req.body["component_id"]] = req.body["value"]
        res.send("ok")
    } else {
        res.status(403).send("invalid token")
    }
})

router.get("/update", (req, res) => {
    if ("component_id" in req.query) {
        if (req.query["component_id"] in database.memoryDatabase["component_set"]) {
            res.send(database.memoryDatabase["component_set"][req.query["component_id"]])
        } else {
            res.status(404).send("not setted")
        }
    } else {
        res.status(400).send("param missing")
    }
})

router.use("/online", require("../utils/trigger"))
router.post("/online", async (req, res) => {
    const component = await Component.findByPk(req.body["component_id"])
    if (component !== undefined) {
        Log.create({
            type: "component_heartbeat",
            operator: req.ip,
            target: req.body["component_id"],
            content: req.body["value"]
        })
            .then(() => {
                Log.create({
                    type: "device_heartbeat",
                    operator: req.ip,
                    target: component["device_id"]
                })
            })
            .then(() => {
                Component.update({ value: req.body["value"] }, { where: { uuid: req.body["component_id"] } })
            })
            .then(() => {
                res.send("ok")
            })
    } else {
        res.status(404).send("component not found")
    }
})

module.exports = router
