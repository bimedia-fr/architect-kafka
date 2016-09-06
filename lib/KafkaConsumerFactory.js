/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var kafka = require('kafka-node');

function KafkaConsumerFactory(kafkaClientFactory, logger) {
    this.clientFactory = kafkaClientFactory;
    this.logger = logger;
}

KafkaConsumerFactory.prototype.createConsumer = function (consumer) {
    this.logger.debug('Create Kafka Consumer', consumer.payloads);
    var client = this.clientFactory.getClient(consumer.client);
    return new kafka.Consumer(client, consumer.payloads, consumer.options);
};

KafkaConsumerFactory.prototype.createHighLevelConsumer = function (consumer) {
    this.logger.debug('Create Kafka HighLevelConsumer', consumer.payloads);
    var client = this.clientFactory.getClient(consumer.client);
    return new kafka.HighLevelConsumer(client, consumer.payloads, consumer.options);
};

KafkaConsumerFactory.prototype.createConsumers = function (consumersConfig) {
    var consumers = {};
    var names = Object.keys(consumersConfig || []);
    var self = this;
    names.forEach(function (name) {
        self.logger.debug('Consumer config found for ' + name);
        var func = consumersConfig[name].highLevel ? self.createHighLevelConsumer : self.createConsumer;
        consumers[name] = func.call(self, consumersConfig[name]);
    });
    return consumers;
};

module.exports = KafkaConsumerFactory;
