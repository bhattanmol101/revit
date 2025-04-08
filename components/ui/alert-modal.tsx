import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

export default function AlertModal(props: any) {
  const { title, description, isOpen, onOpenChange, onContinue, pageState } =
    props;

  const onSubmit = async () => {
    onContinue();
    onOpenChange();
  };

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          <p>{description}</p>
        </ModalBody>
        <ModalFooter className="flex flex-row justify-end">
          <Button color="danger" onPress={onOpenChange}>
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={pageState.disabled}
            isLoading={pageState.loading}
            spinnerPlacement="end"
            onPress={onSubmit}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
