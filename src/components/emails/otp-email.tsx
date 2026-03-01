import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OTPEmailProps {
  otp?: string;
  expiresIn?: number;
}

const OtpVerificationEmail = ({
  otp = "123456",
  expiresIn = 5,
}: OTPEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Tailwind>
      <Body className="bg-white font-sans mx-auto my-0">
        <Preview>رمز التحقق الخاص بك في سديد</Preview>
        <Container className="mx-auto my-0 py-0 px-5">
          <Section className="mt-8 text-center">
            <Text className="text-2xl font-bold text-[#1d1c1d] m-0">سديد</Text>
          </Section>

          <Heading className="text-[#1d1c1d] text-4xl font-bold my-[30px] mx-0 p-0 leading-[42px] text-right">
            تأكيد عنوان بريدك الإلكتروني
          </Heading>

          <Text className="text-xl mb-7.5 text-right">
            رمز التأكيد الخاص بك موجود أدناه - أدخله في نافذة المتصفح المفتوحة
            وسنساعدك في تسجيل الدخول.
          </Text>

          <Section className="bg-[rgb(245,244,245)] rounded mb-[30px] py-10 px-[10px]">
            <Text className="text-3xl leading-[24px] text-center align-middle font-mono tracking-[4px]">
              {otp}
            </Text>
          </Section>

          <Text className="text-red-600 text-sm leading-6 text-center mb-4">
            هذا الرمز صالح لمدة {expiresIn} دقائق فقط
          </Text>

          <Text className="text-black text-sm leading-6 text-right">
            إذا لم تطلب هذا البريد الإلكتروني، فلا داعي للقلق، يمكنك تجاهله
            بأمان.
          </Text>

          <Section className="text-right">
            <Text className="text-xs leading-[15px] text-right mb-[50px] text-[#b7b7b7]">
              ©٢٠٢٦ فريق سديد. جميع الحقوق محفوظة. <br />
              الجزائر، عنابة <br />
              <br />
              هذه رسالة تلقائية، يرجى عدم الرد عليها.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

OtpVerificationEmail.PreviewProps = {
  otp: "123456",
  expiresIn: 5,
} as OTPEmailProps;

export default OtpVerificationEmail;
