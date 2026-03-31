import {Paragraph} from "tamagui";

interface ErrorTextProps {
    error?: string;
}

export const ErrorText: React.FC<ErrorTextProps> = ({ error }) => (
    error ? <Paragraph color="$red10" fontSize="$2">
        {error}
    </Paragraph> : null
)