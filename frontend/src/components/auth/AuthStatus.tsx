import { createClient } from "@/utils/supabase/server";
import UserMenu from "@/components/auth/UserMenu";

export default async function AuthStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <UserMenu user={user} />
    </div>
  );
}
