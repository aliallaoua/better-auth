import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
	username: string;
	userEmail: string;
	resetLink: string;
}

const ResetPasswordEmail = ({
	username,
	userEmail,
	resetLink,
}: ResetPasswordEmailProps) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>Reset your password - Action required</Preview>
				<Body className="bg-gray-100 py-10 font-sans">
					<Container className="mx-auto max-w-2xl rounded-lg bg-white p-10 shadow-sm">
						{/* Header */}
						<Section className="mb-8 text-center">
							<Heading className="m-0 mb-2 font-bold text-3xl text-gray-900">
								Reset Your Password
							</Heading>
							<Text className="m-0 text-base text-gray-600">
								We received a request to reset your password
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="mb-8">
							<Text className="m-0 mb-4 text-base text-gray-700 leading-6">
								Hello {username},
							</Text>
							<Text className="m-0 mb-4 text-base text-gray-700 leading-6">
								We received a password reset request for your account associated
								with <strong>{userEmail}</strong>. If you didn't make this
								request, you can safely ignore this email.
							</Text>
							<Text className="m-0 mb-6 text-base text-gray-700 leading-6">
								To reset your password, click the button below. This link will
								expire in 24 hours for security reasons.
							</Text>
						</Section>

						{/* Reset Button */}
						<Section className="mb-8 text-center">
							<Button
								href={resetLink}
								className="box-border rounded-lg bg-blue-600 px-8 py-4 font-semibold text-base text-white no-underline transition-colors hover:bg-blue-700"
							>
								Reset My Password
							</Button>
						</Section>

						{/* Alternative Link */}
						<Section className="mb-8">
							<Text className="m-0 mb-2 text-gray-600 text-sm leading-5">
								If the button above doesn't work, copy and paste this link into
								your browser:
							</Text>
							<Link
								href={resetLink}
								className="break-all text-blue-600 text-sm underline"
							>
								{resetLink}
							</Link>
						</Section>

						{/* Security Notice */}
						<Section className="mb-8 rounded-lg bg-gray-50 p-5">
							<Text className="m-0 mb-2 font-semibold text-gray-700 text-sm leading-5">
								🔒 Security Notice
							</Text>
							<Text className="m-0 text-gray-600 text-sm leading-5">
								For your security, this password reset link will expire in 24
								hours. If you didn't request this reset, please contact our
								support team immediately.
							</Text>
						</Section>

						{/* Footer */}
						<Section className="border-gray-200 border-t pt-6">
							<Text className="m-0 mb-2 text-gray-500 text-xs leading-4">
								Best regards,
								<br />
								The Security Team
							</Text>
							<Text className="m-0 mb-4 text-gray-500 text-xs leading-4">
								123 Security Street, Safe City, SC 12345
							</Text>
							<Text className="m-0 text-gray-500 text-xs leading-4">
								© 2025 Your Company. All rights reserved. |
								<Link href="#" className="ml-1 text-gray-500 underline">
									Unsubscribe
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

ResetPasswordEmail.PreviewProps = {
	username: "Ali",
	userEmail: "ali@example.com",
	resetLink: "https://yourapp.com/reset-password?token=abc123xyz789",
};

export default ResetPasswordEmail;
