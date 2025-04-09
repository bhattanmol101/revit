import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";

import { HomeIcon, NotificationIcon } from "./icons";

import { useGlobalStore } from "@/store";

export const SideNavbar = () => {
  const router = useRouter();
  const { globalState } = useGlobalStore((state) => state);

  return (
    <div className="flex flex-row h-full fixed w-2/12">
      <div className="flex flex-col flex-1 items-start gap-2 h-full py-10">
        <Button
          className="text-md text-default-600"
          color="default"
          startContent={<HomeIcon />}
          variant="light"
          onPress={() => {
            router.push("/");
          }}
        >
          Home
        </Button>
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
            <Button
              className="text-md text-default-600"
              color="default"
              startContent={<NotificationIcon />}
              variant="light"
              onPress={() => {
                router.push("/profile");
              }}
            >
              Profile
            </Button>
          </>
        )}
      </div>
      <div>
        <Divider orientation="vertical" />
      </div>
    </div>
  );
};
