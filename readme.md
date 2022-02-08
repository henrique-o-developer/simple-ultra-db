# commands

## create a db

```js
    var db = new simpleUltraDb("./database/Itens.json", args)
```

or

```js
    var db = new simpleUltraDb("./database/Itens", args)
```

  **args:**
    _config, param for json-formater, default: {type: 'space', size: 4}_
    _default, value added on empty db, default: {}_

## get an item from db

```js
    db.get("itemname").get("itemname")
```

or

```js 
    db.get("itemname.itemname")
```

## set a item on db

```js
    db.setByPath("item.item", "more one item")
```

or 

```js
    db.get("item.item").set("more one item")
```

## view if item exist on db

```js
    db.has("item.item")
```

or

```js
    db.get("item.item").has()
```

## push a iten in array in db

```js
    db.pushByPath("item.array", "item")
```

or

```js
    db.get("item.array").push("item")
```

## delete a key of db

```js
    db.delete("all.deleteThis")
```

or

```js
    db.get("all.deleteThis").delete()
```

or

```js
    db.get("all").delete("deleteThis")
```
