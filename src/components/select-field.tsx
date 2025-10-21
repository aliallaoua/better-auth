import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/hooks/form-context";
import { Field, FieldError } from "./ui/field";

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

	return (
		<Field data-invalid={isInvalid} orientation="responsive">
			<Select
				name={field.name}
				onValueChange={field.handleChange}
				value={field.state.value}
			>
				<SelectTrigger
					className="w-full"
					aria-invalid={isInvalid}
					id={field.name}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position="item-aligned">
					<SelectGroup>
						<SelectLabel>{label}</SelectLabel>
						{values.map((value) => (
							<SelectItem key={value.value} value={value.value}>
								{value.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
