import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { type JSX, useState } from "react";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "./ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./ui/input-group";

type PasswordFieldProps = Omit<React.ComponentProps<"input">, "type"> & {
	label: string | JSX.Element;
	required?: boolean;
	placeholder?: string;
	autoComplete?: string;
	forgotPassword?: boolean;
};

export default function PasswordField({
	className,
	label,
	required,
	placeholder,
	autoComplete,
	forgotPassword = false,
	...props
}: PasswordFieldProps) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	const [showPassword, setShowPassword] = useState(false);

	return (
		<Field data-invalid={isInvalid}>
			<div className="flex items-center">
				<FieldLabel htmlFor={field.name}>
					{label}
					{required ? " *" : ""}
				</FieldLabel>
				{forgotPassword && (
					<Link
						className="ml-auto text-sm underline-offset-4 hover:underline"
						to="/forget-password"
					>
						Forgot your password?
					</Link>
				)}
			</div>
			<InputGroup>
				<InputGroupInput
					aria-invalid={isInvalid}
					autoComplete={autoComplete}
					className={cn(className)}
					data-slot="input-group-control"
					id={field.name}
					name={field.name}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					placeholder={placeholder}
					type={showPassword ? "text" : "password"}
					value={field.state.value}
					{...props}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label={showPassword ? "Hide password" : "Show password"}
						className="rounded-full"
						onClick={() => setShowPassword((s) => !s)}
						size="icon-xs"
					>
						{showPassword ? <EyeOff /> : <Eye />}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
			{/* hides browsers password toggles */}
			<style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
        }
      `}</style>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
