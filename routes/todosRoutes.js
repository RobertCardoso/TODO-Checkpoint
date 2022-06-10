const express = require("express")
let router = new express.Router()
let controller = require("../controllers/todosCtrl")

// get summary of items
router.get("/todos",controller.itemsSummary)

// get detail of a single item
router.get("/todos/:id", controller.itemDetails)

//create new item
router.post("/todos/:id", controller.createItem)

// update an item, given its id
router.put("/todos/:id", controller.updateItem)

//delete an item, given its id
router.delete("/todos/:id", controller.deleteItem)

module.exports= router