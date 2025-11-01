import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { signIn } from "@/lib/auth-functions";

const useSignInMutation = ({ nav }: { nav: string }) => {
	const router = useRouter();

	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: signIn,
		onSuccess: (response) => {
			toast.success(`Welcome back, ${response.user.name}`);

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

export default useSignInMutation;
