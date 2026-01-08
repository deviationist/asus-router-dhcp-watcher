import { error } from '@sveltejs/kit';
import { page } from '$app/stores';
import prisma from '@worker/lib/prisma';
import { z, ZodError } from 'zod';
import { resolveProduct } from '@/lib/helpers';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }: { params: { id: string } }) {
	const product = await prisma.product.findUnique({ where: { id: params.id } });

	if (product) {
		return resolveProduct(product);
	}

	error(404, 'Not found');
}

export const actions = {
	updateProduct: async ({ request, params }: { request: Request, params: { id: string } }) => {
		const data = await request.formData();

		const name = data.get('name') as string;
		const prisjaktUrl = data.get('prisjaktUrl') as string;
		const description = data.get('description') as string;

		const productSchema = z.object({
			name: z.string().min(5, { message: 'Name must be at least 5 characters long' }),
			prisjaktUrl: z.string().optional(),
			description: z.string()
		});

		const result = productSchema.safeParse({ name, prisjaktUrl, description });

		if (!result.success) {
			const errors = result.error.errors.map((error) => {
				return {
					field: error.path[0],
					message: error.message
				};
			});

			return {
				success: false,
				errors
			};
		}

		await prisma.product.update({
			where: { id: params.id },
			data: { name, prisjaktUrl, description }
		});
		
		return { success: true };
	}
}