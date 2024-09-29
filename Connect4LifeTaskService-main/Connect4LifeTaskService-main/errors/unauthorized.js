import { StatusCodes } from 'http-status-codes';
import {CustomAPIError} from './customApi.js'

export class unauthorizedError extends CustomAPIError {
  statusCode
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

