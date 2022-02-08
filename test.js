var i = require("./index.js")
var db = new i("./database/Itens.json")

//console.log(db, db.get("all"), db.get("all").get("all"), db.get("all.all"))

console.log(db.set(82743821783, {level: 1, xp: 0}))

/*db.setByPath("try.try", "catch")

console.log(db.get("all.all.all").has(), db.get("all").has(), db.has("all.all.all"), db.has("all"))

var v = db.setByPath("test-push", [])

console.log(v)

console.log(db.pushByPath("test-push", "hehe"))

db.delete("all")*/
