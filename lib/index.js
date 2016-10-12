/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var async = require('async');
var KafkaClientFactory = require('./KafkaClientFactory.js');
var KafkaConsumerFactory = require('./KafkaConsumerFactory.js');
var KafkaProducerFactory = require('./KafkaProducerFactory.js');

module.exports = function setup(options, imports, register) {

    var log = imports.log.getLogger(options.name || 'architect-kafka');

    var clientFactory = new KafkaClientFactory(options.client || {}, log);
    var consumerFactory = new KafkaConsumerFactory(clientFactory, log);
    var producerFactory = new KafkaProducerFactory(clientFactory, log);
    var clients = clientFactory.clients;

    function close(cb) {
        async.each(clients, function (client, next) {
            client.close(next);
        }, cb);
    }

    async.every(clients, function (client, next) {
        client.once('ready', next);
    }, function then(err) {
        register(err, {
            onDestroy: close,
            kafka: {
                consumers: consumerFactory.createConsumers(options.consumers),
                producers: producerFactory.createProducers(options.producers)
            }
        });
    });
};

module.exports.consumes = ['log'];
module.exports.provides = ['kafka'];
