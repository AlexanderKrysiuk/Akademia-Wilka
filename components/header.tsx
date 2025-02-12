"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";
//import { Button } from "@heroui/button"
import { ThemeSwitcher } from "./theme-switcher";
import { Image } from "@heroui/image";
import { useCurrentUser } from "@/hooks/user";
import { Button } from "@heroui/button";
import { signOut } from "next-auth/react";
import { Avatar, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Link } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faArrowRightToBracket, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { Role } from "@prisma/client";

export default function Header() {
  const user = useCurrentUser()
  return (
    <Navbar
      isBordered
      isBlurred
    >
      <NavbarContent>

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
      </NavbarContent>
      <NavbarContent
        className="hidden lg:block"
      >
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
        <NavbarItem
          className="hidden lg:block"
        >
          {user ?
            <Dropdown 
              placement="bottom-end"
              className="rounded-none"
            >
              <DropdownTrigger>
                <Avatar
                  showFallback
                  src={user.image!}
                  className="cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-300"
                />
              </DropdownTrigger>
              <DropdownMenu>
                {user.role === Role.Admin ? (
                  <DropdownSection 
                    title="Nauczyciel"
                    showDivider
                  >
                    <DropdownItem 
                      key="teacher-panel" 
                      href="/nauczyciel/moje-kursy"
                      variant="light"
                      color="primary"
                      startContent={<FontAwesomeIcon icon={faChalkboardTeacher}/>}
                    >
                      Moje kursy
                    </DropdownItem>
                  </DropdownSection>
                ) : null}
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
        <NavbarMenuToggle 
          className="lg:hidden"
        />
        
      </NavbarContent>
      <NavbarMenu>
        {user && (
          <NavbarMenuItem>
            <div className="flex justify-between items-center mb-1">
              Witaj {user.name}
              <Avatar
                size="sm"
                showFallback
                src={user.image!}
              />
            </div>
            <Divider/>
          </NavbarMenuItem>
        )}
        {user?.role === Role.Admin && 
          <div>
          <span
            className="text-sm text-foreground-500"
          >
            Nauczyciel
          </span>
          <NavbarMenuItem>
            <Link
              href="/nauczyciel/moje-kursy"
              color="foreground"
              >
              <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2"/> Moje kursy
            </Link>
            <Divider/>
          </NavbarMenuItem>
          </div>
        }  
        <NavbarMenuItem>
          {user ?
            <Link
              onPress={()=>{signOut()}}
              color="danger"
              className="cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2"/>Wyloguj
            </Link>
          :
            <Link
              href="/auth/start"
            >
              <FontAwesomeIcon icon={faArrowRightToBracket} className="mr-2"/>Start
            </Link>
          }
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
