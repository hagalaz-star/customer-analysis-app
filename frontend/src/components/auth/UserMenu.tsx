"use client";

import { logout } from "@/app/login/actions";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function UserMenu({ user }: { user: User | null }) {
  const displayName = user?.user_metadata.nick_name || user?.email;

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline">로그인</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="w-full justify-start">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold truncate">
              반갑습니다 !! {displayName}님
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <Link href="/account">내 계정</Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/my-app">마이페이지</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => logout()}>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
