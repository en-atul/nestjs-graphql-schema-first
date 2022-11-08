import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as GraphQLTypes from '../../graphql-types';

@Schema()
export class Coffee extends Document implements GraphQLTypes.Coffee {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop()
  flavors: string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee);
