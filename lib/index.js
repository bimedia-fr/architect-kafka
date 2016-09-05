/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var KafkaClientFactory = require('./KafkaClientFactory.js');
var KafkaConsumerFactory = require('./KafkaConsumerFactory.js');
var KafkaProducerFactory = require('./KafkaProducerFactory.js');

module.exports = function setup(options, imports, register) {

    var log = imports.log.getLogger(options.name || 'architect-kafka');

    var clientFactory = new KafkaClientFactory(options.client || {}, log);
    var consumerFactory = new KafkaConsumerFactory(clientFactory, log);
    var producerFactory = new KafkaProducerFactory(clientFactory, log);

    register(null, {
        kafka: {
            consumers: consumerFactory.createConsumers(options.consumers),
            producers: producerFactory.createProducers(options.producers)
        }
    });
};

module.exports.consumes = ['log'];
module.exports.provides = ['kafka'];