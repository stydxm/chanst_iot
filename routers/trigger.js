const router = require("express").Router()
const Component = require("../models/Component")
const ComponentType = require("../models/ComponentType")
const Trigger = require("../models/Trigger")

router.get("/list", async (req, res) => {
    const count = await Trigger.count()
    const page = req.query["page"] || 1
    if (count !== 0 && count > (page - 1) * 50) {
        res.send(Trigger.findAll({ offset: (page - 1) * 50, limit: 50 }))
    } else {
        res.send("{}")
    }
})

router.post("/create", (req, res) => {
    const params = ["condition", "operation", "priority"]
    for (const param of params) {
        if (!(param in req.body)) {
            res.status(400).send("param missing")
            return
        }
    }
    let brokenParams = false
    try {
        const condition = JSON.stringify(req.body["condition"])
        condition["max"] = parseFloat(condition["max"].toString())
        condition["min"] = parseFloat(condition["min"].toString())
        const operation = JSON.stringify(req.body["operation"])
        operation["value"] = parseFloat(operation["value"].toString())
        if (condition["max"] < condition["min"] || isNaN(condition["max"]) || isNaN(condition["min"]))
            brokenParams = true
        switch (condition["mode"]) {
            case "component":
                const component = Component.findByPk(condition["target"])
                if (component === undefined) brokenParams = true
                break
            case "type":
                const componentType = ComponentType.findByPk(condition["target"])
                if (componentType === undefined) brokenParams = true
                break
            default:
                brokenParams = true
        }
        switch (operation["mode"]) {
            case "component":
                const component = Component.findByPk(operation["target"])
                if (component === undefined) brokenParams = true
                break
            case "type":
                const componentType = ComponentType.findByPk(operation["target"])
                if (componentType === undefined) brokenParams = true
                break
            default:
                brokenParams = true
        }
    } catch {
        brokenParams = true
    }
    if (brokenParams) {
        res.status(400).send("wrong param")
        return
    }
    Trigger.create({
        condition: req.body["condition"],
        operation: req.body["operation"],
        priority: req.body["priority"]
    })
        .then(() => {
            res.send("ok")
        })
        .catch(() => {
            res.status(400).send("wrong param")
        })
})

router.post("/delete", async (req, res) => {
    if ("uuid" in req.body) {
        if ((await Trigger.findByPk(req.body["uuid"])) !== undefined) {
            await Trigger.destroy({ where: { uuid: req.body["uuid"] } }).then(() => {
                res.send("ok")
            })
        } else {
            res.status(404).send("not found")
        }
    } else {
        res.status(400).send("param missing")
    }
})

router.post("/toggle", async (req, res) => {
    if ("uuid" in req.body && "status" in req.body) {
        if ((await Trigger.findByPk(req.body["uuid"])) !== undefined) {
            await Trigger.update({ enable: req.body["status"] === "on" }, { where: { uuid: req.body["uuid"] } }).then(
                () => {
                    res.send("ok")
                }
            )
        } else {
            res.status(404).send("not found")
        }
    } else {
        res.status(400).send("param missing")
    }
})

module.exports = router
