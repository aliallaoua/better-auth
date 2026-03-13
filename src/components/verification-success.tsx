import { CheckCircle2 } from "lucide-react";

export function VerificationSuccess() {
	return (
		<div className="flex flex-col items-center justify-center space-y-2 py-4">
			<CheckCircle2 className="h-12 w-12 text-green-500" />
			<p className="font-semibold text-lg">Verification Successful</p>
		</div>
	);
}
