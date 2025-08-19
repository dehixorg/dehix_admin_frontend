import React, { useEffect, useState } from "react";
import { UserIcon, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/lib/store";
import { handleLogout } from "@/lib/utils";

export default function DropdownProfile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [userType, setUserType] = useState<string | null>(null); // Added userType state

  useEffect(() => {
    // Check if user type is available in Redux store
    if (user?.type) {
      setUserType(user.type);
    } else {
      // If not, get it from cookies
      const storedUserType = Cookies.get("userType");
      setUserType(storedUserType || null);
    }
  }, [user]);

  const onLogoutClick = async () => {
    try {
      await handleLogout(dispatch, router); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/user.png" alt="@shadcn" />
            <AvatarFallback>
              <UserIcon size={16} />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div>
          {userType === "freelancer" ? (
            <Link href="/freelancer/settings/personal-info">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
          ) : userType === "business" ? (
            <Link href="/business/settings/business-info">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
          ) : (
            <p></p>
          )}
        </div>
        {/* <Link href="/settings/support">
          <DropdownMenuItem>Support</DropdownMenuItem>
        </Link> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogoutClick}>
          <LogOut size={18} className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
