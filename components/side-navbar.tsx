import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import { Tab, Tabs } from "@heroui/tabs";
import { Key } from "@react-types/shared";
import { useState } from "react";

import { HomeIcon, ProfileIcon } from "./icons";

import { useGlobalStore } from "@/store";

export const SideNavbar = () => {
  const router = useRouter();

  const [key, setKey] = useState<Key>("/");

  const onSelectionChange = (key: Key) => {
    setKey(key);
    router.push(String(key));
  };
  const { globalState } = useGlobalStore((state) => state);

  return (
    <div className="flex flex-row h-full fixed w-2/12">
      <div className="flex flex-col flex-1 items-start gap-2 h-full py-10">
        <Tabs
          fullWidth
          isVertical
          aria-label="Options"
          selectedKey={key}
          variant="light"
          onSelectionChange={onSelectionChange}
        >
          <Tab
            key="/"
            title={
              <div className="flex flex-row items-center gap-2">
                <HomeIcon />
                <p className="text-md">Home</p>
              </div>
            }
          />
          {globalState.auth && (
            <Tab
              key="/profile"
              title={
                <div className="flex flex-row items-center gap-2">
                  <ProfileIcon />
                  <p className="text-md">Profile</p>
                </div>
              }
            />
          )}
        </Tabs>

        {globalState.auth && (
          <>
            {/* <Button
              className="text-md text-default-600"
              color="default"
              startContent={<NotificationIcon />}
              variant="light"
            >
              Notification
            </Button>
            <Button
              className="text-md text-default-600"
              color="default"
              startContent={<ChatIcon />}
              variant="light"
            >
              Chat
            </Button> */}
          </>
        )}
      </div>
      <div>
        <Divider orientation="vertical" />
      </div>
    </div>
  );
};
