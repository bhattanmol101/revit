import {Spinner, YStack} from "tamagui";

export const Loader = ({size}:{size: "small" | "large" | undefined}) => {
    return (
        <YStack flex={1} items="center" justifyContent="center" bg="$background">
            <Spinner size={size} />
        </YStack>
    )
}