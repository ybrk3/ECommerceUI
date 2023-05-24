import { List_Product_Images } from './list_product_images';

export class List_Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  createdDate: Date;
  UpdatedDate: Date;
  images?: List_Product_Images[];
  imagePath: string;
}
