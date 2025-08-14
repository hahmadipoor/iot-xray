# IoT X-Ray Signal Processing Backend

This project is a **NestJS microservices backend** for processing IoT signals from an X-Ray simulator.  
It uses **RabbitMQ** as a message broker and **MongoDB** for persistent storage.

---

##  Overview

The system consists of:

- **Producer App (IoT Simulator)** — Sends IoT messages to RabbitMQ.
- **Backend Service (NestJS)** — Consumes messages from RabbitMQ, processes them, and stores them in MongoDB.
- **RabbitMQ** — Acts as the message broker between the producer and backend service.
- **MongoDB** — Stores processed signal data.

---

## Technologies Used

NestJS — Node.js framework for modular backend

RabbitMQ — Message broker for asynchronous communication

MongoDB — NoSQL database

amqplib — RabbitMQ client

TypeORM — Database ORM for MongoDB

Docker — For containerized setup (optional)

## Installation

1. Clone the repository
git clone https://github.com/hahmadipoor/iot-xray.git
cd iot-xray


2. Install dependencies
npm install

3. Configure environment variables
Create a .env file in the root directory:
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=xray_queue
MONGODB_URI=mongodb://localhost:27017/xray_signals
PORT=3000


# Running the Project
1. Start RabbitMQ & MongoDB (Docker)
docker run -d --hostname rabbit --name rabbitmq -p 5672:5672 rabbitmq:3-management
docker run -d --name mongodb -p 27017:27017 mongo

2. Start the backend
npm run start:dev

# Testing the Flow

1. Start RabbitMQ and MongoDB.

2. Start the Backend Service.

3. Use the IoT Producer App to send a test message to the queue:

node producer.js

4. The backend will consume the message and save it in MongoDB.

5. Verify the data:

mongo
use xray_signals
db.signals.find()











