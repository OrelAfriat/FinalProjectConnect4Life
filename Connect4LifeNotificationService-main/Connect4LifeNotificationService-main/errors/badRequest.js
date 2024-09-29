import { StatusCodes } from 'http-status-codes';
import {CustomAPIError} from './customApi.js'

export class BadRequestError extends CustomAPIError {
    statusCode
    constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

