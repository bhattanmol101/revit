import LandingScreen from '@revit/app/features/landing'
import {Stack} from "expo-router";

export default function Screen() {

    return     <><Stack.Screen
        options={{
            headerShown: false,
        }}
    /><LandingScreen /></>
}