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

interface WelcomeEmailProps {
  name?: string
  email: string
}

export const WelcomeEmail = ({ name, email }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Hidrazy - Your AI English Learning Journey Begins!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Hidrazy! 🎉</Heading>
        
        <Text style={text}>
          Hello {name || 'there'}! 👋
        </Text>
        
        <Text style={text}>
          Welcome to Hidrazy, your AI-powered English conversation partner! We're thrilled to have you join our community of learners.
        </Text>

        <Section style={section}>
          <Heading style={h2}>What's Next?</Heading>
          <Text style={text}>
            <strong>✓ Meet Razia:</strong> Your warm, culturally-aware AI conversation partner designed specifically for Arabic speakers
          </Text>
          <Text style={text}>
            <strong>✓ Start Practicing:</strong> Jump into real-time voice conversations to improve your fluency
          </Text>
          <Text style={text}>
            <strong>✓ Track Progress:</strong> Watch your confidence grow with detailed analytics and personalized feedback
          </Text>
          <Text style={text}>
            <strong>✓ IELTS Preparation:</strong> Access comprehensive test preparation materials
          </Text>
        </Section>

        <Section style={buttonContainer}>
          <Link
            href="https://your-domain.lovable.app"
            style={button}
          >
            Start Learning Now
          </Link>
        </Section>

        <Text style={text}>
          Have questions? Reply to this email or reach out to our support team. We're here to help you succeed!
        </Text>

        <Text style={text}>
          Happy learning! 🚀<br />
          The Hidrazy Team
        </Text>

        <Text style={footer}>
          You're receiving this email because you signed up for Hidrazy at {email}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

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

const h2 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const section = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3B82F6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}