import { WsException } from '@nestjs/websockets';

export class InvalidDataException extends WsException {
  constructor(message: string) {
    super(message);
  }
}