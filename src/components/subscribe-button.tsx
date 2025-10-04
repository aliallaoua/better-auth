import { useFormContext } from '@/hooks/form-context';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

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
					{isSubmitting ? <Spinner /> : label}
				</Button>
			)}
			selector={(state) => [state.canSubmit, state.isSubmitting]}
		/>
	);
}

export default SubscribeButton;
