'use strict';

var kafka = require('kafka-node');

function KafkaOffsetFactory(kafkaClientFactory, logger) {
    this.clientFactory = kafkaClientFactory;
    this.logger = logger;
}

KafkaOffsetFactory.prototype.createOffset = function (consumer) {
    if (!consumer) return null;
    this.logger.debug('Create Kafka Offset');
    const client = this.clientFactory.getClient(consumer.client);
    const offset = new kafka.Offset(client);
    return offset;
};

module.exports = KafkaOffsetFactory;
