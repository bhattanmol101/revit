import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
import NextLink from "next/link";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import Image from "next/image";
import { Tab, Tabs } from "@heroui/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Key, KeyboardEvent } from "@react-types/shared";
import { Spinner } from "@heroui/spinner";

import logo from "../public/assets/revit-logo-small.svg";

import { HomeIcon, ProfileIcon, SearchIcon } from "@/components/icons";
import { useGlobalStore } from "@/store";
import { getAllPostByTextAction } from "@/app/(application)/action";
import { useFeedStore } from "@/app/(application)/_store";

export const Navbar = () => {
  const router = useRouter();

  const [key, setKey] = useState<Key>("/");

  const [text, setText] = useState<string>("");

  const { globalState } = useGlobalStore((state) => state);

  const { searchFeed, setSearchFeed } = useFeedStore((state) => state);

  const [loading, setLoading] = useState(false);

  const onSelectionChange = (key: Key) => {
    setKey(key);
    router.push(String(key));
  };

  const onSigninPress = () => {
    router.push("/signin");
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(text);
    }
  };

  const onValueChange = (value: string) => {
    setText(value.trim());
  };

  const handleSearch = async (text: string) => {
    setLoading(true);

    router.push("/search");

    const resp = await getAllPostByTextAction(text);

    setSearchFeed({
      ...searchFeed,
      data: resp.posts,
    });

    setLoading(false);
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm md:w-96 w-32",
      }}
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        loading ? (
          <Spinner />
        ) : (
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        )
      }
      type="search"
      onKeyDown={handleKeyPress}
      onValueChange={onValueChange}
    />
  );

  return (
    <div className="fixed md:w-[100vw] w-full z-20 top-0">
      <HeroUINavbar maxWidth="xl" position="sticky">
        <NavbarContent justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink href="/">
              <Image priority alt="logo" height={50} src={logo} />
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {globalState.auth && (
          <NavbarContent className="sm:hidden" justify="center">
            <Tabs
              fullWidth
              aria-label="Options"
              radius="full"
              selectedKey={key}
              variant="light"
              onSelectionChange={onSelectionChange}
            >
              <Tab key="/" title={<HomeIcon />} />
              <Tab key="/profile" title={<ProfileIcon />} />
            </Tabs>
          </NavbarContent>
        )}

        <NavbarContent className="hidden sm:flex" justify="center">
          <NavbarItem className="lg:flex">{searchInput}</NavbarItem>
        </NavbarContent>

        {globalState.auth ? (
          <NavbarContent justify="end">
            <Avatar
              isBordered
              showFallback
              size="md"
              src={String(globalState.user?.profileImage)}
            />
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem className="">
              <Button
                isIconOnly
                className="rounded-full"
                color="primary"
                href="#"
                variant="light"
                onPress={() => {}}
              >
                <SearchIcon
                  className="text-base text-default-400 pointer-events-none flex-shrink-0"
                  size={22}
                />
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                className="p-0"
                color="primary"
                radius="full"
                onPress={onSigninPress}
              >
                Sign In
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}
      </HeroUINavbar>

      <Divider />
    </div>
  );
};
