import { StatusCodes } from 'http-status-codes';
import {CustomAPIError} from './customApi.js'

export class unauthenticatedError extends CustomAPIError {
  statusCode
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

