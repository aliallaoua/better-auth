import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface VerifyEmailProps {
	username?: string;
	verifyUrl: string;
}

const VerifyEmail = ({ username, verifyUrl }: VerifyEmailProps) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 py-10 font-sans">
					<Container className="mx-auto max-w-2xl rounded-lg bg-white p-8">
						<Section>
							<Text className="mt-0 mb-4 font-bold text-2xl text-gray-900">
								Verify your email address
							</Text>

							<Text className="mt-0 mb-6 text-base text-gray-700 leading-6">
								Thank you {username} for signing up! To complete your
								registration and secure your account, please verify your email
								address by clicking the button below.
							</Text>

							<Section className="mb-8 text-center">
								<Button
									href={verifyUrl}
									className="box-border inline-block rounded-md bg-blue-600 px-8 py-3 font-medium text-base text-white no-underline"
								>
									Verify Email Address
								</Button>
							</Section>

							<Text className="mt-0 mb-6 text-gray-600 text-sm leading-5">
								If the button doesn't work, you can copy and paste this link
								into your browser:
								<br />
								<span className="text-blue-600">{verifyUrl}</span>
							</Text>

							<Text className="mt-0 mb-8 text-gray-600 text-sm leading-5">
								This verification link will expire in 24 hours for security
								reasons. If you didn't create an account, you can safely ignore
								this email.
							</Text>

							<Hr className="my-6 border-gray-200" />

							<Text className="m-0 text-gray-500 text-xs leading-4">
								Best regards,
								<br />
								The Team
							</Text>
						</Section>

						<Section className="mt-10 border-gray-200 border-t pt-6">
							<Text className="m-0 text-center text-gray-400 text-xs leading-4">
								© 2025 Your Company Name. All rights reserved.
								<br />
								123 Business Street, City, State 12345
								<br />
								<a href="#" className="text-gray-400 no-underline">
									Unsubscribe
								</a>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default VerifyEmail;
