import dotenv from 'dotenv';
dotenv.config();

const ENV_VARIABLES = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET || "3df34224dsdf",
  ENVIRONMENT: process.env.NODE_ENV
};

export default ENV_VARIABLES;
