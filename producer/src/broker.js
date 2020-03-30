const amqp = require('amqplib');
const winston = require('winston');

module.exports.start = async () => {
  const connection = await amqp.connect(process.env.MESSAGE_QUEUE);

  const channel = await connection.createChannel();

  const exchange = 'orders';
  let msg = process.argv.slice(2).join(' ') || 'Hello World!';
  await channel.assertExchange(exchange, 'direct', { durable: true });
  // await channel.assertQueue('tasks', { durable: true });

  Array(100)
    .fill()
    .map(async (x, y) => {
      const msg = 'Hello World! ' + y.toString()
      await channel.publish(exchange, 'black', Buffer.from(msg));

      console.log("exchange %s [%s] Sent message %s", exchange, y + 1, msg);

    });

  setTimeout(() => {
    connection.close();
  }, 3);
};
