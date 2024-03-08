import { Global, Module } from '@nestjs/common';
import { TypedEventEmitter } from 'typeorm';

@Global()
@Module({
  providers: [TypedEventEmitter],
  exports: [TypedEventEmitter],
})
export class EventEmitterModule {}
