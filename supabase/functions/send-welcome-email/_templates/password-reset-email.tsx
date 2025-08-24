import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PasswordResetEmailProps {
  name?: string
  resetLink: string
}

export const PasswordResetEmail = ({ name, resetLink }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Hidrazy password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Password Reset Request</Heading>
        
        <Text style={text}>
          Hello {name || 'there'},
        </Text>
        
        <Text style={text}>
          You recently requested to reset your password for your Hidrazy account. Click the button below to reset it.
        </Text>

        <Section style={buttonContainer}>
          <Link
            href={resetLink}
            style={button}
          >
            Reset Your Password
          </Link>
        </Section>

        <Text style={text}>
          <strong>This link will expire in 1 hour</strong> for security reasons.
        </Text>

        <Text style={text}>
          If you did not request a password reset, please ignore this email or contact our support team if you have questions.
        </Text>

        <Section style={warningSection}>
          <Text style={warningText}>
            <strong>Security Tip:</strong> Never share your password reset link with anyone. Hidrazy will never ask for your password via email.
          </Text>
        </Section>

        <Text style={text}>
          Need help? Reply to this email and our support team will assist you.
        </Text>

        <Text style={text}>
          Best regards,<br />
          The Hidrazy Security Team
        </Text>

        <Text style={footer}>
          If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser:<br />
          <Link href={resetLink} style={footerLink}>{resetLink}</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '580px',
}

const h1 = {
  color: '#333',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const warningSection = {
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #dc2626',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
}

const warningText = {
  color: '#dc2626',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#8898aa',
  textDecoration: 'underline',
}