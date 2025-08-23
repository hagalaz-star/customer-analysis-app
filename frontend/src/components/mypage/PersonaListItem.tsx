"use client";

import { deletePersona } from "@/app/login/actions";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import Image from "next/image";
import FormattedDescription from "./FormattedDescription";

type Persona = {
  title: string;
  id: string;
  cluster_name: string;
  created_at: number;
  image_url: string;
  description: string;
};

export default function PersonaListItem({ aiPersona }: { aiPersona: Persona }) {
  const handleDelete = async () => {
    if (confirm(`이 저장된 ai 페르소나를 삭제하시겠습니까?`)) {
      const result = await deletePersona(aiPersona.id);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  const fomattedDate = new Date(aiPersona.created_at).toLocaleDateString(
    "ko-KR"
  );
  return (
    <div className="flex justify-between items-center hover:bg-gray-100">
      <div>
        <h3 className="text-lg font-semibold">{aiPersona.title}</h3>
        <p className="text-sm text-gray-500">
          {aiPersona.cluster_name} | 저장일: {fomattedDate}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">다시보기</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{aiPersona.title}</DialogTitle>
            </DialogHeader>

            <Image
              src={aiPersona.image_url}
              alt={`AI가 생성한 ${aiPersona.title}의 이미지`}
              width={500}
              height={400}
            />
            <FormattedDescription text={aiPersona.description} />

            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="destructive" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </div>
  );
}
