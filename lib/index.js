'use strict';

const kafka = require('kafka-node');
const dns = require('dns');

const KafkaClientFactory = require('./KafkaClientFactory.js');
const KafkaConsumerFactory = require('./KafkaConsumerFactory.js');
const KafkaProducerFactory = require('./KafkaProducerFactory.js');
const KafkaOffsetFactory = require('./KafkaOffsetFactory.js');

module.exports = function setup(options, imports, register) {

    let log = imports.log.getLogger(options.name || 'architect-kafka');
    let client = options.client || {};

    function resolveHosts(config) {
        return new Promise((resolve, reject) => {
            if (config.kafkaHost) {
                return resolve(config);
            }
            if (client.srv) {
                return dns.resolveSrv('_kafka._tcp.' + client.srv, (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    let servers = results.map((res) => res.name + ':' + res.port).join(',');
                    config.kafkaHost = servers;
                    delete config.srv;
                    return resolve(config);
                });
            }
            reject(new Error('invalid configuration please provide kafkaHost or srv'));
        });
    }

    resolveHosts(client).then(c => {
        let clientFactory = new KafkaClientFactory(c, log);
        let offsetFactory = new KafkaOffsetFactory(clientFactory, log);
        let consumerFactory = new KafkaConsumerFactory(clientFactory, log);
        let producerFactory = new KafkaProducerFactory(clientFactory, log);

        let consumers = consumerFactory.createConsumers(options.consumers),
                producers = producerFactory.createProducers(options.producers),
                offset = offsetFactory.createOffset(options.consumers);

        var toRegister = {
            onDestroy: close,
            kafka: {
                consumers: consumers,
                producers: producers,
                offset: offset,
                classes: {}
            }
        };

        function values(obj) {
            return Object.keys(obj).map(function (name) {
                return obj[name];
            });
        }

        function closer(resource) {
            return new Promise((resolve, reject) => {
                resource.close((err, res) => {
                    if(err){
                        return reject(err);
                    }
                    resolve(res);
                });
            });
        }

        function close() {
            let resources = values(consumers).concat(values(producers));
            return Promise.all(resources.map(closer));
        }

        Object.keys(kafka).forEach(function (clazz) {
            toRegister.kafka.classes[clazz] = kafka[clazz];
        });

        Promise.all(values(producers).map(p => {
            return new Promise(resolve => {
                p.once('ready', resolve);
            });
        })).then(() => {
            register(null, toRegister);
        });
    }).catch(err => {
        register(err);
    });

};

module.exports.consumes = ['log'];
module.exports.provides = ['kafka'];
