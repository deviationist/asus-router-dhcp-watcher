// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type ResolvedProduct = {
		images: string[];
		thumbnail: string|null;
	} & Omit<Product, "thumbnail"|"images">;
}

export {};
