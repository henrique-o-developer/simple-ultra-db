const fs = require('fs')
var jf = require('json-format');
var config = {type: 'space', size: 4}

class commands {
    save(obj, del) {
        var url = obj.url.split(".")
        var data = JSON.parse(fs.readFileSync(obj.locale, 'utf8'))
        var evalstr = ""
        var brute = ""
        var opt = this.opt
        
        if (!opt) opt = defaultProtoObject.opt
        
        url.forEach((v, i) => {

            if (v != "") {
                brute += "['"+v+"']"
                if (del) {
                    evalstr += `if (!data${brute}) data${brute} = {};${i == url.length-1?`delete data${brute}`:""}`
                } else {
                    evalstr += `if (!data${brute}) data${brute} = {};${i == url.length-1?` data${brute} = ${JSON.stringify(obj.data)}`:""}`
                }
            }
           /*const if (remove) {
                evalstr += `${i == url.length-1?`if (data${brute}) delete data${brute}`:""}`
            } else {*/
            //}
        })
        
        eval(evalstr)
        
        fs.writeFileSync(obj.locale, jf(data, obj.opt.config));
    }
    
    get(query) {
        query = query + ""

        var q = query.split(".")
        var ret = this.data||{}
        
        q.forEach((v, i) => {
            ret = ret[v]
            
            if (ret == undefined && i+1 != q.length) {
                ret = {}
            }
        })

        var url

        if (this.url != "") {
            url = this.url + "." + query
        } else {
            url = query
        }

        var retu = new databaseValue(this.locale, this.opt, ret, url)

        ret.__proto__ = retu
        
        return this.opt.stacable?ret:ret.data
    }

    set(path, value) {
        if (path && value == undefined && this instanceof databaseValue) {
            if (path == undefined) {
                return new Error("value is undefined")
            }
    
            this.data = path
    
            this.save(this)
    
            return this.opt.stacable?this:this.data
        } else if (path && value) {
            path += ""
            var url 

            if (this.url == "") {
                url = path
            } else {
                url = this.url + "." + path
            }

            var obj = new databaseValue(this.locale, this.opt, value, url)

            this.save(obj)

            return this.opt.stacable?obj:obj.data
        } else if (!path && value == undefined) {
            return new Error("path is null or value is undefined")
        }
    }

    has(path) {
        path = path + ""

        if (path) {
            var data = this.data

            path.split(".").forEach(v => {
                if (!data) {
                    return false
                }

                data = data[v]
            })

            return data != undefined
        } else {
            return this.data != undefined
        }
    }

    push(path, value) {
        if (path && value == undefined && this instanceof databaseValue) {
            if (this.data.push) {
                this.data.push(path)
    
                this.save(this)
            } else {
                return new Error("push is only for arrays")
            }
    
            return this.opt.stacable?this:this.data
        } else if (path && value) {
            path += ""
            var r = this.data

            path.split(".").forEach((v, i) => {
                r = r[v]

                if (r == undefined && i != path.split(".").length-1) {
                    r = {}
                }
            })

            if (r == undefined) {
                return new Error("the path is invalid or not is a array")
            }

            if (r.push) {
                r.push(value)

                this.save(new databaseValue(this.locale, this.opt, r, path))

                return this.opt.stacable?this:this.data
            } else {
                return new Error("value is undefined")
            }
        } else if (!path && value == undefined) {
            return new Error("path is null and value is undefined")
        }
    }

    delete(path) {
        path = path + ""

        if (path) {
            var url 

            if (this.url == "") {
                url = path
            } else {
                url = this.url + "." + path
            }

            this.save(new databaseValue(this.locale, this.opt, "", url), true)

            return true
        } else {
            this.save(this, true)

            return true
        }
    }
}

class databaseInteraction extends commands {
    constructor(locale, opt) {
        super()
        if (!opt) opt = {}
        if (!opt.default) opt.default = {}
        if (!opt.config) opt.config = config 
        if (opt.stacable == undefined) opt.stacable = false
        
        if (!locale) {
            return console.error("locale is not defined")
        }
        
        if (locale.endsWith("/")) {
            return console.error("locale ends with /")
        }
        
        if (!locale.endsWith(".json")) locale += ".json"
        
        
        var dirs = locale.split("/").slice(0, locale.split("/").length - 1).join("/")
        
        if (!fs.existsSync(dirs)){
            fs.mkdirSync(dirs, { recursive: true });
        }
        
        if (fs.existsSync(locale)) {
            this.data = JSON.parse(fs.readFileSync(locale, 'utf8'))
        } else {
            this.data = opt.default
            fs.writeFileSync(locale, jf(opt.default, opt.config));
        }
        
        this.opt = opt
        this.locale = locale
        this.url = ""
    }
}

class databaseValue extends commands {
    constructor(locale, opt, data, url) {
        super()
        this.url = url;
        this.opt = opt
        this.locale = locale
        this.data = data;
    }

    toString() {
        return JSON.stringify(data)+""
    }
}

module.exports = databaseInteraction