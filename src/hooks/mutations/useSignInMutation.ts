import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { signIn } from "@/lib/auth-functions";

const fallback = "/dashboard" as const;
const routeApi = getRouteApi("/login");

const useSignInMutation = () => {
	const router = useRouter();
	// const search = routeApi.useSearch({
	// 	select: (search) => search.redirect,
	// });
	const search = routeApi.useSearch();

	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["auth", "sign-in"],
		mutationFn: signIn,
		onSuccess: (response) => {
			toast.success(`Welcome back, ${response.user.name}`);

			queryClient.resetQueries();
			// router.invalidate();
			// router.navigate({ to: "/dashboard" });
			router.navigate({
				// to: search || fallback,
				to: search.redirect || fallback,
				// replace: true,
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export default useSignInMutation;
