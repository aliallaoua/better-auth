import { useStore } from '@tanstack/react-form';
import type { JSX } from 'react';
import { Activity } from 'react';
import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import { ErrorMessages } from './ErrorMessages';
import { Field, FieldLabel } from './ui/field';
import { InputGroup, InputGroupInput } from './ui/input-group';

type TextFieldProps = React.ComponentProps<'input'> & {
	label: string | JSX.Element;
	required?: boolean;
	placeholder?: string;
	autoComplete?: string;
	type?: string;
};

export default function TextField({
	className,
	label,
	required,
	placeholder,
	autoComplete,
	type = 'text',
	...props
}: TextFieldProps) {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={field.name}>
				{label}
				{required ? ' *' : ''}
			</FieldLabel>
			<InputGroup>
				<InputGroupInput
					aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
					autoComplete={autoComplete}
					className={cn(className)}
					data-slot="input-group-control"
					id={field.name}
					name={field.name}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					placeholder={placeholder}
					type={type}
					value={field.state.value ?? ''}
					{...props}
				/>
			</InputGroup>
			{/* {field.state.meta.isTouched && <ErrorMessages errors={errors} />} */}
			<Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
				<ErrorMessages errors={errors} />
			</Activity>
		</Field>
	);
}
