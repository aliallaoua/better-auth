import { useStore } from "@tanstack/react-form";
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
import { ErrorMessages } from "./ErrorMessages";
import { Field } from "./ui/field";

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
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<Select
				name={field.name}
				onValueChange={(value) => field.handleChange(value)}
				value={field.state.value}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
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
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}
