import { Product } from '@prisma/client';
import Notify from '../notify';

export default async function ProductRemoved(product: Product|KomplettProduct) {
  await Notify({ 
    subject: 'Product removed from Komplett Club', 
    message: `Product removed: ${product.name}`
  });
}