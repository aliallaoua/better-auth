import { useStore } from '@tanstack/react-form';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import { ErrorMessages } from './ErrorMessages';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type PasswordFieldProps = React.ComponentProps<'input'> & {
	label?: string;
};

export default function PasswordField({
	className,
	label = '',
	type = 'password',
	...props
}: PasswordFieldProps) {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div>
			<Label htmlFor={field.name}>{label}</Label>
			<div className="relative">
				<Input
					className={cn('hide-password-toggle pr-10', className)}
					data-slot="input"
					name="password"
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					type={showPassword ? 'text' : 'password'}
					value={field.state.value}
					{...props}
				/>
				<Button
					className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
					onClick={() => setShowPassword((prev) => !prev)}
					size="sm"
					type="button"
					variant="ghost"
				>
					{showPassword ? (
						<EyeOff aria-hidden="true" className="size-4" />
					) : (
						<Eye aria-hidden="true" className="size-4" />
					)}
					<span className="sr-only">
						{showPassword ? 'Hide password' : 'Show password'}
					</span>
				</Button>
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
