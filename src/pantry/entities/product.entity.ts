import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  constructor(
    name: string,
    description: string,
    price: number,
    quantity: number,
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
  }
}
