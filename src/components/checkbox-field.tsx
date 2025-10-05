import type { CheckedState } from '@radix-ui/react-checkbox';
import { useStore } from '@tanstack/react-form';
import { Activity } from 'react';
import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import { ErrorMessages } from './ErrorMessages';
import { Checkbox } from './ui/checkbox';
import { Field, FieldContent, FieldDescription, FieldLabel } from './ui/field';

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
		<>
			<Field orientation="horizontal">
				<Checkbox
					checked={field.state.value}
					className={cn(className)}
					id={field.name}
					onBlur={field.handleBlur}
					onCheckedChange={(checked) => {
						field.handleChange(checked === true);
						onCheckedChange?.(checked);
					}}
					{...props}
				/>
				{description ? (
					<FieldContent>
						<FieldLabel className="font-normal" htmlFor={field.name}>
							{label}
						</FieldLabel>
						<FieldDescription>{description}</FieldDescription>
					</FieldContent>
				) : (
					<FieldLabel className="font-normal" htmlFor={field.name}>
						{label}
					</FieldLabel>
				)}
			</Field>
			{/* {field.state.meta.isTouched && <ErrorMessages errors={errors} />} */}
			<Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
				<ErrorMessages errors={errors} />
			</Activity>
		</>
	);
};
