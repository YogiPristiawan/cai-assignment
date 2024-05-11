## Summary
The concept behind this project resembles a payment, authentication, and transaction service commonly found in e-commerce platforms, but it is implemented with a very simplified approach. You can make a payment using three different payment methods: **Debit**, **Credit**, and **Loan**. This project have 3 services:
1. **Auth Service**
   The auth service, which is managed by [Supertokens](https://supertokens.com/) is responsible to verify the identity of users and grant them access to the system's resources securely. It manages user authentication, and session handling, ensuring that only authenticated users can perform authorized actions within the application.
2. **Account Service**
   It is responsible to manages the user accounts, calculating user balance, and and generating reports on user account statements. Because calculating user balance is prone to race conditions, we must be aware of this. Therefore, we implement database isolation levels and retry actions when race conditions occur.
3. **Transaction Service**
   It is responsible to manage the user transactions, recoding the transaction details, and updating the status based on the success of payment.
Each service mentioned above can communicate with each other using RESTful API, provided with the appropricate credentials.

## Tech-stack
- [PostgreSQL](https://www.postgresql.org/) as the database
- [Fastify](https://fastify.dev/) as the backend framework
- [Supertokens](https://supertokens.com/) third party for managing auth service
- [Docker](https://www.docker.com/) for the containerization

## How To Run?
1. You need to have [Docker]([url](https://docs.docker.com/engine/)) and [Docker compose]([url](https://docs.docker.com/compose/)) installed on your machine.
2. You can customize the `.env` file in each module if you want to.
3. Run the application using `sudo docker compose up -d`.

If you don't cusotomize the `.env` file, the application will default to running at the following address:
- Auth Service: `http://localhost:3567`
- Account Service: `http://localhost:3000`
- Transaction Service: `http://localhost:3001`
- Swagger API Documentation: `http://localhost`
