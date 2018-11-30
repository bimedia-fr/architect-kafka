'use strict';

var kafka = require('kafka-node');

function KafkaClientFactory(defaults, logger) {
    this.defaults = defaults;
    this.defaultClient = null;
    this.logger = logger;
}

KafkaClientFactory.prototype.getClient = function (client) {
    if (!client) {
        return this._getDefaultClient();
    }
    return this._createClient(client);
};

KafkaClientFactory.prototype._getDefaultClient = function () {
    this.logger.debug('Retrieve default Kafka Client');
    if (!this.defaultClient) {
        this.defaultClient = this._createClient(this.defaults);
    }
    return this.defaultClient;
};

KafkaClientFactory.prototype._createClient = function (client) {
    this.logger.debug('Create Kafka Client to ' + client.kafkaHost || 'localhost:9092');
    const kafkaClient =  new kafka.KafkaClient(client);
    return kafkaClient;
};

module.exports = KafkaClientFactory;
