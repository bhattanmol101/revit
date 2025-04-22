import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import { Tab, Tabs } from "@heroui/tabs";
import { Key } from "@react-types/shared";
import { useState } from "react";
import { Button } from "@heroui/button";

import {
  AddIcon,
  BusinessIcon,
  ForumIcon,
  HomeIcon,
  ProfileIcon,
} from "../../../components/icons";

import { useGlobalStore } from "@/store";

export const SideNavbar = () => {
  const { globalState } = useGlobalStore((state) => state);

  const router = useRouter();

  const [key, setKey] = useState<Key>("/");

  const onSelectionChange = (key: Key) => {
    setKey(key);
    router.push(String(key));
  };

  const onAddBusinessPress = () => {
    router.push("/business/create");
  };

  return (
    <div className="flex flex-col h-full fixed w-2/12">
      <div className="flex flex-row h-full">
        <div className="flex flex-col flex-1 items-start gap-2 h-full py-10 px-2">
          <Tabs
            fullWidth
            isVertical
            aria-label="Options"
            classNames={{
              tab: "flex flex-row items-center justify-start",
            }}
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
              <>
                <Tab
                  key="/profile"
                  title={
                    <div className="flex flex-row items-center gap-2">
                      <ProfileIcon />
                      <p className="text-md">Profile</p>
                    </div>
                  }
                />
                <Tab
                  key="/forums"
                  title={
                    <div className="flex flex-row items-center gap-2">
                      <ForumIcon />
                      <p className="text-md">Forums</p>
                    </div>
                  }
                />
                <Tab
                  key="/business"
                  title={
                    <div className="flex flex-row items-center gap-2">
                      <BusinessIcon />
                      <p className="text-md">Business</p>
                    </div>
                  }
                />
              </>
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
          <Divider />
          <div className="w-full py-2">
            <Button
              fullWidth={true}
              startContent={<AddIcon />}
              variant="faded"
              // onPress={onOpen}
            >
              <p className="text-sm">Create a revit forum</p>
            </Button>
          </div>
          <Divider />
          <div className="w-full py-2">
            <Button
              fullWidth={true}
              startContent={<AddIcon />}
              variant="faded"
              onPress={onAddBusinessPress}
            >
              <p className="text-sm">Grow your business on revit</p>
            </Button>
          </div>
        </div>
        <div>
          <Divider orientation="vertical" />
        </div>
      </div>
    </div>
  );
};
