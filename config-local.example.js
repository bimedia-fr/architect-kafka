'use strict';

module.exports = [
    {
        packagePath: 'architect-kafka',
        client: { // Optional, default client. See Kafka-Client for options https://www.npmjs.com/package/kafka-node/v/3.0.1#kafkaclient
            kafkaHost : 'localhost:9092', // Default localhost:9092
            connectTimeout : 10000, // default: 10000
            requestTimeout : 30000, // default: 30000
            autoConnect : true, // default: true
            idleConnection : 300000, // default: 5 minutes
            maxAsyncRequests : 10, // default: 10,
            sslOptions: { rejectUnauthorized: false }
        },
        consumers: {
            consumer1: {
                highLevel: true, // Use HighLevelConsumer instead of Consumer, default false
                client: {
                    kafkaHost: 'localhost:9092'
                },
                payloads: [
                    {
                        topic: 'topicName1',
                        offset: 0
                    },
                    {
                        topic: 'topicName2',
                        offset: 10
                    }
                ],
                options: {
                    // See kafka-node documentation for Consumer options
                    groupId: 'kafka-node-group'
                }
            },
            consumer2: {
                payloads: [
                    {
                        topic: 'topicName1',
                        offset: 0
                    }
                ],
                options: {}
            }
        },
        producers: {
            producer1: {
                highLevel: true, // Use HighLevelproducer instead of Producer, default false
                client: { // See Kafka-Client for options https://www.npmjs.com/package/kafka-node/v/3.0.1#kafkaclient
                    kafkaHost: 'localhost:9092'
                },
                options: {
                    // See kafka-node documentation for Producer options
                }
            },
            producer2: {}
        }
    }
];
