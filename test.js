var i = require("./index.js")
const levelDB = new i(__dirname+"/database/Level.json");


levelDB.set("all", ["a", "b"])
console.log(levelDB.get("all"))