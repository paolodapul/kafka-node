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

async function producerStart(config: KafkaConfig) {
  const producer = new Kafka(config).producer();

  await producer.connect();
  console.log("Connected successfully");

  const res = [];
  res.push(
    producer.send({
      topic: "payment-events",
      messages: [
        {
          key: "pay_001",
          partition: 0, // Optional
          value: JSON.stringify({
            eventId: "123e4567-e89b-12d3-a456-426614174000",
            eventType: "PAYMENT_INITIATED",
            timestamp: new Date().toISOString(),
            payment: {
              paymentId: "pay_001",
              orderId: "order_123",
              userId: "user_456",
              amount: 100.5,
              currency: "USD",
              status: "PENDING",
              paymentMethod: "CREDIT_CARD",
            },
          }),
        },
      ],
    })
  );
  await Promise.all(res);

  await producer.disconnect();
  console.log("Disconnected successfully");
}

// Main Function
async function main(): Promise<void> {
  try {
    const config = readConfig("client.properties");
    const topic = "payment-events";
    producerStart(config);
  } catch (error) {
    console.error("❌ Startup error:", error);
  }
}

main();
