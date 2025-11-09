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
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 py-10 font-sans">
					<Container className="mx-auto max-w-2xl rounded-lg bg-white px-10 py-10">
						<Section>
							<Heading className="mb-6 text-center font-bold text-2xl text-gray-900">
								Confirm Account Deletion
							</Heading>

							<Text className="mb-4 text-base text-gray-700">
								Hello {username},
							</Text>

							<Text className="mb-4 text-base text-gray-700">
								We received a request to permanently delete the account
								associated with <strong>{userEmail}</strong>. This action cannot
								be undone and will result in the permanent loss of all your
								data, including:
							</Text>

							<Text className="mb-2 ml-4 text-gray-600 text-sm">
								• Your profile information
							</Text>
							<Text className="mb-2 ml-4 text-gray-600 text-sm">
								• All saved content and preferences
							</Text>
							<Text className="mb-2 ml-4 text-gray-600 text-sm">
								• Account history and activity
							</Text>
							<Text className="mb-6 ml-4 text-gray-600 text-sm">
								• Any associated subscriptions or services
							</Text>

							<Section className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
								<Text className="mb-2 font-semibold text-red-800 text-sm">
									⚠️ Warning: This action is irreversible
								</Text>
								<Text className="m-0 text-red-700 text-sm">
									Once you confirm the deletion, your account and all associated
									data will be permanently removed from our systems within 24
									hours.
								</Text>
							</Section>

							<Text className="mb-6 text-base text-gray-700">
								If you're sure you want to proceed with deleting your account,
								please click the button below to confirm:
							</Text>

							<Section className="mb-8 text-center">
								<Button
									href={confirmationUrl}
									className="box-border rounded-lg bg-red-600 px-8 py-3 font-semibold text-base text-white no-underline"
								>
									Confirm Account Deletion
								</Button>
							</Section>

							<Text className="mb-4 text-gray-600 text-sm">
								If you didn't request this account deletion, please ignore this
								email or contact our support team immediately. Your account will
								remain active and secure.
							</Text>

							<Text className="mb-8 text-gray-600 text-sm">
								This confirmation link will expire in 24 hours for security
								purposes.
							</Text>

							<Hr className="my-8 border-gray-200" />

							<Text className="mb-2 text-gray-500 text-xs">
								Best regards,
								<br />
								The Security Team
							</Text>

							<Text className="m-0 text-gray-500 text-xs">
								123 Security Street, Safe City, SC 12345
								<br />
								<a
									href="mailto:support@company.com"
									className="text-gray-500 underline"
								>
									support@company.com
								</a>{" "}
								|
								<a href="#" className="ml-2 text-gray-500 underline">
									Unsubscribe
								</a>
							</Text>

							<Text className="m-0 mt-4 text-gray-400 text-xs">
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
	username: "Ali",
	userEmail: "ali@example.com",
	url: "https://yourapp.com/confirm-delete",
	token: "abc123xyz789",
};

export default DeleteAccountConfirmation;
