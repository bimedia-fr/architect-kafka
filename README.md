# architect-kafka [![NPM version](https://img.shields.io/npm/v/architect-kafka.svg)](https://www.npmjs.com/package/architect-kafka)

Expose [kafka-node](https://github.com/SOHU-Co/kafka-node) as architect plugin

### Installation

```sh
npm install --save architect-kafka
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

Configure Architect with `config.js` :

See [kafka-node documentation](https://github.com/SOHU-Co/kafka-node#client) for Client options  
See [kafka-node documentation](https://github.com/SOHU-Co/kafka-node#consumer) for Consumer options  
See [kafka-node documentation](https://github.com/SOHU-Co/kafka-node#producer) for Producer options  

```js
module.exports = [
	{
		packagePath: 'architect-kafka',
		client: { // Optional, default client
			// See kafka-node documentation for Client options
			connectionString: 'localhost:2181', // Default localhost:2181
		},
		consumers: {
			// Create a HighLevelConsumer using custom client, consuming from topics topicName1 and topicName2
			consumer1: {
				// Consumer type  [HighLevel|ConsumerGroup], optional default to Consumer
				type: HighLevel, 
				// See kafka-node documentation for Client options
			    client: {
			        connectionString: 'localhost:2181',
			        clientId: 'architect-kafka-client'
			    },
				// See kafka-node documentation for Consumer options
			    payloads: [
			        {
			            topic: 'topicName1',
			            offset: 0
			        },
			        {
			            topic: 'topicName2',
			            offset: 10
			        }
			    ],
			    options: {
			        groupId: 'kafka-node-group'
			    }
		    },
			// Create Consumer using default client
		    consumer2: {
		        payloads: [
		            {
		                topic: 'topicName1',
		                offset: 0
		            }
		        ],
		        options: {}
		    }
		},
		producers: {
			// Create a HighLevelProducer using custom client
		    producer1: {
		        highLevel: true, // Use HighLevelproducer instead of Producer, default false
				// See kafka-node documentation for Client options
		        client: {
		            connectionString: 'localhost:2181',
		            clientId: 'architect-kafka-client'
		        },
				// See kafka-node documentation for Producer options
		        options: {}
		    },
			// Create a regular Kafka Producer using default client
		    producer2: {}
		}
	}
];
```

Use it :

See [kafka-node documentation](https://github.com/SOHU-Co/kafka-node#consumer) for Consumer usage  
See [kafka-node documentation](https://github.com/SOHU-Co/kafka-node#producer) for Producer usage  

```js
module.exports = function setup(options, imports, register) {

    var kafka = imports.kafka;

	var producer1 = kafka.producers.producer1;
	var consumer2 = kafka.consumers.consumer2;

	producer1.send([
		{
			topic: 'topicName1',
			message: ['hello world !']
		}
	], function(err, res) {
		...	
	});

	consumer2.on('message', function(message) {
		...
	});
   
    register();
};

module.exports.consumes = ['kafka'];
module.exports.provides = [];
```
