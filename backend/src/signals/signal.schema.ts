import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SignalDocument = Signal & Document;

@Schema({ timestamps: true })
export class Signal {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  dataLength: number;

  @Prop()
  dataVolume: number;

  @Prop({ type: Object })
  raw: any;

  @Prop({ type: [Number] })
  firstPoint?: number[]; // [x,y,speed]

  @Prop({ type: [Number] })
  lastPoint?: number[];
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
