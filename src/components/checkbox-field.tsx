import type { CheckedState } from '@radix-ui/react-checkbox';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@/hooks/form-context';
import { ErrorMessages } from './ErrorMessages';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

type CheckboxFieldProps = {
	label: string;
	description?: string;
	className?: string;
	onCheckedChange?(checked: CheckedState): void;
};

export const CheckboxField = ({
	className,
	label,
	description,
	onCheckedChange,
	...props
}: CheckboxFieldProps) => {
	const field = useFieldContext<boolean>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-2">
				<Checkbox
					checked={field.state.value}
					className={className}
					id={field.name}
					onBlur={field.handleBlur}
					onCheckedChange={(checked) => {
						field.handleChange(checked === true);
					}}
					{...props}
				/>
				<div className="grid gap-1.5 leading-none">
					<Label className="cursor-pointer" htmlFor={field.name}>
						{label}
					</Label>
					{description && (
						<p className="text-muted-foreground text-sm">{description}</p>
					)}
				</div>
			</div>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};
