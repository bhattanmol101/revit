import SignInScreen from "@revit/app/features/auth/sign-in-screen"
import {Stack} from "expo-router";

export default function SignIn() {
    return<>
        <Stack.Screen
            options={{
                title: 'Signin',
            }}
        />
        <SignInScreen/>
    </>
}
