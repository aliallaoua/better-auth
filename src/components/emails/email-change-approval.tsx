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
} from '@react-email/components';

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
		<Html dir="ltr" lang="en">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
						{/* Header */}
						<Section>
							<Heading className="m-0 mb-[32px] text-center font-bold text-[28px] text-gray-900">
								Email Change Approved ✅
							</Heading>
						</Section>

						{/* Main Content */}
						<Section>
							<Text className="m-0 mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								Hello {username},
							</Text>

							<Text className="m-0 mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								We're writing to confirm that your email address change request
								has been successfully approved and processed.
							</Text>

							<Section className="mb-[32px] rounded-[8px] bg-gray-50 p-[24px]">
								<Text className="m-0 mb-[16px] font-semibold text-[14px] text-gray-600">
									CHANGE DETAILS:
								</Text>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Username:</strong> {username}
								</Text>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Previous Email:</strong> {oldEmail}
								</Text>
								<Text className="m-0 mb-[16px] text-[14px] text-gray-700">
									<strong>New Email:</strong> {newEmail}
								</Text>
								<Text className="m-0 mb-[8px] text-[12px] text-gray-500">
									<strong>Verification Token:</strong>
								</Text>
								<Text className="m-0 break-all rounded-[4px] bg-gray-100 p-[8px] font-mono text-[12px] text-gray-600">
									{token}
								</Text>
							</Section>

							<Text className="m-0 mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								To complete the email change process, please click the button
								below to verify your new email address:
							</Text>
						</Section>

						{/* Verification Button */}
						<Section className="mb-[32px] text-center">
							<Button
								className="box-border rounded-[6px] bg-green-600 px-[32px] py-[16px] font-semibold text-[16px] text-white no-underline"
								href={url}
							>
								Verify New Email Address
							</Button>
						</Section>

						<Section>
							<Text className="m-0 mb-[16px] text-[14px] text-gray-600 leading-[20px]">
								If the button doesn't work, you can also copy and paste this
								link into your browser:
							</Text>
							<Text className="m-0 break-all rounded-[4px] bg-gray-50 p-[12px] font-mono text-[12px] text-blue-600">
								{url}
							</Text>
						</Section>

						{/* Security Notice */}
						<Section className="mt-[32px] mb-[32px] border-orange-500 border-l-[4px] border-solid pl-[16px]">
							<Text className="m-0 mb-[8px] font-semibold text-[14px] text-orange-700">
								Security Notice
							</Text>
							<Text className="m-0 text-[14px] text-gray-600 leading-[20px]">
								If you did not request this email change, please ignore this
								email and contact our support team immediately. This
								verification link will expire in 24 hours for security purposes.
							</Text>
						</Section>

						<Hr className="my-[32px] border-gray-200" />

						{/* Footer */}
						<Section>
							<Text className="m-0 mb-[8px] text-center text-[12px] text-gray-500 leading-[16px]">
								This email was sent to confirm your email address change
								request.
							</Text>
							<Text className="m-0 mb-[16px] text-center text-[12px] text-gray-500 leading-[16px]">
								© 2024 Your Company Name. All rights reserved.
							</Text>
							<Text className="m-0 text-center text-[12px] text-gray-500 leading-[16px]">
								123 Business Street, Suite 100, City, State 12345
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default EmailChangeApproval;
