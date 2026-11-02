import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PushRegistration } from '@/components/PushRegistration';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <>
        <PushRegistration/>
            <Stack>
                <Stack.Screen name="user-profile" />
                <Stack.Screen name="conversa" options={{ headerShown: false }} />
                <Stack.Screen name="video-call" options={{ headerShown: false }} />
            </Stack>
        </>
    );
}
