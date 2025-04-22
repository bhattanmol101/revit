import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { SharedSelection } from "@heroui/system";

import { FileInput } from "../../../components/ui/FileInput";
import { savePostAction } from "../action";

import FileSlider from "./file-slider";

import { PageState } from "@/types";
import { initPostState } from "@/utils/utils";
import { useGlobalStore } from "@/store";
import { INDUSTRIES } from "@/utils/constants";

export default function AddForumModal(props: any) {
  const { isOpen, onOpenChange } = props;

  const { globalState } = useGlobalStore((state) => state);

  const [pageState, setPageState] = useState<PageState>(initPostState());

  const [name, setName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");

  const onSelectionChange = (keys: SharedSelection) => {
    console.log(keys);
  };

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
    setPageState((prevState) => ({
      ...prevState,
      disabled: true,
      loading: true,
    }));

    const res = await savePostAction(
      String(globalState.user?.id),
      "text",
      files
    );

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
        <ModalHeader className="flex flex-col gap-1">
          Add your business details
        </ModalHeader>
        <ModalBody className="flex flex-col items-center">
          <FileInput
            accept="image/*"
            className="w-28 h-28 rounded-full"
            handleFileUpload={() => {}}
            icon={<Avatar className="w-28 h-28" src={""} />}
          />
          <p className="text-default-700 text-small pb-2">Add Logo</p>
          <div className="flex flex-row items-center gap-2 w-full">
            <Input
              errorMessage="Please enter a valid name"
              label="Name"
              name="name"
              placeholder="e.g. aeradron"
              type="text"
              variant="faded"
              onValueChange={setName}
            />
            <Input
              errorMessage="Please enter a valid name"
              label="Owner Name"
              name="onwerName"
              placeholder="e.g. Anmol Bhat"
              type="text"
              variant="faded"
              onValueChange={setOwnerName}
            />
          </div>
          <Textarea
            aria-label="Description"
            className="col-span-12 md:col-span-6 mb-6 md:mb-0 whitespace-pre"
            maxRows={100}
            placeholder="Tell in brief about the business"
            variant="faded"
            onValueChange={setDescription}
          />
          <div className="flex flex-row items-center gap-2 w-full">
            <Input
              errorMessage="Please enter a valid location"
              label="Location"
              name="location"
              placeholder="e.g. Bangalore, Karnataka"
              type="text"
              variant="faded"
              onValueChange={setLocation}
            />
            <Input
              errorMessage="Please enter a valid website"
              label="Website"
              name="website"
              placeholder="e.g. https://aeradron.in"
              type="text"
              variant="faded"
              onValueChange={setWebsite}
            />
          </div>
          <div className="flex flex-row items-center gap-2 w-full">
            <Input
              errorMessage="Please enter a valid contact"
              label="Contact"
              name="contact"
              placeholder="e.g. 7889922321"
              type="text"
              variant="faded"
              onValueChange={setContact}
            />
            <Select
              className="max-w-xs"
              label="Select your Industry"
              name="industry"
              variant="faded"
              onSelectionChange={onSelectionChange}
            >
              {INDUSTRIES.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
          </div>
          <FileSlider files={files} onFileRemove={onFileRemove} />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            isDisabled={pageState.disabled}
            isLoading={pageState.loading}
            spinnerPlacement="end"
            onPress={onSubmit}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
