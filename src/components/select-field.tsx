import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/hooks/form-context";
import { Field, FieldError, FieldLabel } from "./ui/field";

export function SelectField({
	label,
	values,
	placeholder,
}: {
	label: string;
	values: Array<{ label: string; value: string }>;
	placeholder?: string;
}) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	// Add placeholder as first item if provided
	const selectItems = placeholder
		? [{ label: placeholder, value: null }, ...values]
		: values;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Select
				name={field.name}
				items={selectItems}
				onValueChange={field.handleChange}
				value={field.state.value || null}
			>
				<SelectTrigger
					className="w-full"
					aria-invalid={isInvalid}
					id={field.name}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{selectItems.map((item) => (
							<SelectItem key={item.value || "placeholder"} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
