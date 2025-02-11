"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
//import { Button } from "@heroui/button"
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Image } from "@heroui/image";
import { useCurrentUser } from "@/hooks/user";
import { Button } from "@heroui/button";
import { signOut } from "next-auth/react";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const user = useCurrentUser()
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
            alt="Akademia Wilka"
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
        <NavbarItem>
          {user ?
            <Dropdown 
              placement="bottom-end"
              className="rounded-none"
            >
              <DropdownTrigger>
                <Avatar
                  showFallback
                  src={user.image!}
                />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem 
                  key="logout"
                  color="danger"
                  variant="light"
                  startContent={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                  onPress={()=>{signOut()}}
                  className="rounded-none"
                >
                  Wyloguj
                </DropdownItem>
              </DropdownMenu>
            </Dropdown> 
            //<Button
            //  onPress={()=>{signOut()}}
            //>
            //  Wyloguj
            //</Button>
            : 
            <Button
              as={Link}
              href="/auth/start"
              size="sm"
              variant="bordered"
            >
              Start
            </Button>
          }
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
