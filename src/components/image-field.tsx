import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { ErrorMessages } from "./ErrorMessages";
import { Field, FieldLabel } from "./ui/field";
import { InputGroupInput } from "./ui/input-group";

type ImageFieldsProps = React.ComponentProps<"input"> & {
	label?: string;
};

export default function ImageField({
	className,
	label = "",
	...props
}: ImageFieldsProps) {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<InputGroupInput
				accept="image/*"
				className={cn(className)}
				data-slot="input-group-control"
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				type="file"
				// value={field.state.value}
				{...props}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}
