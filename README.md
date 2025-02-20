
## Topic
A **Kafka topic** is a **logical channel** used to categorize and store messages in Kafka. It acts as a **message queue** where producers write events and consumers read them.

### **Purpose of a Topic**
1. **Event Organization** – Topics help structure messages by category. For example, `payment-events` stores all payment-related messages.
2. **Decoupling Producers and Consumers** – Producers send messages to a topic without knowing who will consume them, and consumers read messages without worrying about the producer.
3. **Scalability via Partitions** – A topic is split into **partitions**, allowing parallel processing and scaling.
4. **Retention & Replayability** – Messages persist for a configurable retention period, allowing consumers to replay events if needed.
5. **Fault Tolerance** – Replication ensures messages aren’t lost if a broker fails.
