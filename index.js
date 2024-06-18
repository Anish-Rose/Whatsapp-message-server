const express = require('express');
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const schedule = require("node-schedule");

const app = express();
const port = process.env.PORT || 3000;

// Initialize the client with LocalAuth to save session data
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Function to send a message
const sendMessage = (client, number, message) => {
  return client
    .sendMessage(number + "@c.us", message)
    .then((response) => {
      console.log("Message sent successfully:", response);
    })
    .catch((err) => {
      console.error("Error sending message:", err);
    });
};

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  // Schedule a job to send a message at 6:00 AM every day
  const jobMorning = schedule.scheduleJob({ hour: 6, minute: 0 }, () => {
    const number = "918248864753";
    const messageMorning = "Good Morning! Have a great day!";
    sendMessage(client, number, messageMorning);
    console.log("Scheduled job: Morning message sent at 6:00 AM");

    // Schedule the evening message for 10:00 PM the same day
    const jobEvening = schedule.scheduleJob({ hour: 22, minute: 0 }, () => {
      const messageEvening = "Good Night! Have a peaceful sleep!";
      sendMessage(client, number, messageEvening);
      console.log("Scheduled job: Evening message sent at 10:00 PM");
    });
  });

  console.log(
    "Job scheduled to send message at 6:00 AM and 10:00 PM every day."
  );
});

client.on("authenticated", () => {
  console.log("Authenticated successfully");
});

client.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILURE", msg);
});

client.initialize();

app.get('/', (req, res) => {
  res.send('WhatsApp bot is running.');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
