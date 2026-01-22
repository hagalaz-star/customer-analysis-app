"use client";

import { useState } from "react";
import axios from "axios";
import { CustomerProfile } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdviceResponse {
  advice: string;
}

const defaultProfile: CustomerProfile = {
  Age: 0,
  "Purchase Amount (USD)": 0,
  "Subscription Status": false,
  "Frequency of Purchases": "Weekly",
};

export default function AiAdviceDialog() {
  const [formData, setFormData] = useState<CustomerProfile>(defaultProfile);
  const [question, setQuestion] = useState<string>("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    name: keyof CustomerProfile,
    value: CustomerProfile[keyof CustomerProfile]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const response = await axios.post<AdviceResponse>("/api/ai-advice", {
        profile: formData,
        question: question.trim() || undefined,
      });
      setAdvice(response.data.advice);
    } catch (err) {
      let errorMessage = "AI 조언을 가져오는 중 문제가 발생했습니다.";
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data &&
        typeof err.response.data.error === "string"
      ) {
        errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-2xl px-6 py-6 rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-700">
          AI 조언 받기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[820px] bg-slate-950 text-white border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            AI 맞춤형 쇼핑 조언
          </DialogTitle>
          <p className="text-sm text-slate-400">
            고객 정보를 입력하면, 구매 습관에 맞춘 조언을 생성합니다.
          </p>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-2">
          <div className="space-y-4 rounded-xl bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="advice-age">나이</Label>
              <Input
                id="advice-age"
                type="number"
                className="w-32 bg-slate-800 border-slate-700"
                placeholder="예: 35"
                value={formData.Age || ""}
                onChange={(e) => {
                  let age = parseInt(e.target.value, 10) || 0;
                  if (age > 120) age = 120;
                  if (age < 0) age = 0;
                  handleChange("Age", age);
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="advice-amount">평균 구매액</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="advice-amount"
                  type="number"
                  className="w-32 bg-slate-800 border-slate-700"
                  placeholder="예: 20"
                  value={formData["Purchase Amount (USD)"] || ""}
                  onChange={(e) => {
                    let amount = parseFloat(e.target.value) || 0;
                    if (amount < 0) amount = 0;
                    handleChange("Purchase Amount (USD)", amount);
                  }}
                />
                <span className="text-slate-400">$</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-800/70 p-3">
              <Label htmlFor="advice-subscription">정기 구독 여부</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="advice-subscription"
                  checked={formData["Subscription Status"]}
                  onCheckedChange={(checked) =>
                    handleChange("Subscription Status", checked)
                  }
                />
                <span
                  className={`text-sm font-semibold ${
                    formData["Subscription Status"]
                      ? "text-cyan-300"
                      : "text-slate-400"
                  }`}
                >
                  {formData["Subscription Status"] ? "구독중" : "미 구독"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="advice-frequency">구매 빈도</Label>
              <Select
                value={formData["Frequency of Purchases"]}
                onValueChange={(value) =>
                  handleChange("Frequency of Purchases", value)
                }
              >
                <SelectTrigger
                  id="advice-frequency"
                  className="w-44 bg-slate-800 border-slate-700"
                >
                  <SelectValue placeholder="구매 주기 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly (매주)</SelectItem>
                  <SelectItem value="Fortnightly">
                    Fortnightly (2주마다)
                  </SelectItem>
                  <SelectItem value="Monthly">Monthly (매월)</SelectItem>
                  <SelectItem value="Bi-Weekly">Bi-Weekly (격주)</SelectItem>
                  <SelectItem value="Quarterly">Quarterly (분기별)</SelectItem>
                  <SelectItem value="Every 3 Months">
                    Every 3 Months (3개월마다)
                  </SelectItem>
                  <SelectItem value="Annually">Annually (매년)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="advice-question">조언 받고 싶은 내용</Label>
              <textarea
                id="advice-question"
                placeholder="예: 할인 혜택을 더 잘 쓰는 방법이 있을까요?"
                className="mt-2 min-h-[160px] w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">
                입력한 정보로 맞춤형 쇼핑 조언을 제공합니다. 결과는 아래에서
                확인할 수 있어요.
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4 text-cyan-100">
            AI가 조언을 생성하고 있습니다...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">
            오류: {error}
          </div>
        )}

        {advice && !isLoading && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-slate-100 whitespace-pre-wrap">
            {advice}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400"
          >
            {isLoading ? "생성 중..." : "AI 조언 생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
