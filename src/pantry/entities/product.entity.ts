import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @ObjectIdColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  price: number;

  @Column()
  quantity: number;
}
