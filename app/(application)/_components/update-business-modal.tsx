import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { FormEvent, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { SharedSelection } from "@heroui/system";
import { Form } from "@heroui/form";

import { FileInput } from "../../../components/ui/FileInput";
import { updateBusinessAction } from "../business/action";

import { PageState } from "@/types";
import { initPostState } from "@/utils/utils";
import { useGlobalStore } from "@/store";
import { INDUSTRIES } from "@/utils/constants";
import { Business, BusinessRequest } from "@/types/business";
import { validateContact } from "@/utils/validators";

export default function UpdateBusinessModal({
  isOpen,
  onOpenChange,
  business,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  business: Business;
}) {
  const { globalState } = useGlobalStore((state) => state);

  const [pageState, setPageState] = useState<PageState>(initPostState());

  const [name, setName] = useState<string>(business.name);
  const [ownerName, setOwnerName] = useState<string>(business.ownerName);
  const [logo, setLogo] = useState<Blob>();
  const [location, setLocation] = useState<string>(business.location);
  const [description, setDescription] = useState<string>(business.description);
  const [website, setWebsite] = useState<string>(
    business.website ? business.website : ""
  );
  const [contact, setContact] = useState<string>(business.contact);
  const [industry, setIndustry] = useState<string>(business.industry);

  const onSelectionChange = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setIndustry(keys.currentKey.toString());
    }
  };

  const onLogoChange = (e: any) => {
    e.preventDefault();

    setLogo(e.target.files[0]);
  };

  const onModalOpenChange = () => {
    if (!pageState.disabled) {
      onOpenChange();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveBusiness();
  };

  const saveBusiness = async () => {
    setPageState((prevState) => ({
      ...prevState,
      disabled: true,
      loading: true,
    }));

    const businessRequest: BusinessRequest = {
      adminId: String(globalState.user?.id),
      name: name,
      ownerName: ownerName,
      description: description,
      location: location,
      contact: contact,
      website: website,
      industry: industry,
    };

    console.log(businessRequest);

    // TODO need to fix this
    const res = await updateBusinessAction(businessRequest, logo);

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
          {business ? "Update" : "Add"} your business details
        </ModalHeader>
        <ModalBody>
          <Form
            className="flex flex-col items-center"
            id="addBusinessForm"
            onSubmit={onSubmit}
          >
            <FileInput
              accept="image/*"
              className="w-28 h-28 rounded-full"
              handleFileUpload={onLogoChange}
              icon={
                <Avatar
                  className="w-28 h-28"
                  src={logo && URL.createObjectURL(logo)}
                />
              }
            />
            <p className="text-default-700 text-small pb-2">Add Logo</p>
            <div className="flex flex-row items-center gap-2 w-full">
              <Input
                isRequired
                errorMessage="Please enter a valid name"
                label="Name"
                name="name"
                placeholder="e.g. aeradron"
                type="text"
                value={name}
                variant="faded"
                onValueChange={setName}
              />
              <Input
                isRequired
                errorMessage="Please enter a valid name"
                label="Owner Name"
                name="onwerName"
                placeholder="e.g. Anmol Bhat"
                type="text"
                value={ownerName}
                variant="faded"
                onValueChange={setOwnerName}
              />
            </div>
            <Textarea
              isRequired
              aria-label="Description"
              className="col-span-12 md:col-span-6 mb-6 md:mb-0 whitespace-pre"
              errorMessage="Please enter valid description"
              maxRows={100}
              placeholder="Tell in brief about the business"
              value={description}
              variant="faded"
              onValueChange={setDescription}
            />
            <div className="flex flex-row items-center gap-2 w-full">
              <Input
                isRequired
                errorMessage="Please enter a valid location"
                label="Location"
                name="location"
                placeholder="e.g. Bangalore, Karnataka"
                type="text"
                value={location}
                variant="faded"
                onValueChange={setLocation}
              />
              <Input
                errorMessage="Please enter a valid website"
                label="Website"
                name="website"
                placeholder="e.g. https://aeradron.in"
                type="text"
                value={website}
                variant="faded"
                onValueChange={setWebsite}
              />
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
              <Input
                isRequired
                errorMessage="Please enter a valid contact"
                label="Contact"
                name="contact"
                placeholder="e.g. 7889922321"
                type="text"
                validate={validateContact}
                value={contact}
                variant="faded"
                onValueChange={setContact}
              />
              <Select
                isRequired
                label="Select your Industry"
                name="industry"
                selectedKeys={[industry]}
                variant="faded"
                onSelectionChange={onSelectionChange}
              >
                {INDUSTRIES.map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            form="addBusinessForm"
            isDisabled={pageState.disabled}
            isLoading={pageState.loading}
            spinnerPlacement="end"
            type="submit"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
