import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { signUp } from "@/lib/auth-functions";

const useSignUpMutation = ({ nav }: { nav: string }) => {
	const router = useRouter();

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
				to: nav,
				replace: true,
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export default useSignUpMutation;
