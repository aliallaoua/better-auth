// Define your header routes
const HEADER_ROUTES = ["/", "/posts"];

// Configure view transitions for your router
export const routerConfig = {
	viewTransitionOptions: ({ fromLocation, toLocation }: any) => {
		// Header to header → horizontal transitions
		if (toLocation.href === "/") return ["slide-right"];
		if (toLocation.href === "/posts") return ["slide-left"];

		// To dashboard
		if (toLocation.href === "/dashboard") {
			return fromLocation?.href === "/"
				? ["slide-left"]
				: fromLocation?.href === "/posts"
					? ["slide-right"]
					: HEADER_ROUTES.includes(fromLocation?.href)
						? false
						: ["slide-down"];
		}

		// From dashboard to other routes
		if (
			fromLocation?.href === "/dashboard" &&
			!HEADER_ROUTES.includes(toLocation.href)
		) {
			return ["slide-up"];
		}

		// Other route to other route
		if (
			!(
				HEADER_ROUTES.includes(fromLocation?.href) ||
				HEADER_ROUTES.includes(toLocation.href)
			)
		) {
			return ["slide-up"];
		}

		return false;
	},
};
