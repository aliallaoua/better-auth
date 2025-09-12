export function ErrorMessages({
	errors,
}: {
	errors: Array<string | { message: string }>;
}) {
	return (
		<>
			{errors.map((error) => (
				<div
					className="mt-1 font-bold text-red-500"
					key={typeof error === 'string' ? error : error.message}
				>
					{typeof error === 'string' ? error : error.message}
				</div>
			))}
		</>
	);
}
