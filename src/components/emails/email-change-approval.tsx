import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface EmailChangeApprovalProps {
	username: string;
	oldEmail: string;
	newEmail: string;
	url: string;
	token: string;
}

const EmailChangeApproval = ({
	username,
	oldEmail,
	newEmail,
	url,
	token,
}: EmailChangeApprovalProps) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 py-10 font-sans">
					<Container className="mx-auto max-w-2xl rounded-lg bg-white p-10 shadow-sm">
						{/* Header */}
						<Section>
							<Heading className="m-0 mb-8 text-center font-bold text-3xl text-gray-900">
								Email Change Approved ✅
							</Heading>
						</Section>

						{/* Main Content */}
						<Section>
							<Text className="m-0 mb-6 text-base text-gray-700 leading-6">
								Hello {username},
							</Text>

							<Text className="m-0 mb-6 text-base text-gray-700 leading-6">
								We're writing to confirm that your email address change request
								has been successfully approved and processed.
							</Text>

							<Section className="mb-8 rounded-lg bg-gray-50 p-6">
								<Text className="m-0 mb-4 font-semibold text-gray-600 text-sm">
									CHANGE DETAILS:
								</Text>
								<Text className="m-0 mb-2 text-gray-700 text-sm">
									<strong>Username:</strong> {username}
								</Text>
								<Text className="m-0 mb-2 text-gray-700 text-sm">
									<strong>Previous Email:</strong> {oldEmail}
								</Text>
								<Text className="m-0 mb-4 text-gray-700 text-sm">
									<strong>New Email:</strong> {newEmail}
								</Text>
								<Text className="m-0 mb-2 text-gray-500 text-xs">
									<strong>Verification Token:</strong>
								</Text>
								<Text className="m-0 break-all rounded bg-gray-100 p-2 font-mono text-gray-600 text-xs">
									{token}
								</Text>
							</Section>

							<Text className="m-0 mb-6 text-base text-gray-700 leading-6">
								To complete the email change process, please click the button
								below to verify your new email address:
							</Text>
						</Section>

						{/* Verification Button */}
						<Section className="mb-8 text-center">
							<Button
								href={url}
								className="box-border rounded bg-green-600 px-8 py-4 font-semibold text-base text-white no-underline"
							>
								Verify New Email Address
							</Button>
						</Section>

						<Section>
							<Text className="m-0 mb-4 text-gray-600 text-sm leading-5">
								If the button doesn't work, you can also copy and paste this
								link into your browser:
							</Text>
							<Text className="m-0 break-all rounded bg-gray-50 p-3 font-mono text-blue-600 text-xs">
								{url}
							</Text>
						</Section>

						{/* Security Notice */}
						<Section className="mt-8 mb-8 border-orange-500 border-l-4 border-solid pl-4">
							<Text className="m-0 mb-2 font-semibold text-orange-700 text-sm">
								Security Notice
							</Text>
							<Text className="m-0 text-gray-600 text-sm leading-5">
								If you did not request this email change, please ignore this
								email and contact our support team immediately. This
								verification link will expire in 24 hours for security purposes.
							</Text>
						</Section>

						<Hr className="my-8 border-gray-200" />

						{/* Footer */}
						<Section>
							<Text className="m-0 mb-2 text-center text-gray-500 text-xs leading-4">
								This email was sent to confirm your email address change
								request.
							</Text>
							<Text className="m-0 mb-4 text-center text-gray-500 text-xs leading-4">
								© 2024 Your Company Name. All rights reserved.
							</Text>
							<Text className="m-0 text-center text-gray-500 text-xs leading-4">
								123 Business Street, Suite 100, City, State 12345
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

EmailChangeApproval.PreviewProps = {
	username: "Ali",
	oldEmail: "ali.old@example.com",
	newEmail: "ali.new@example.com",
	url: "https://yourapp.com/verify-email-change?token=abc123xyz789",
	token: "abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567",
};

export default EmailChangeApproval;
