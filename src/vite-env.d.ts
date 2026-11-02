/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CLERK_PUBLISHABLE_KEY: string;
	readonly VITE_CONVEX_URL: string;
	readonly VITE_SITE_URL?: string;
	readonly VITE_PUBLIC_LAUNCH_MODE?: string;
}
