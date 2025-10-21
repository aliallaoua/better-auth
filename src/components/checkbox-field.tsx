import type { CheckedState } from "@radix-ui/react-checkbox";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldError, FieldLabel } from "./ui/field";

type CheckboxFieldProps = {
	label: string;
	className?: string;
	onCheckedChange?(checked: CheckedState): void;
};

export const CheckboxField = ({
	className,
	label,
	onCheckedChange,
	...props
}: CheckboxFieldProps) => {
	const field = useFieldContext<boolean>();

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<>
			<Field data-invalid={isInvalid} orientation="horizontal">
				<Checkbox
					name={field.name}
					aria-invalid={isInvalid}
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
				<FieldLabel htmlFor={field.name} className="font-normal">
					{label}
				</FieldLabel>
			</Field>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</>
	);
};
