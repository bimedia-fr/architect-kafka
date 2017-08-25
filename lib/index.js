/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var async = require('async');
var kafka = require('kafka-node');

var KafkaClientFactory = require('./KafkaClientFactory.js');
var KafkaConsumerFactory = require('./KafkaConsumerFactory.js');
var KafkaProducerFactory = require('./KafkaProducerFactory.js');
var KafkaOffsetFactory = require('./KafkaOffsetFactory.js');

module.exports = function setup(options, imports, register) {

    var log = imports.log.getLogger(options.name || 'architect-kafka');

    var clientFactory   = new KafkaClientFactory(options.client || {}, log);
    var offsetFactory   = new KafkaOffsetFactory(clientFactory, log);
    var consumerFactory = new KafkaConsumerFactory(clientFactory, log);
    var producerFactory = new KafkaProducerFactory(clientFactory, log);
    

    var consumers   = consumerFactory.createConsumers(options.consumers),
        producers   = producerFactory.createProducers(options.producers),
        offset      = offsetFactory.createOffset(options.consumers);

    function values(obj) {
        return Object.keys(obj).map(function (name) {
            return obj[name];
        });
    }

    function closer(resource, next) {
        resource.close(next);
    }

    function close(cb) {
        var resources = values(consumers).concat(values(producers));
        async.each(resources, closer, cb);
    }

    var toRegister = {
        onDestroy: close,
        kafka: {
            consumers: consumers,
            producers: producers,
            offset: offset,
            classes: {}
        }
    };

    Object.keys(kafka).forEach(function (clazz) {
        toRegister.kafka.classes[clazz] = kafka[clazz];
    });

    async.every(values(producers), function (p, next) {
        p.once('ready', next);
    }, function then(err) {
        register(err, toRegister);
    });
};

module.exports.consumes = ['log'];
module.exports.provides = ['kafka'];
