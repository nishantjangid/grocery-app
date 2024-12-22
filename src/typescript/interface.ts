import { Request } from "express";

// Extend the Request interface to include an authorization header
interface CustomRequest extends Request {
  headers: {
    authorization?: string;
  };
  user?: any; 
}

export default CustomRequest;