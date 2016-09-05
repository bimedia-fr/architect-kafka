/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/

"use strict";


module.exports = [
    {
        packagePath: 'architect-kafka',
        client: { // Optional, default client
            connectionString: 'localhost:2181', // Default localhost:2181
            clientId: 'architect-kafka-client'
            // See kafka-node documentation for Client options
            // zkOptions: {},   
            // noAckBatchOptions: {},
            // sslOptions: {}
        },
        consumers: {
            consumer1: {
                highLevel: true, // Use HighLevelConsumer instead of Consumer, default false
                client: {
                    connectionString: 'localhost:2181',
                    clientId: 'architect-kafka-client'
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
                client: {
                    connectionString: 'localhost:2181',
                    clientId: 'architect-kafka-client'
                },
                options: {
                    // See kafka-node documentation for Producer options
                }
            },
            producer2: {}
        }
    }
];