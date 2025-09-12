import { useStore } from '@tanstack/react-form';
import { Eye, EyeOff } from 'lucide-react';
import { type JSX, useState } from 'react';
import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import { ErrorMessages } from './ErrorMessages';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type TextFieldProps = React.ComponentProps<'input'> & {
	label: string | JSX.Element;
	type?: 'text' | 'email' | 'password' | 'url' | 'hidden';
	required?: boolean;
	placeholder?: string;
	autoComplete?: string;
	// helpText?: string;
	withPasswordToggle?: boolean;
};

export default function TextField({
	className,
	label,
	type = 'text',
	required,
	placeholder,
	autoComplete,
	// helpText,
	withPasswordToggle,
	...props
}: TextFieldProps) {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="grid gap-2">
			<Label htmlFor={field.name}>
				<div className="flex items-center gap-2">
					{label}
					{required ? ' *' : ''}
				</div>
			</Label>
			<div className="relative">
				<Input
					aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
					autoComplete={autoComplete}
					// className={
					// 	type === 'password' && withPasswordToggle ? 'pr-10' : undefined
					// }
					className={cn(
						type === 'password' && withPasswordToggle ? 'pr-10' : undefined,
						// 'invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:outline-red-500',
						className
					)}
					data-slot="input"
					id={field.name}
					name={field.name}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					placeholder={placeholder}
					type={
						type === 'password' && withPasswordToggle
							? showPassword
								? 'text'
								: 'password'
							: type
					}
					value={field.state.value ?? ''}
					{...props}
				/>
				{type === 'password' && withPasswordToggle ? (
					<Button
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						className="-translate-y-1/2 absolute top-1/2 right-1"
						onClick={() => setShowPassword((s) => !s)}
						size="icon"
						type="button"
						variant="ghost"
					>
						{showPassword ? (
							<EyeOff className="size-4" />
						) : (
							<Eye className="size-4" />
						)}
					</Button>
				) : null}
			</div>
			{/* hides browsers password toggles */}
			<style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
        }
      `}</style>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}
