/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var kafka = require('kafka-node');

function KafkaConsumerFactory(kafkaClientFactory, logger) {
    this.clientFactory = kafkaClientFactory;
    this.logger = logger;
}

function toTopics(payloads) {
    return (payloads || []).map(function (payload) {
        return payload.topic;
    });
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

KafkaConsumerFactory.prototype.createConsumerGroupConsumer = function (consumer) {
    this.logger.debug('Create Kafka ConsumerGroup', consumer.groupId);
    var opts = Object.assign(consumer.options, consumer.client);
    return new kafka.ConsumerGroup(opts, toTopics(consumer.payloads));
};

KafkaConsumerFactory.prototype.createConsumers = function (consumersConfig) {
    var consumers = {};
    var self = this;
    return Object.keys(consumersConfig || []).reduce(function (consumers, name) {
        var type = consumersConfig[name].type || '';
        self.logger.debug('Consumer config for', name);
        if (type && !/HighLevel|ConsumerGroup/.exec(type)) {
            self.logger.error('unknown consumer type', type);
            return consumers;
        }
        consumers[name] = self['create' + type + 'Consumer'].call(self, consumersConfig[name]);
        return consumers;
    }, {});
};

module.exports = KafkaConsumerFactory;
