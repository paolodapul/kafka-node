import fs from "fs";
import { KafkaJS } from "@confluentinc/kafka-javascript";
const Kafka = KafkaJS.Kafka;

// Define Kafka configuration type
interface KafkaConfig {
  "bootstrap.servers": string;
  "sasl.username"?: string;
  "sasl.password"?: string;
  "sasl.mechanism"?: string;
  "group.id"?: string;
  "auto.offset.reset"?: string;
}

// Reads and parses the Kafka configuration file
function readConfig(fileName: string): KafkaConfig {
  const data = fs.readFileSync(fileName, "utf8").toString().split("\n");
  const config: Partial<KafkaConfig> = {};

  for (const line of data) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const [key, value] = trimmedLine.split("=");
    if (key && value) {
      config[key.trim() as keyof KafkaConfig] = value.trim();
    }
  }

  if (!config["bootstrap.servers"]) {
    throw new Error(
      "❌ Missing required Kafka configuration: bootstrap.servers."
    );
  }

  return config as KafkaConfig;
}

async function consumerStart(config: KafkaConfig) {
  const consumer = new Kafka(config).consumer({
    ...config,
    "group.id": "payment-processing",
  });

  await consumer.connect();
  console.log("Consumer connected successfully");
  await consumer.subscribe({ topic: "payment-events" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());
      console.log(`Received event: ${event.eventType}`);

      if (event.eventType === "PAYMENT_INITIATED") {
        processPayment(event.payment);
      }
    },
  });
}

const processPayment = async (payment: any) => {
  console.log(
    `Processing payment: ${payment.paymentId} for Order: ${payment.orderId}`
  );

  // Simulate payment processing
  setTimeout(() => {
    console.log(`Payment ${payment.paymentId} updated to SUCCESS`);
    // Here, you might produce another Kafka event for status update
  }, 3000);
};

// Main Function
async function main(): Promise<void> {
  try {
    const config = readConfig("client.properties");
    consumerStart(config);
  } catch (error) {
    console.error("❌ Startup error:", error);
  }
}

main();
