# architect-kafka [![NPM version](https://img.shields.io/npm/v/architect-kafka.svg)](https://www.npmjs.com/package/architect-kafka)

Expose [kafka-node](https://github.com/SOHU-Co/kafka-node) as architect plugin

### Installation

```sh
npm install --save architect-kafka
```

### Config Format 

```js
{
}
```

### Usage

Boot [Architect](https://github.com/c9/architect) :

```js
var path = require('path');
var architect = require("architect");

var configPath = path.join(__dirname, "config.js");
var config = architect.loadConfig(configPath);

architect.createApp(config, function (err, app) {
    if (err) {
        throw err;
    }
    console.log("app ready");
});
```
