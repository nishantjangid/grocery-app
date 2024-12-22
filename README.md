## Getting Started

### Clone the repository

If you haven't already, clone the repository:

```bash
git clone https://github.com/nishantjangid/grocery-app.git
cd grocery-app
```

This is a Node.js application using Prisma ORM and PostgreSQL as the database. It is containerized using Docker to provide a seamless development and production environment.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) for managing multi-container Docker applications.

## How to Run This Project

1. Rename `.env.example` to `.env`.
2. Add your database URL in the `.env` file under the `DATABASE_URL` variable.
3. Install all dependencies:
   ```bash
   npm i
   ```
4. To run the app locally:
   ```bash
   npm run start:dev
   ```
## Run app on docker
1. Go to the root of the project.
2. Run command
   ```bash
      docker-compose up --build
   ```
3. Now you can access app on http://localhost:5000/api/v1

## How to test this APIs
1. Please find postman collection json in project root
2. Import the json file in your postman app
3. Start the app according to your choice docker or local setup.
4. Enjoy your APIs at port 5000

## Editor Configuration

1. Install the **Prettier** extension (VS Code Extension ID: `esbenp.prettier-vscode`).
2. Install the **ESLint** extension (VS Code Extension ID: `dbaeumer.vscode-eslint`).

## Prisma Commands

1. Run and create a migration:
   ```bash
   npx prisma migrate dev --name init
   ```
2. Seed data into the database:
   ```bash
   npm run seed
   ```
3. Run Prisma Studio (it will run on port 5555):
   ```bash
   npx prisma studio
   ```