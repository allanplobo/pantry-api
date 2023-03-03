import { ObjectId } from 'mongoose';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  price: number;

  @Column()
  quantity: number;
}
