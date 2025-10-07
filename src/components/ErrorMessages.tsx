import { FieldError } from "./ui/field";

export function ErrorMessages({
	errors,
}: {
	errors: Array<string | { message: string }>;
}) {
	return (
		<>
			{errors.map((error) => (
				<FieldError key={typeof error === "string" ? error : error.message}>
					{typeof error === "string" ? error : error.message}
				</FieldError>
			))}
		</>
	);
}
