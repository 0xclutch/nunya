import { useEffect } from 'react';
import { startAuthentication } from '@simplewebauthn/browser';
import { supabase } from './supabaseClient';

const FaceIDAuth = ({ userKey, onSuccess, onFailure }) => {
    useEffect(() => {
        const authenticateWithFaceID = async () => {
            try {
                // Fetch user's credential from the database
                const { data, error } = await supabase
                    .from('users')
                    .select('credential')
                    .eq('uuid', userKey)
                    .single();

                if (error || !data) throw new Error('No Face ID credential found');

                const credential = data.credential;

                // Start Face ID authentication
                const authResult = await startAuthentication(credential);

                if (authResult) {
                    onSuccess();
                } else {
                    onFailure();
                }
            } catch (err) {
                console.error('Face ID failed:', err.message);
                onFailure();
            }
        };

        authenticateWithFaceID();
    }, [userKey]);

    return null; // This component doesn't render anything, it just runs Face ID authentication
};

export default FaceIDAuth;
