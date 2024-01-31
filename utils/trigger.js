const Trigger = require("../models/Trigger")
const Component = require("../models/Component")
const database = require("./database")

module.exports = async (req, res, next) => {
    if (!("component_id" in req.body)) {
        res.status(400).send("param missing")
        return
    }
    const triggers = Trigger.findAll({ order: ["priority"] })
    for (const trigger of triggers) {
        const condition = JSON.stringify(trigger["condition"])
        const operation = JSON.stringify(trigger["operation"])
        let meetConditions = false
        if (req.body["value"] >= condition["min"] && req.body["value"] < condition["max"]) {
            switch (condition["mode"]) {
                case "component":
                    if (req.body["component_id"] === condition["target"]) meetConditions = true
                    break
                case "type":
                    const component = await Component.findByPk(req.body["component_id"])
                    if (component["type_id"] === condition["target"]) meetConditions = true
                    break
            }
        }
        if (meetConditions) {
            switch (operation["mode"]) {
                case "component":
                    database.memoryDatabase["component_set"][operation["target"]] = operation["value"]
                    break
                case "type":
                    const components = await Component.findAll({ where: { type_id: operation["target"] } })
                    for (const component of components)
                        database.memoryDatabase["component_set"][component["uuid"]] = operation["value"]
                    break
            }
        }
    }
    next()
}
