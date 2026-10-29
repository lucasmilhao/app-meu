import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="register" options={{headerShown : false}} />
            <Stack.Screen name="login" options={{headerShown : false}} />
        </Stack>
    );
}
