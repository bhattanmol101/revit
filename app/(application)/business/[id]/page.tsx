"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import React, { useEffect, useState } from "react";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { useParams } from "next/navigation";

import { fetchBusinessByIdAction } from "../action";
import UpdateBusinessModal from "../../_components/update-business-modal";

import { fetchQRCodeAction } from "./action";
import QRModal from "./_components/qr-modal";

import { getJoingDateString } from "@/utils/date-utils";
import {
  ContactIcon,
  EditIcon,
  LocationIcon,
  WebsiteIcon,
} from "@/components/icons";
import { Business } from "@/types/business";
import { useGlobalStore } from "@/store";

function BusinessPage() {
  const { id } = useParams();

  const { globalState } = useGlobalStore((state) => state);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isQROpen,
    onOpen: onQROpen,
    onOpenChange: onQROpenChange,
  } = useDisclosure();

  const [loading, setLoading] = useState(true);

  const [business, setBusiness] = useState<Business>();
  const [qrImage, setQRImage] = useState<Blob>();
  const [qrLoading, setQRLoading] = useState<boolean>(false);

  const onGenerateQRPress = async () => {
    if (business) {
      setQRLoading(true);
      const resp = await fetchQRCodeAction(business?.id);

      setQRImage(resp);
      setQRLoading(false);
      onQROpen();
    }
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      const business = await fetchBusinessByIdAction(String(id));

      setLoading(false);
      if (business) {
        setBusiness(business);
      }
    };

    fetchBusiness();
  }, []);

  return (
    <div className="flex flex-col items-center sm:w-full w-screen sm:py-5 py-3 px-2">
      {loading && <Spinner />}
      {!loading && (
        <div className="w-full">
          <div className="flex flex-row justify-between items-start w-full px-2">
            <div className="flex flex-row items-center ">
              <Avatar
                showFallback
                className="sm:w-24 sm:h-24 h-20 w-20"
                src={String(business?.logo)}
              />
              <div className="pl-5">
                <p className="sm:text-xl font-bold">{business?.name}</p>
                <p className="text-default-600 sm:text-sm text-sm">
                  Since:{" "}
                  {business && getJoingDateString(new Date(business.createdAt))}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 p-2">
              {globalState.user?.id == business?.adminId ? (
                <Button
                  color="primary"
                  isDisabled={qrLoading}
                  isLoading={qrLoading}
                  size="sm"
                  spinnerPlacement="end"
                  onPress={onGenerateQRPress}
                >
                  Revit QR
                </Button>
              ) : (
                <Button color="primary" size="sm" spinnerPlacement="end">
                  Revit
                </Button>
              )}
              <Button
                isIconOnly
                color="default"
                size="sm"
                spinnerPlacement="end"
                onPress={onOpen}
              >
                <EditIcon size={20} />
              </Button>
            </div>
          </div>
          <Divider className="my-3" />
          <div className="flex flex-row justify-evenly items-center px-4">
            {business?.website && (
              <div className="flex flex-row items-center gap-2">
                <WebsiteIcon size={22} />
                <p className="text-default-600 sm:text-sm text-sm">
                  {business?.website}
                </p>
              </div>
            )}
            <div className="flex flex-row items-center gap-2">
              <LocationIcon size={22} />
              <p className="text-default-600 sm:text-sm text-sm">
                {business?.location}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <ContactIcon size={22} />
              <p className="text-default-600 sm:text-sm text-sm">
                {business?.contact}
              </p>
            </div>
          </div>
          <Divider className="my-3" />
          <p className="text-default-700 sm:text-sm text-sm px-2">
            {business?.description}
          </p>
          <Divider className="mt-3 mb-1" />
          {/* <div className="flex flex-col items-center w-full">
            {postLoading ? (
              <Spinner />
            ) : posts ? (
              posts.map((post) => <FeedItemCard key={post.id} post={post} />)
            ) : (
              <p>No posts yet...</p>
            )}
          </div> */}
        </div>
      )}

      {business && (
        <UpdateBusinessModal
          business={business}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
      {qrImage && (
        <QRModal
          image={qrImage}
          isOpen={isQROpen}
          onOpenChange={onQROpenChange}
        />
      )}
    </div>
  );
}

export default BusinessPage;
