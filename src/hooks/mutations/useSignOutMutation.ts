import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

const useSignOutMutation = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => await authClient.signOut(),
		onSuccess: async () => {
			await queryClient.invalidateQueries();
			router.invalidate();
			router.navigate({ to: "/" });
		},
	});
};

export default useSignOutMutation;
