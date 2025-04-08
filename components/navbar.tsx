import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import NextLink from "next/link";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import Image from "next/image";

import logo from "../public/assets/revit-logo.svg";

import { SearchIcon } from "@/components/icons";
import { useGlobalStore } from "@/store";

export const Navbar = () => {
  const { globalState } = useGlobalStore((state) => state);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm w-96",
      }}
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <div className="fixed w-[100vw] z-20 top-0">
      <HeroUINavbar maxWidth="xl" position="sticky">
        <NavbarContent justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink href="/">
              <Image alt="logo" height={40} src={logo} />
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="center">
          <NavbarItem className="lg:flex">{searchInput}</NavbarItem>
        </NavbarContent>

        {globalState.auth ? (
          <NavbarContent justify="end">
            <Link aria-label="Profile" href="/profile">
              <Avatar
                isBordered
                showFallback
                size="md"
                src={String(globalState.user?.profileImage)}
              />
            </Link>
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem>
              <Button as={Link} color="primary" href="/signin">
                Sign In
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}
      </HeroUINavbar>
      <Divider />
    </div>
  );
};
