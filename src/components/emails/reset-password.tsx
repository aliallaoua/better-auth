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

interface ForgotPasswordEmailProps {
	username: string;
	userEmail: string;
	resetLink: string;
}

const ResetPasswordEmail = ({
	username,
	userEmail,
	resetLink,
}: ForgotPasswordEmailProps) => {
	return (
		<Html dir="ltr" lang="en">
			<Tailwind>
				<Head />
				<Preview>Reset your password - Action required</Preview>
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
						{/* Header */}
						<Section className="mb-[32px] text-center">
							<Heading className="m-0 mb-[8px] font-bold text-[28px] text-gray-900">
								Reset Your Password
							</Heading>
							<Text className="m-0 text-[16px] text-gray-600">
								We received a request to reset your password
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="mb-[32px]">
							<Text className="m-0 mb-[16px] text-[16px] text-gray-700 leading-[24px]">
								Hello, {username},
							</Text>
							<Text className="m-0 mb-[16px] text-[16px] text-gray-700 leading-[24px]">
								We received a password reset request for your account associated
								with <strong>{userEmail}</strong>. If you didn't make this
								request, you can safely ignore this email.
							</Text>
							<Text className="m-0 mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								To reset your password, click the button below. This link will
								expire in 24 hours for security reasons.
							</Text>
						</Section>

						{/* Reset Button */}
						<Section className="mb-[32px] text-center">
							<Button
								className="box-border rounded-[8px] bg-blue-600 px-[32px] py-[16px] font-semibold text-[16px] text-white no-underline transition-colors hover:bg-blue-700"
								href={resetLink}
							>
								Reset My Password
							</Button>
						</Section>

						{/* Alternative Link */}
						<Section className="mb-[32px]">
							<Text className="m-0 mb-[8px] text-[14px] text-gray-600 leading-[20px]">
								If the button above doesn't work, copy and paste this link into
								your browser:
							</Text>
							<Link
								className="break-all text-[14px] text-blue-600 underline"
								href={resetLink}
							>
								{resetLink}
							</Link>
						</Section>

						{/* Security Notice */}
						<Section className="mb-[32px] rounded-[8px] bg-gray-50 p-[20px]">
							<Text className="m-0 mb-[8px] font-semibold text-[14px] text-gray-700 leading-[20px]">
								🔒 Security Notice
							</Text>
							<Text className="m-0 text-[14px] text-gray-600 leading-[20px]">
								For your security, this password reset link will expire in 24
								hours. If you didn't request this reset, please contact our
								support team immediately.
							</Text>
						</Section>

						{/* Footer */}
						<Section className="border-gray-200 border-t pt-[24px]">
							<Text className="m-0 mb-[8px] text-[12px] text-gray-500 leading-[16px]">
								Best regards,
								<br />
								The Security Team
							</Text>
							<Text className="m-0 mb-[16px] text-[12px] text-gray-500 leading-[16px]">
								123 Security Street, Safe City, SC 12345
							</Text>
							<Text className="m-0 text-[12px] text-gray-500 leading-[16px]">
								© 2025 Your Company. All rights reserved. |
								<Link className="ml-[4px] text-gray-500 underline" href="#">
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

export default ResetPasswordEmail;
