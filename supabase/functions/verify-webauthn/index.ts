import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Basic WebAuthn verification
// Note: For production, you should use a proper WebAuthn library
const verifyAuthenticatorAssertion = async (
  credential: any,
  challenge: Uint8Array,
  expectedOrigin: string
) => {
  try {
    // Verify challenge matches
    const clientDataJSON = JSON.parse(
      new TextDecoder().decode(new Uint8Array(credential.response.clientDataJSON))
    );

    // Check challenge
    const challengeMatches = arrayBufferEqual(
      challenge,
      base64URLDecode(clientDataJSON.challenge)
    );
    if (!challengeMatches) {
      throw new Error("Challenge doesn't match");
    }

    // Check origin
    if (clientDataJSON.origin !== expectedOrigin) {
      throw new Error("Origin doesn't match");
    }

    // Check type
    if (clientDataJSON.type !== 'webauthn.get') {
      throw new Error("Type doesn't match");
    }

    return true;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
};

// Helper function to compare ArrayBuffers
function arrayBufferEqual(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) return false;
  const a8 = new Uint8Array(a);
  const b8 = new Uint8Array(b);
  return a8.every((val, i) => val === b8[i]);
}

// Helper function to decode base64URL
function base64URLDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = str.length % 4;
  if (padding) {
    str += '='.repeat(4 - padding);
  }
  return new Uint8Array(
    atob(str)
      .split('')
      .map(c => c.charCodeAt(0))
  );
}

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }
      })
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    // Get request body
    const { credential, challenge, userId } = await req.json()

    // Get stored credential from database
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('user_credentials')
      .eq('uuid', userId)
      .single()

    if (userError || !userData?.user_credentials) {
      throw new Error('User credentials not found')
    }

    // Verify the credential matches
    if (credential.id !== userData.user_credentials.id) {
      throw new Error('Credential ID mismatch')
    }

    // Verify the assertion
    const isValid = await verifyAuthenticatorAssertion(
      credential,
      new Uint8Array(challenge),
      window.location.hostname // Replace with your actual domain
    )

    if (!isValid) {
      throw new Error('Invalid assertion')
    }

    return new Response(
      JSON.stringify({
        verified: true
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        verified: false,
        error: error.message
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})