import { ObjectID } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @ObjectIdColumn()
  _id?: ObjectID;

  @Column()
  name: string | RegExp;

  @Column({ nullable: true })
  description?: string;

  @Column()
  price: number;

  @Column()
  quantity: number;
}
