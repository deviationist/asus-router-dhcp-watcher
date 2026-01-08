import { VERBOSE_LOGGING } from './constants';

export function parseBoolean(value: string|null|undefined, defaultValue: any): boolean {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value === 'true';
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function calculateDiscountPercent(originalPrice: number|null, discountedPrice: number|null): number|null {
  if (originalPrice && discountedPrice) {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }
  return null;
}

export const objectDidChange = (a: any, b: any) => !isEqualJSON(a, b);

export function isEqualJSON(obj1: any, obj2: any): boolean {
  // Sort the properties and then stringify the objects for comparison
  const sortKeys = (obj: any): any => {
    if (typeof obj === 'object' && obj !== null) {
      // If it's an array, sort and stringify each element
      if (Array.isArray(obj)) {
        return obj.map(sortKeys);
      } else {
        // Otherwise, sort the object keys recursively
        return Object.keys(obj).sort().reduce((result: any, key) => {
          result[key] = sortKeys(obj[key]);
          return result;
        }, {});
      }
    }
    return obj;
  };

  // Compare the stringified versions of the sorted objects
  return JSON.stringify(sortKeys(obj1)) === JSON.stringify(sortKeys(obj2));
}

export function chunkArrayReduce(arr: any, size: number) {
  return arr.reduce((acc: any, _: any, index: number) => {
      if (index % size === 0) {
          acc.push(arr.slice(index, index + size));
      }
      return acc;
  }, []);
}

export function logStep(message: string) {
  if (VERBOSE_LOGGING) {
    console.log(message);
  }
}