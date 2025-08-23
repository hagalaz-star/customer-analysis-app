// 파일 위치: src/components/AuthProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  // useEffect가 두 번 실행되는 걸 막는 안전장치
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    // "혹시 주소창에 비밀 꼬리표(#...type=recovery)가 붙어있나?" 하고 직접 확인
    // 서버가 못 읽는 URL의 # 부분을 읽기 위해 썼다 window.location.hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery") && hash.includes("access_token")) {
      // 만약 있다면, 이벤트를 기다릴 필요 없이 즉시 비밀번호 변경 페이지로 보낸다.
      router.push("/auth/update-password");
      return; // 더 이상 다른 코드를 실행할 필요가 없으므로 여기서 종료.
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        router.push("/auth/update-password");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return <>{children}</>;
}
