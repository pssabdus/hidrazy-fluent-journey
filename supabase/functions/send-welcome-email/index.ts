import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { WelcomeEmail } from './_templates/welcome-email.tsx'
import { PasswordResetEmail } from './_templates/password-reset-email.tsx'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'welcome' | 'password_reset'
  email: string
  name?: string
  resetLink?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('[SEND-EMAIL] Request received')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Get user info if authenticated (optional for some email types)
    let user = null
    try {
      const authHeader = req.headers.get('Authorization')
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const { data } = await supabaseClient.auth.getUser(token)
        user = data.user
      }
    } catch (error) {
      console.log('[SEND-EMAIL] No authentication provided, continuing...')
    }

    const { type, email, name, resetLink }: EmailRequest = await req.json()
    
    if (!email) {
      throw new Error('Email is required')
    }

    console.log(`[SEND-EMAIL] Sending ${type} email to ${email}`)

    let emailHtml: string
    let subject: string
    let from = 'Hidrazy <onboarding@resend.dev>' // Replace with your verified domain

    switch (type) {
      case 'welcome':
        emailHtml = await renderAsync(
          React.createElement(WelcomeEmail, { name, email })
        )
        subject = 'Welcome to Hidrazy - Your AI English Learning Journey Begins!'
        break

      case 'password_reset':
        if (!resetLink) {
          throw new Error('Reset link is required for password reset emails')
        }
        emailHtml = await renderAsync(
          React.createElement(PasswordResetEmail, { name, resetLink })
        )
        subject = 'Reset your Hidrazy password'
        break

      default:
        throw new Error(`Unknown email type: ${type}`)
    }

    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject,
      html: emailHtml,
    })

    if (error) {
      console.error('[SEND-EMAIL] Resend error:', error)
      throw error
    }

    console.log('[SEND-EMAIL] Email sent successfully:', data?.id)

    // Log email activity to database (optional)
    if (user) {
      try {
        await supabaseClient.from('email_logs').insert({
          user_id: user.id,
          email_type: type,
          recipient: email,
          status: 'sent',
          email_id: data?.id
        })
      } catch (logError) {
        console.error('[SEND-EMAIL] Failed to log email activity:', logError)
        // Continue anyway, don't fail the email send
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[SEND-EMAIL] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})