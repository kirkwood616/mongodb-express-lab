import { ObjectId } from "mongodb";

interface Item {
  _id?: ObjectId;
  product: string;
  price: number;
  quantity: number;
}

export default Item;
