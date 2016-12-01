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

    var consumers = consumerFactory.createConsumers(options.consumers) || [],
        producers = producerFactory.createProducers(options.producers) || [];

    function values(name, i, obj) {
        return obj[name];
    }

    function closer(resource, next) {
        resource.close(next);
    }

    function close(cb) {
        var resources = consumers.map(values).concat(producers.map(values));
        aync.each(resources, closer, cb);
    }

    async.every(producers.map(values), function (p, next) {
        p.once('ready', next);
    }, function then(err) {
        register(err, {
            onDestroy: close,
            kafka: {
                consumers: consumers,
                producers: producers
            }
        });
    });
};

module.exports.consumes = ['log'];
module.exports.provides = ['kafka'];
