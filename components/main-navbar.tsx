import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

import logo from "../public/assets/revit-logo-small.svg";

export const MainNavbar = () => {
  const router = useRouter();

  const onSigninPress = () => {
    router.push("/signin");
  };
  const onSignupPress = () => {
    router.push("/signup");
  };

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

        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              className="p-0"
              color="primary"
              variant="flat"
              onPress={onSigninPress}
            >
              Sign In
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button className="p-0" color="primary" onPress={onSignupPress}>
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      <Divider />
    </div>
  );
};
