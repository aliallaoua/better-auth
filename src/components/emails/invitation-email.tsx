import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import { Image } from "@unpic/react";

interface InvitationEmailProps {
	username?: string;
	invitedByUsername?: string;
	invitedByEmail?: string;
	teamName?: string;
	teamImage?: string;
	inviteLink?: string;
}

const InvitationEmail = ({
	username,
	invitedByUsername,
	invitedByEmail,
	teamName,
	teamImage,
	inviteLink,
}: InvitationEmailProps) => {
	const previewText = `Join ${invitedByUsername} on BetterAuth`;
	return (
		<Html>
			<Tailwind>
				<Head />
				<Preview>{previewText}</Preview>
				<Body className="mx-auto my-auto bg-white px-2 font-sans">
					<Container className="mx-auto my-10 max-w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
							Join <strong>{invitedByUsername}</strong> on{" "}
							<strong>Better Auth.</strong>
						</Heading>
						<Text className="text-[14px] text-black leading-6">
							Hello there,
						</Text>
						<Text className="text-[14px] text-black leading-6">
							<strong>{invitedByUsername}</strong> (
							<Link
								className="text-blue-600 no-underline"
								href={`mailto:${invitedByEmail}`}
							>
								{invitedByEmail}
							</Link>
							) has invited you to the <strong>{teamName}</strong> team on{" "}
							<strong>Better Auth</strong>.
						</Text>
						<Section>
							{teamImage && (
								<Section className="my-5">
									<Row>
										<Column align="left">
											<Image
												alt={`${teamName} team image`}
												className="rounded-full"
												fetchPriority="high"
												height={64}
												src={teamImage}
												width={64}
											/>
										</Column>
									</Row>
								</Section>
							)}
						</Section>
						<Section className="mt-8 mb-8 text-center">
							<Button
								className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
								href={inviteLink}
							>
								Join the team
							</Button>
						</Section>
						<Text className="text-[14px] text-black leading-6">
							or copy and paste this URL into your browser:{" "}
							<Link className="text-blue-600 no-underline" href={inviteLink}>
								{inviteLink}
							</Link>
						</Text>
						<Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
						<Text className="text-[#666666] text-[12px] leading-6">
							This invitation was intended for{" "}
							<span className="text-black">{username}</span>. If you were not
							expecting this invitation, you can ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

InvitationEmail.PreviewProps = {
	username: "Seif Eddine",
	invitedByUsername: "Ali",
	invitedByEmail: "ali@company.com",
	teamName: "Development Team",
	teamImage: "https://new.email/static/app/placeholder.png",
	inviteLink: "https://betterauth.com/invite/abc123",
};

export default InvitationEmail;
