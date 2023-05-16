const mqtt = require("mqtt");

const clientOne = mqtt.connect("mqtt://localhost:22222", {
  // clientId: `mqtt__${Math.random().toString(16).substring(2, 8)}`,
  clientId: "",
  clean: false, // non-peristent sessions
  reconnectPeriod: 100,
  connectTimeout: 4000,
});

const clientTwo = mqtt.connect("mqtt://localhost:22222", {
  // clientId: `mqtt__${Math.random().toString(16).substring(2, 8)}`,
  clientId: "",
  clean: false,
  reconnectPeriod: 100,
  connectTimeout: 4000,
});

const topic = "mqtt/nodejs";

// client one will be used to publish to the topic.
clientOne.on("connect", () => {
  console.log("[*] Client one is connected!");
  clientOne.publish(topic, "MESSAGE", { qos: 0, retain: false }, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`[*] Client one published a message to '${topic}' topic`);
  });
});

// client two will be used to subscribe to the topic.
clientTwo.on("connect", () => {
  console.log("[*] Client two is connected!");
  clientTwo.subscribe([topic], { qos: 0 }, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`[*] Client two subscribed to '${topic}' topic`);
  });
});

// client two will receive the message when it comes.
clientTwo.on("message", (topic, payload) => {
  console.log(
    `[*] Client two Received message from '${topic}': ${payload.toString()}`
  );
});
