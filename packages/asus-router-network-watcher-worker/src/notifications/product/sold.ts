import { Product } from '@prisma/client';
import Notify from '../notify';

export default async function ProductSold(product: Product|KomplettProduct) {
  await Notify({ 
    subject: 'Product sold at finn.no', 
    message: `Product sold: ${product.name}`
  });
}