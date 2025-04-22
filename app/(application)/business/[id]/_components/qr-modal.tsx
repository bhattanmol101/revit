import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import Image from "next/image";

export default function QRModal({
  image,
  isOpen,
  onOpenChange,
}: {
  image?: Blob;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const onDownloadPress = async () => {
    if (!image) {
      return;
    }
    const url = URL.createObjectURL(image);
    const a = document.createElement("a");

    a.href = url;

    a.download = "revit-qr.jpg";
    document.body.appendChild(a);
    a.click();

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
        <ModalHeader className="border-b-1">
          Revit QR code for your business
        </ModalHeader>
        <ModalBody className="flex flex-col justify-center items-center py-4">
          <p>
            Please download and use this QR code to collect reviews from
            customers
          </p>
          {image && (
            <Image
              priority
              alt="logo"
              className="sm:h-full h-16 py-4"
              height={200}
              src={URL.createObjectURL(image)}
              width={200}
            />
          )}
          <p>To customise the review form please contact us.</p>
        </ModalBody>
        <ModalFooter className="border-t-1">
          <Button color="primary" onPress={onDownloadPress}>
            Download
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
