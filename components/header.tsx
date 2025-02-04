"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
//import { Button } from "@heroui/button"
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Image } from "@heroui/image";

export default function Header() {
  return (
    <Navbar
      isBordered
      isBlurred
    >
      <NavbarBrand>
        <Link
          href={"/"}
        >
          <Image
            src="/akademia-wilka-logo-banner.svg"
            height={90}
          />
        </Link>
      </NavbarBrand>
      <NavbarContent>
        {/*
        <NavbarItem>
          <Link href="/about">O nas</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact">Kontakt</Link>
        </NavbarItem>
  */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher/>     
        </NavbarItem>
        {/*
        <NavbarItem>
          <Button
            size="sm"
            variant="bordered"
            as={Link} 
            href="/login" 
            color="primary"
          >
            Zaloguj się
          </Button>
        </NavbarItem>
*/}
      </NavbarContent>
    </Navbar>
  );
}
