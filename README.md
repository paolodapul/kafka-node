## Producer
A **Kafka producer** is responsible for **sending messages (events) to Kafka topics**. It acts as the entry point for data into Kafka.

### **Purpose of a Producer**
1. **Writes Events to Kafka** – Produces messages to a specified topic so consumers can process them.
2. **Ensures Message Delivery** – Producers can configure **acks (acknowledgments)** to ensure reliable delivery:
   - `acks=0`: Fire-and-forget (no guarantee).
   - `acks=1`: Acknowledged by the leader (faster, but minimal safety).
   - `acks=all`: Acknowledged by all replicas (strongest reliability).
3. **Partitioning for Load Balancing** – Producers assign messages to **partitions** (either manually using a key or via Kafka's partitioner).
4. **Message Serialization** – Converts data (JSON, Avro, Protobuf) into bytes before sending.
5. **Asynchronous & High Throughput** – Batches messages for efficiency and can send them **asynchronously** for better performance.

## Topic
A **Kafka topic** is a **logical channel** used to categorize and store messages in Kafka. It acts as a **message queue** where producers write events and consumers read them.

### **Purpose of a Topic**
1. **Event Organization** – Topics help structure messages by category. For example, `payment-events` stores all payment-related messages.
2. **Decoupling Producers and Consumers** – Producers send messages to a topic without knowing who will consume them, and consumers read messages without worrying about the producer.
3. **Scalability via Partitions** – A topic is split into **partitions**, allowing parallel processing and scaling.
4. **Retention & Replayability** – Messages persist for a configurable retention period, allowing consumers to replay events if needed.
5. **Fault Tolerance** – Replication ensures messages aren’t lost if a broker fails.
