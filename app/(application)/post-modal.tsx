import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useState } from "react";

import { ImageIcon, VideoIcon } from "../../components/icons";
import { FileInput } from "../../components/ui/FileInput";

import FileSlider from "./file-slider";
import { savePostAction } from "./action";

import { PageState } from "@/types";
import { initPostState } from "@/utils/utils";
import { useGlobalStore } from "@/store";

export default function PostModal(props: any) {
  const { isOpen, onOpenChange } = props;

  const {globalState} = useGlobalStore((state) => state)

  const [pageState, setPageState] = useState<PageState>(initPostState());

  const [text, setText] = useState<string>("");

  const [files, setFiles] = useState<Blob[]>([]);

  const onFileChange = (e: any) => {
    e.preventDefault();
    let newState = [...files];

    newState.push(...e.target.files);
    setFiles(newState);
  };

  const onFileRemove = (index: number) => {
    let newState = [...files];

    newState.splice(index, 1);
    setFiles(newState);
  };

  const onModalOpenChange = () => {
    if (!pageState.disabled) {
      onOpenChange();
    }
  };

  const onSubmit = async () => {
    console.log(text);
    setPageState((prevState) => ({
      ...prevState,
      disabled: true,
      loading: true,
    }));

    const res = await savePostAction(globalState.user?.id, text, files);

    console.log(res);

    setPageState((prevState) => ({
      ...prevState,
      disabled: false,
      loading: false,
      success: res.success,
      error: res.error,
    }));

    onOpenChange();
  };

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onModalOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Want a review</ModalHeader>
        <ModalBody>
          <Textarea
            aria-label="Description"
            className="col-span-12 md:col-span-6 mb-6 md:mb-0"
            maxRows={100}
            placeholder="What to review today..."
            variant="underlined"
            onValueChange={setText}
          />
          <FileSlider files={files} onFileRemove={onFileRemove} />
        </ModalBody>
        <ModalFooter className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <FileInput
              accept="image/*"
              handleFileUpload={onFileChange}
              icon={<ImageIcon size={22} />}
            />
            <FileInput
              accept="video/*"
              handleFileUpload={onFileChange}
              icon={<VideoIcon size={26} />}
            />
          </div>
          <Button
            color="primary"
            isDisabled={pageState.disabled}
            isLoading={pageState.loading}
            spinnerPlacement="end"
            onPress={onSubmit}
          >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
