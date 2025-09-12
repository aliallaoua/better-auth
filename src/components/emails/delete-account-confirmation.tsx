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

interface DeleteAccountConfirmationProps {
	username: string;
	userEmail: string;
	url: string;
	token: string;
}

const DeleteAccountConfirmation = ({
	username,
	userEmail,
	url,
	token,
}: DeleteAccountConfirmationProps) => {
	const confirmationUrl = `${url}?token=${token}`;

	return (
		<Html dir="ltr" lang="en">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white px-[40px] py-[40px]">
						<Section>
							<Heading className="mb-[24px] text-center font-bold text-[24px] text-gray-900">
								Confirm Account Deletion
							</Heading>

							<Text className="mb-[16px] text-[16px] text-gray-700">
								Hello {username},
							</Text>

							<Text className="mb-[16px] text-[16px] text-gray-700">
								We received a request to permanently delete the account
								associated with <strong>{userEmail}</strong>. This action cannot
								be undone and will result in the permanent loss of all your
								data, including:
							</Text>

							<Text className="mb-[8px] ml-[16px] text-[14px] text-gray-600">
								• Your profile information
							</Text>
							<Text className="mb-[8px] ml-[16px] text-[14px] text-gray-600">
								• All saved content and preferences
							</Text>
							<Text className="mb-[8px] ml-[16px] text-[14px] text-gray-600">
								• Account history and activity
							</Text>
							<Text className="mb-[24px] ml-[16px] text-[14px] text-gray-600">
								• Any associated subscriptions or services
							</Text>

							<Section className="mb-[24px] rounded-[8px] border border-red-200 bg-red-50 p-[16px]">
								<Text className="mb-[8px] font-semibold text-[14px] text-red-800">
									⚠️ Warning: This action is irreversible
								</Text>
								<Text className="m-0 text-[14px] text-red-700">
									Once you confirm the deletion, your account and all associated
									data will be permanently removed from our systems within 24
									hours.
								</Text>
							</Section>

							<Text className="mb-[24px] text-[16px] text-gray-700">
								If you're sure you want to proceed with deleting your account,
								please click the button below to confirm:
							</Text>

							<Section className="mb-[32px] text-center">
								<Button
									className="box-border rounded-[8px] bg-red-600 px-[32px] py-[12px] font-semibold text-[16px] text-white no-underline"
									href={confirmationUrl}
								>
									Confirm Account Deletion
								</Button>
							</Section>

							<Text className="mb-[16px] text-[14px] text-gray-600">
								If you didn't request this account deletion, please ignore this
								email or contact our support team immediately. Your account will
								remain active and secure.
							</Text>

							<Text className="mb-[32px] text-[14px] text-gray-600">
								This confirmation link will expire in 24 hours for security
								purposes.
							</Text>

							<Hr className="my-[32px] border-gray-200" />

							<Text className="mb-[8px] text-[12px] text-gray-500">
								Best regards,
								<br />
								The Security Team
							</Text>

							<Text className="m-0 text-[12px] text-gray-500">
								123 Security Street, Safe City, SC 12345
								<br />
								<a
									className="text-gray-500 underline"
									href="mailto:support@company.com"
								>
									support@company.com
								</a>{' '}
								|
								<a className="ml-[8px] text-gray-500 underline" href="#">
									Unsubscribe
								</a>
							</Text>

							<Text className="m-0 mt-[16px] text-[12px] text-gray-400">
								© {new Date().getFullYear()} Company Name. All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

DeleteAccountConfirmation.PreviewProps = {
	username: 'John Doe',
	userEmail: 'john.doe@example.com',
	url: 'https://yourapp.com/confirm-delete',
	token: 'abc123xyz789',
};

export default DeleteAccountConfirmation;
