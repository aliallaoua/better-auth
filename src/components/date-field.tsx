import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Field, FieldError } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function DateField() {
	const field = useFieldContext<string>();

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	const [open, setOpen] = useState(false);

	return (
		<Field data-invalid={isInvalid}>
			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild>
					<Button
						className={cn(
							"w-full cursor-pointer justify-start text-left font-normal",
							!field.state.value && "text-muted-foreground"
						)}
						id={field.name}
						variant="outline"
					>
						<CalendarIcon className="mr-2 size-4" />
						{field.state.value
							? format(field.state.value, "PPP")
							: "Pick a date"}
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-auto overflow-hidden p-0">
					<Calendar
						// disabled={(date) => date < new Date()}
						captionLayout="dropdown"
						disabled={{
							before: new Date(),
						}}
						mode="single"
						onSelect={(date) => {
							field.handleChange(date);
							setOpen(false);
						}}
						selected={field.state.value}
					/>
				</PopoverContent>
			</Popover>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
