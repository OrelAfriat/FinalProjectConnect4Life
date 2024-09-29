import { StatusCodes } from 'http-status-codes';
import {CustomAPIError} from './customApi.js'

export class internalError extends CustomAPIError {
    statusCode
    constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}