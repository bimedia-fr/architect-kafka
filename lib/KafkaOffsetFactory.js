/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var kafka = require('kafka-node');

function KafkaOffsetFactory(kafkaClientFactory, logger) {
    this.clientFactory = kafkaClientFactory;
    this.logger = logger;
}

KafkaOffsetFactory.prototype.createOffset = function (consumer) {
    if (!consumer) return null;
    this.logger.debug('Create Kafka Offset');
    var client = this.clientFactory.getClient(consumer.client);
    var offset = new kafka.Offset(client);
    return offset;
};

module.exports = KafkaOffsetFactory;
