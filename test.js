var i = require("./index.js")
const levelDB = new i(__dirname+"/database/Level.json", {stacable: false});


levelDB.set("all", {try: {}})
console.log(levelDB.get("all").try)