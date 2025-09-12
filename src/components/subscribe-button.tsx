import { Loader2 } from 'lucide-react';
import { useFormContext } from '@/hooks/form-context';
import { Button } from './ui/button';

function SubscribeButton({
	label,
	disabled,
	className,
	...props
}: {
	label: string;
	disabled?: boolean;
	className?: string;
}) {
	const form = useFormContext();

	return (
		<form.Subscribe
			children={([canSubmit, isSubmitting]) => (
				<Button
					className={className}
					disabled={!canSubmit}
					type="submit"
					{...props}
				>
					{isSubmitting ? (
						<Loader2 className="animate-spin" size={15} />
					) : (
						label
					)}
				</Button>
			)}
			selector={(state) => [state.canSubmit, state.isSubmitting]}
		/>
	);
}

export default SubscribeButton;
