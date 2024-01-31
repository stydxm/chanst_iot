const router = require("express").Router()
const Device = require("../models/Device")
const account = require("../utils/account")
const database = require("../utils/database")

router.get("/list", async (req, res) => {
    const count = await Device.count()
    const page = req.query["page"] || 1
    if (count !== 0 && count > (page - 1) * 50) {
        res.send(await Device.findAll({ offset: (page - 1) * 50, limit: 50 }))
    } else {
        res.send("{}")
    }
})

router.post("/create", (req, res) => {
    const params = ["device_name", "type_id", "token"]
    for (const param of params) {
        if (!(param in req.body)) {
            res.status(400).send("param missing")
            return
        }
    }
    const owner = account.getUsername(req.body["token"])
    if (owner !== undefined) {
        //验证token
        Device.create({
            name: req.body["device_name"],
            type_id: req.body["type_id"],
            owner_id: owner["uuid"]
        })
            .then(() => {
                res.send("ok")
            })
            .catch(() => {
                res.status(400).send("wrong param")
            })
    } else {
        res.status(403).send("invalid token")
    }
})

router.get("/query", async (req, res) => {
    if ("device_id" in req.query) {
        const device = await Device.findByPk(req.query["device_id"])
        if (device == null) {
            res.status(404).send("not found")
        } else {
            await database.updateStatus("device", device["uuid"])
            res.send(device)
        }
    } else {
        res.status(400).send("param missing")
    }
})

module.exports = router
