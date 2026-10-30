import { Stack } from 'expo-router';
import React from 'react';

export const unstable_settings = {
    initialRouteName: 'login',
};

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{headerShown : false}} />
            <Stack.Screen name="register" options={{headerShown : false}} />
        </Stack>
    );
}
