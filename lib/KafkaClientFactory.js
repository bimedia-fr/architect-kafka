/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

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
    this.logger.debug('Create Kafka Client to ' + client.connectionString || 'localhost:2181' + ', ID: ' + client.clientId);
    return new kafka.Client(client.connectionString || 'localhost:2181', client.clientId, client.zkOptions, client.noAckBatchOptions, client.sslOptions);
};