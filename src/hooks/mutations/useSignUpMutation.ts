import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { AUTH_REDIRECT_FALLBACK } from "@/lib/auth-client";
import { signUp } from "@/lib/auth-functions";

const fallback = AUTH_REDIRECT_FALLBACK;
const routeApi = getRouteApi("/signup");

const useSignUpMutation = () => {
	const router = useRouter();
	// const search = routeApi.useSearch({
	// 	select: (search) => search.redirect,
	// });
	const search = routeApi.useSearch();

	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["auth", "sign-up"],
		mutationFn: signUp,
		onSuccess: () => {
			toast.success(
				"You have successfully signed up. Please check your email for verification."
			);
			queryClient.resetQueries();
			router.invalidate();
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

export default useSignUpMutation;
