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
		<Html dir="ltr" lang="en">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
						<Section>
							<Text className="mt-0 mb-[16px] font-bold text-[24px] text-gray-900">
								Verify your email address
							</Text>

							<Text className="mt-0 mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								Thank you {username} for signing up! To complete your
								registration and secure your account, please verify your email
								address by clicking the button below.
							</Text>

							<Section className="mb-[32px] text-center">
								<Button
									className="box-border rounded-[6px] bg-blue-600 px-[32px] py-[12px] font-medium text-[16px] text-white no-underline"
									href={verifyUrl}
								>
									Verify Email Address
								</Button>
							</Section>

							<Text className="mt-0 mb-[24px] text-[14px] text-gray-600 leading-[20px]">
								If the button doesn't work, you can copy and paste this link
								into your browser:
								<br />
								<span className="text-blue-600">{verifyUrl}</span>
							</Text>

							<Text className="mt-0 mb-[32px] text-[14px] text-gray-600 leading-[20px]">
								This verification link will expire in 24 hours for security
								reasons. If you didn't create an account, you can safely ignore
								this email.
							</Text>

							<Hr className="my-[24px] border-gray-200" />

							<Text className="m-0 text-[12px] text-gray-500 leading-[16px]">
								Best regards,
								<br />
								The Team
							</Text>
						</Section>

						<Section className="mt-[40px] border-gray-200 border-t pt-[24px]">
							<Text className="m-0 text-center text-[12px] text-gray-400 leading-[16px]">
								© 2025 Your Company Name. All rights reserved.
								<br />
								123 Business Street, City, State 12345
								<br />
								<a className="text-gray-400 no-underline" href="#">
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
