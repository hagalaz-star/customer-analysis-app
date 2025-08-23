import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { BadgeCheckIcon } from "lucide-react";
import Backbutton from "@/components/features/Backbutton";
import { Input } from "@/components/ui/input";

// import UpdatePasswordPage from "../auth/update-password/page";

export default async function account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  return (
    <div className="flex justify-center items-center  min-h-screen p-4">
      <Card className="w-full max-w-3xl ">
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border">
              <AvatarImage
                src="https://www.lego.com/cdn/cs/set/assets/blt9daed402e8b1f001/CP_IronMan_Sidekick-Tallb388732cc325ae4da0f803782153ff238247b7123287b15319250fb5bf6502bf.jpg?fit=crop&format=jpg&quality=80&width=800&height=600&dpr=1"
                alt="@shadcn"
              />
              <AvatarFallback>CT</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {user?.user_metadata.full_name || "사용자"}
              </h2>
              <p className="text-sm text-muted-foreground">
                계정 정보를 관리하세요.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-full font-semibold sm:w-28 sm:text-right">
                이메일
              </span>
              <div className="flex w-full items-center gap-2">
                <Input
                  type="email"
                  readOnly
                  value={user.email}
                  className="flex-1"
                />

                <Badge
                  variant="secondary"
                  className="ml-6 bg-blue-500 text-white dark:bg-blue-600"
                >
                  <BadgeCheckIcon />
                  Verified
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-full font-semibold sm:w-28 sm:text-right">
                가입일
              </span>
              <div className="flex w-full items-center gap-2">
                <Input
                  type="text"
                  readOnly
                  value={new Date(user.created_at).toLocaleDateString("ko-KR")}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Backbutton />
          <Button asChild className="px-4 py-7">
            <Link href="/auth/update-password">비밀번호변경</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
