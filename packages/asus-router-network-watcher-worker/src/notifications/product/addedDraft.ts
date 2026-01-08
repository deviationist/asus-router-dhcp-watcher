import { Product } from '@prisma/client';
import Notify from '../notify';

export default async function ProductAddedDraft(product: Product|KomplettProduct) {
  await Notify({ 
    subject: 'Product added as draft to finn.no', 
    message: `Product added as draft to finn: ${product.name}`
  });
}