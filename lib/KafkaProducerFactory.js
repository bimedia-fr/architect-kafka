/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var kafka = require('kafka-node');

function KafkaProducerFactory(kafkaClientFactory, logger) {
    this.clientFactory = kafkaClientFactory;
    this.logger = logger;
}

KafkaProducerFactory.prototype.createProducer = function (producer) {
    this.logger.debug('Create Kafka Producer');
    var client = this.clientFactory.getClient(producer.client);
    return new kafka.Producer(client, producer.options);
};

KafkaProducerFactory.prototype.createHighLevelProducer = function (producer) {
    this.logger.debug('Create Kafka HighLevelProducer');
    var client = this.clientFactory.getClient(producer.client);
    return new kafka.HighLevelProducer(client, producer.options);
};

KafkaProducerFactory.prototype.createProducers = function (producersConfig) {
    var producers = {};
    var names = Object.keys(producersConfig || []);
    var self = this;	    
    names.forEach(function (name) {
        self.logger.debug('Producer config found for ' + name);
        var func = producersConfig[name].highLevel ? self.createHighLevelProducer : self.createProducer;
        producers[name] = func(producersConfig[name]);
    });
    return producers;
};

module.exports = KafkaProducerFactory;
