"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const kafka_javascript_1 = require("@confluentinc/kafka-javascript");
const Kafka = kafka_javascript_1.KafkaJS.Kafka;
// Reads and parses the Kafka configuration file
function readConfig(fileName) {
    const data = fs_1.default.readFileSync(fileName, "utf8").toString().split("\n");
    const config = {};
    for (const line of data) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#"))
            continue;
        const [key, value] = trimmedLine.split("=");
        if (key && value) {
            config[key.trim()] = value.trim();
        }
    }
    if (!config["bootstrap.servers"]) {
        throw new Error("❌ Missing required Kafka configuration: bootstrap.servers.");
    }
    return config;
}
function producerStart(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = new Kafka(config).producer();
        yield producer.connect();
        console.log("Connected successfully");
        const res = [];
        res.push(producer.send({
            topic: "payment-events",
            messages: [{ value: "v", partition: 0, key: "x" }],
        }));
        yield Promise.all(res);
        yield producer.disconnect();
        console.log("Disconnected successfully");
    });
}
// Main Function
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = readConfig("client.properties");
            const topic = "payment-events";
            producerStart(config);
        }
        catch (error) {
            console.error("❌ Startup error:", error);
        }
    });
}
main();
