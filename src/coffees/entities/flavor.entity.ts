import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as GraphQLTypes from '../../graphql-types';

@Schema()
export class Flavor extends Document implements GraphQLTypes.Flavor {
  @Prop()
  id: number;

  @Prop()
  name: string;
}

export const FlavorSchema = SchemaFactory.createForClass(Flavor);
