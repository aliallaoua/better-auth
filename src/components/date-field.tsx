import { useStore } from "@tanstack/react-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { ErrorMessages } from "./ErrorMessages";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Field } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function DateField() {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) => state.meta.errors);
	const [open, setOpen] = useState(false);

	return (
		<Field>
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
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}
