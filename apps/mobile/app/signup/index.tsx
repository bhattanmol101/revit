import SignUpScreen from "@revit/app/features/auth/sign-up-screen"
import {Stack} from "expo-router";

export default function SignUp() {
    return<>
        <Stack.Screen
            options={{
                headerShown: false,
            }}
        />
        <SignUpScreen/>
    </>
}
