"use client"
import { auth, signOut } from '@/auth';
import { useCurrentUser } from '@/hooks/user';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react';
import { SquarePlus } from 'lucide-react';
import { useSession } from 'next-auth/react';



export default function Home() {
  const session = useSession()
  const user = useCurrentUser()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <main>
 
    </main>
  );
}
