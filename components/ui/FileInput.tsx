import { Button } from "@heroui/button";
import { ChangeEvent, ReactNode, useRef } from "react";

export function FileInput({
  className,
  icon,
  accept,
  handleFileUpload,
}: {
  className: string;
  icon: ReactNode;
  accept: string;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (!inputRef || !inputRef.current) return;

    inputRef.current.click();
  };

  return (
    <>
      <input
        ref={inputRef}
        accept={accept}
        id="contained-button-file"
        style={{ display: "none" }}
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="contained-button-file">
        <Button
          isIconOnly
          className={className}
          variant="light"
          onPress={handleButtonClick}
        >
          {icon}
        </Button>
      </label>
    </>
  );
}

export default FileInput;
