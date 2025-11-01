import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-functions";

const fallback = "/dashboard" as const;

const useSignUpMutation = () => {
	const router = useRouter();
	const search = useSearch({
		from: "/signup",
		select: (search) => search.redirect,
	});

	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: signUp,
		onSuccess: () => {
			toast.success(
				"You have successfully signed up. Please check your email for verification."
			);
			queryClient.resetQueries();
			router.invalidate();
			// router.navigate({ to: "/dashboard" });
			router.navigate({
				to: search || fallback,
				// replace: true,
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export default useSignUpMutation;
