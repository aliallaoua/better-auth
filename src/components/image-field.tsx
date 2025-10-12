import { useStore } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { ErrorMessages } from "./ErrorMessages";
import { Field, FieldLabel } from "./ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./ui/input-group";

type ImageFieldsProps = React.ComponentProps<"input"> & {
	label?: string;
	showButton?: boolean;
	handleAction?: () => void;
};

export default function ImageField({
	className,
	label = "",
	showButton = false,
	handleAction,
	...props
}: ImageFieldsProps) {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<InputGroup>
				<InputGroupInput
					accept="image/*"
					className={cn(className)}
					data-slot="input-group-control"
					onBlur={field.handleBlur}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						field.handleChange(e.target.value)
					}
					type="file"
					// value={field.state.value}
					{...props}
				/>
				{showButton && (
					<InputGroupAddon align="inline-end">
						<InputGroupButton size="icon-xs" onClick={handleAction}>
							<X />
						</InputGroupButton>
					</InputGroupAddon>
				)}
			</InputGroup>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}
