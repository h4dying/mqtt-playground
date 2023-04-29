const mqtt = require('mqtt');


const host = 'broker.emqx.io';
const port = '1883'
const clientIdOne = "70"
const clientIdTwo = "80"


const connectionURI = `mqtt://${host}:${port}`;


const clientOne = mqtt.connect(connectionURI, {
    clientIdOne,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000
});

const clientTwo = mqtt.connect(connectionURI, {
    clientIdTwo,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000
});


const topicOne = 'room/device1';
const topicTwo = 'room/device2' 

clientOne.on('connect', () => {
    console.log('connected from client one!');

    clientOne.subscribe([topicTwo], () => {
        console.log(`Client One Subscribe to topic: ${topicTwo}`);
    });

    clientOne.publish(topicOne, 'MESSAGE FROM TOPIC ONE', {qos: 2, retain: false}, (err) => {
        console.log('already published!');
        if (err) {
            console.log(err);
        }
    });
   
});

clientTwo.on('connect', () => {
    console.log('connected from client two!');
        // subscribing to the messages being published from client one on topic from client two.
        clientTwo.subscribe([topicOne], () => {
            console.log('already subscribed!');
            console.log(`Client Two Subscribe to topic: ${topicOne}`);
            
        });

        clientTwo.publish(topicTwo, 'MESSAGE FROM TOPIC TWO', {qos: 2, retain: false}, (err) => {
            if (err) {
                console.log(err);
            }
        })
    
})


clientTwo.on('message', (topic, payload) => {
    console.log(`Recieving messages that are being published from client one on ${topic}: ${payload.toString()}`);
})

clientOne.on("message", (topic, payload) => {
    console.log(`Recieving messages that are being published from client two on ${topic}: ${payload.toString()}`);
})