import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Signal, SignalDocument } from './signal.schema';
import { CreateSignalDto } from './dto/create-signal.dto';

@Injectable()
export class SignalsService {
  
  private readonly logger = new Logger(SignalsService.name);
  constructor(@InjectModel(Signal.name) private signalModel: Model<SignalDocument>) {}

  async create(payload: Partial<Signal>): Promise<Signal> {
    try {
      const doc = new this.signalModel(payload);
      return doc.save();
    } catch (err) {
      this.logger.error('Failed to save signal', err as any);
      throw err;
    }
  }

  async findAll() {
    return this.signalModel.find().sort({ time: -1 }).limit(100).exec();
  }

  async findOne(id: string) {
    return this.signalModel.findById(id).exec();
  }

  async update(id: string, patch: Partial<Signal>) {
    return this.signalModel.findByIdAndUpdate(id, patch, { new: true }).exec();
  }

  async remove(id: string) {
    return this.signalModel.findByIdAndDelete(id).exec();
  }

  // Filter example: deviceId + time range
  async query(filter: { deviceId?: string; from?: Date; to?: Date }) {
    const q: any = {};
    if (filter.deviceId) q.deviceId = filter.deviceId;
    if (filter.from || filter.to) q.time = {};
    if (filter.from) q.time.$gte = filter.from;
    if (filter.to) q.time.$lte = filter.to;
    return this.signalModel.find(q).sort({ time: -1 }).exec();
  }
}
