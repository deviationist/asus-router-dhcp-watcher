import { Product } from '@prisma/client';
import Notify from '../notify';

export default async function ProductUpdated(product: Product|KomplettProduct) {
  await Notify({ 
    subject: 'Product updated in Komplett Club', 
    message: `Product updated: ${product.name}`
  });
}