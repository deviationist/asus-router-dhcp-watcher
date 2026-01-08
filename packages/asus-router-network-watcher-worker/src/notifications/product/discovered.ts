import { Product } from '@prisma/client';
import Notify from '../notify';

export default async function ProductDiscovered(product: Product|KomplettProduct) {
  await Notify({ 
    subject: 'Product discovered in Komplett Club', 
    message: `New product discovered: ${product.name}`
  });
}