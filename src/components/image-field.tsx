import { useStore } from '@tanstack/react-form';

import { useFieldContext } from '@/hooks/form-context';
import { ErrorMessages } from './ErrorMessages';
import { Input } from './ui/input';
import { Label } from './ui/label';

type ImageFieldsProps = React.ComponentProps<'input'> & {
	label?: string;
};

export default function ImageField({
	className,
	label = '',
	...props
}: ImageFieldsProps) {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<div>
			<Label htmlFor={field.name}>
				{label}
				<Input
					accept="image/*"
					className={className}
					data-slot="input"
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					type="file"
					// value={field.state.value}
					{...props}
				/>
			</Label>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}
