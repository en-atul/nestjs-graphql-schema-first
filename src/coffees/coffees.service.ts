import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserInputError } from 'apollo-server-express';
import { Model } from 'mongoose';
import { Coffee } from './entities/coffee.entity';
import * as GraphQLTypes from '../graphql-types';
import { UpdateCoffeeInput } from './dto/update-coffee.input';
import { CreateCoffeeInput } from './dto/create-coffee.input';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name)
    private coffeeModel: Model<Coffee>,
    private readonly pubSub: PubSub,
  ) {}
  async findAll(): Promise<Coffee[]> {
    return this.coffeeModel.find().exec();
  }

  async findOne(id: number): Promise<Coffee> {
    const coffee = await this.coffeeModel.findOne({ id });
    if (!coffee) throw new UserInputError(`coffee #${id} does not exist`);
    else return coffee;
  }

  async create(createCoffeeInput: CreateCoffeeInput): Promise<Coffee> {
    const coffee = this.coffeeModel.create(createCoffeeInput);
    this.pubSub.publish('coffeeAdded', { coffeeAdded: coffee });
    return (await coffee).save();
  }

  async update(
    id: number,
    updateCoffeeInput: UpdateCoffeeInput,
  ): Promise<GraphQLTypes.Coffee> {
    const coffee = await this.coffeeModel
      .findOneAndUpdate(
        {
          id,
        },
        { $set: { ...updateCoffeeInput } },
      )
      .exec();

    if (!coffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }
    return coffee;
  }

  async remove(id: number): Promise<GraphQLTypes.Coffee> {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }
}
