import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface WelcomeEmailProps {
	username?: string;
}

const WelcomeEmail = ({ username }: WelcomeEmailProps) => {
	return (
		<Html dir="ltr" lang="en">
			<Head />
			<Preview>Welcome to our community! Let's get you started.</Preview>
			<Tailwind>
				<Body className="bg-gray-100 font-sans py-[40px]">
					<Container className="bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto">
						{/* Header */}
						<Section className="text-center mb-[32px]">
							<Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[16px]">
								Welcome to Our Community!
							</Heading>
							<Text className="text-[16px] text-gray-600 m-0">
								Hi {username}, we're thrilled to have you on board
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="mb-[32px]">
							<Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
								Thank you for joining us! You're now part of an amazing
								community where you can discover new opportunities, connect with
								like-minded people, and achieve your goals.
							</Text>

							<Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
								Here's what you can do next:
							</Text>

							{/* Action Items */}
							<Section className="mb-[24px]">
								<Text className="text-[14px] text-gray-700 mb-[8px] font-semibold">
									✓ Complete your profile
								</Text>
								<Text className="text-[14px] text-gray-600 mb-[16px] ml-[20px]">
									Add your information to help others connect with you
								</Text>

								<Text className="text-[14px] text-gray-700 mb-[8px] font-semibold">
									✓ Explore our features
								</Text>
								<Text className="text-[14px] text-gray-600 mb-[16px] ml-[20px]">
									Discover all the tools and resources available to you
								</Text>

								<Text className="text-[14px] text-gray-700 mb-[8px] font-semibold">
									✓ Join the conversation
								</Text>
								<Text className="text-[14px] text-gray-600 mb-[16px] ml-[20px]">
									Connect with other members and start building relationships
								</Text>
							</Section>

							{/* CTA Button */}
							<Section className="text-center mb-[32px]">
								<Button
									className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border"
									href="http://localhost:3000"
								>
									Get Started Now
								</Button>
							</Section>

							<Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
								If you have any questions or need help getting started, don't
								hesitate to reach out to our support team. We're here to help
								you succeed!
							</Text>
						</Section>

						<Hr className="border-gray-200 my-[32px]" />

						{/* Footer */}
						<Section>
							<Text className="text-[14px] text-gray-500 text-center mb-[16px]">
								Thanks for choosing us,
								<br />
								The Team
							</Text>

							<Text className="text-[12px] text-gray-400 text-center m-0 mb-[8px]">
								123 Business Street, Suite 100
								<br />
								City, State 12345
							</Text>

							<Text className="text-[12px] text-gray-400 text-center m-0">
								<Link
									className="text-gray-400 underline"
									href="https://example.com/unsubscribe"
								>
									Unsubscribe
								</Link>
								{" • "}© 2025 Company Name. All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default WelcomeEmail;
