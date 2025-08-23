// import { createClient } from "@/utils/supabase/server";
import PersonaListItem from "@/components/mypage/PersonaListItem";
import { createClient } from "@/utils/supabase/server";

export default async function MyPage() {
  // const supabase = await createClient();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 현재 로그인한 사용자의 데이터를 가져옵니다.
  const { data: personas, error } = await supabase
    .from("personas")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("데이터 로딩 에러:", error);
    return <p>데이터를 불러오는 데 실패했습니다.:{error.message}</p>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        저장된 페르소나 목록
      </h1>
      {personas && personas.length > 0 ? (
        <div className="grid grid-col-1 sm:grid-col-2 lg:grid-col-3 gap-8">
          {personas.map((persona) => (
            <PersonaListItem key={persona.id} aiPersona={persona} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          저장된 페르소나가 없습니다
        </div>
      )}
    </div>
  );
}
