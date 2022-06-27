let db = require("../model/db.js")

// function to return a summary of the item on the response
let itemsSummary = function(req, res){
    console.log("itemsSummary")

    let sql = "select * from todos"

    db.query(sql, function(err, results){
        if (err){
            console.log("could not execute the query", err);
            res.sendStatus(400);
        } else {
            // for the is_done column, the databse returns 1, 0 or null
            // but we want to surface that as true or false
            for(let i=0; i<results.length; i++){
                let result = results[i]
                if(result.is_done){
                    results.is_done = true;
                } else {
                    results.is_done = false;
                }
            }

            res.json(results)
        }
    })
}

// function to return the detail of a single item on the response
let itemDetails = function(req, res){
    console.log("itemDetails")
    
    let id = req.params.id;

    // when a sql statement uses ?, this called parameterized SQL
    let sql = "select id, task, description, is_done from todos where id = ?"
    let params = [] // this array will hold the params for our sql statement
    params.push(id) // this is the first param in the sql statement

    // BAD WAYYY, susptible to sql injection, please do not do this
    // let badSql = "select id, task, description, is_done from todos where id = "+id;

    db.query(sql, params, function(err, results){
        if(err){
            console.log("failed to execute query", err)
            res.sendStatus(500) // it is not the clients fault the query failed
        } else {
            if(results.length == 1){

                let result = results[0]
                if(result.is_done){
                    result.is_done = true
                } else {
                    result.is_done = false
                }
                res.json(results[0])
            } else if (results.length > 1){
                console.log("found more that onde result for id", id);
                res.sendStatus(500) // we send a 500 because this is server bug. no the clients fault
            } else {
                // if the results is 0
                res.sendStatus(404) // NOT FOUND
                // res.json(null) if you dont want to send a error

            }
        }

    })
}

/*
   {
       "task": "asdasdada",         --- this cannot be empty
       "description": "aqweqeqweqweqweqw"
   }
*/

// function to create a new item
let createItem = function(req, res){
    console.log("createItem")
    
    let input = req.body
    let task = input.task;
    let description = input.description

    if(!task){
        res.status(400).send("task is required")
        return 
    }

    // we are using parameterized sql again, to avoid sql injection
    // we should always use parameterized sql when accepting input from the client
    // and using it in the sql statement. because we DO NOT TRUST THE CLIENT
    let sql = "insert into todos(task, description) values (?, ?);"
    let params = [task, description];

    db.query(sql, params, function(err, results){
        if (err){
            console.log("Could not execute sql insert", err)
            res.sendStatus(500)
        } else {
            res.sendStatus(204) // we do not have anything to return, but we want to let the client know that everything went ok
        }

    })
}

/*
   {
       "task": "asdasdada",      --required
       "description": "aqweqeqweqweqweqw"
       is_done: true / false
   }
*/

// function to update an item
let updateItem = function(req, res){
    console.log("updateItem")
    
    //get id from the path parameter
    let id = req.params.id;
    let body = req.body
    
    let task = body.task
    let description = body.description
    let isDone = body.is_done

    // make sure task is set in the body
    if(!task){
        res.status(400).send("task is required")
        return
    }

    // force the client to send true or false for the is_done attribute
    if(isDone != true && isDone != false){
        res.status(400).send("is_done must be either true or false")
        return
    }

    let isDoneint
    if (isDone == true){
        isDoneint = 1
    } else {
        isDoneint = 0
    }

    let sql = "update todos set task = ?, description = ?, is_done = ? where id = ?"
    let params = [task, description, isDoneint, id];

    db.query(sql, params, function(err, results){
        if (err){
            console.log("cannot execute update sql", err)
            res.sendStatus(500) // this is not the clients fault
        } else {
            res.sendStatus(204) // no data to send back, but we want to let the client knnow that everything went ok
        }
    })

}

// function to delete an item
let deleteItem = function(req, res){
    console.log("deleteITem");

    let id = req.params.id;

    let sql = "delete from todos where id = ?"
    let params = [id]

    db.query(sql, params, function(err, results){
        if(err){
            console.log("failed to delete item with id"+id,err)
            res.sendStatus(500)
        } else {
            res.sendStatus(204) // nothing to send back, but the ok status
        }
    })

}

module.exports = {
    itemDetails, itemsSummary, createItem, updateItem, deleteItem
}