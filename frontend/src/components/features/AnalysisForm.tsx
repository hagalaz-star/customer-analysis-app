import React from "react";
import { useState } from "react";
import { CustomerProfile } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { analyzeCustomer } from "@/lib/api";
import AnalysisResultDialog from "./AnalysisResultDialog";

function AnalysisForm() {
  const [analysisResult, setAnalysisResult] = useState<{
    name: string;
    description: string;
  } | null>(null);
  
  const [formData, setFormData] = useState<CustomerProfile>({
    Age: 0,
    "Purchase Amount (USD)": 0,
    "Subscription Status": false,
    "Frequency of Purchases": "Weekly",
  });

  const handleResultDialog = () => {
    setAnalysisResult(null);
  };

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
    console.log("API로 전송할 데이터:", formData);
    toast.info("FastAPI 서버에 분석을 요청했습니다...");

    try {
      const result = await analyzeCustomer(formData);
      console.log("백엔드로부터 실제 받은 result:", result);

      const analysisData = result;

      if (
        analysisData &&
        analysisData.cluster_name &&
        analysisData.cluster_description
      ) {
        toast.success(`분석완료 고객님은 ${analysisData.cluster_name}`);
        setAnalysisResult({
          name: analysisData.cluster_name,
          description: analysisData.cluster_description,
        });

        setFormData({
          Age: 0,
          "Purchase Amount (USD)": 0,
          "Subscription Status": false,
          "Frequency of Purchases": "Weekly",
        });
      } else {
        toast.error("분석 실패");
      }
    } catch (error) {
      console.log("API 요청 실패:", error);
      toast.error("서버와 통신중 에러가 발생하였습니다.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover: text-white font-bold text-2xl px-8 py-6 rounded-xl transition-colors">
          AI 고객 유형 분석하기
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            가상 쇼핑객 프로필 입력
          </DialogTitle>
          <p className="text-sm text-slate-400">
            새로운 고객의 쇼핑 성향을 입력하면, 어떤 그룹에 속하는지 실시간으로
            분석해 드립니다.
          </p>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between p-3">
            <Label htmlFor="age" className="text-right">
              나이
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="예: 35"
              className="bg-slate-800 border-slate-600 w-[143px] col-span-3 justify-self-end"
              value={formData.Age || ""}
              onChange={(e) => {
                let age = parseInt(e.target.value, 10) || 0;

                if (age > 150) {
                  age = 150;
                }

                if (age < 0) {
                  age = 0;
                }

                handleChange("Age", age);
              }}
            />
          </div>

          <div className="flex items-center justify-between p-3">
            <Label htmlFor="purshase" className="text-right">
              평균 구매액
            </Label>
            <div className="flex items-center gap-2 justify-self-end">
              <Input
                id="purshase"
                type="number"
                placeholder="예: 20$"
                className=" bg-slate-800 border-slate-600 w-[120px]"
                value={formData["Purchase Amount (USD)"] || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  let cost = parseInt(value, 10) || 0;

                  if (cost < 0) {
                    cost = 0;
                  }

                  handleChange("Purchase Amount (USD)", cost);
                }}
              />
              <span className="text-slate-400">$</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-md">
            <div>
              <Label htmlFor="subscription">정기 구독 여부</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="subscription"
                checked={formData["Subscription Status"]}
                onCheckedChange={(checked) =>
                  handleChange("Subscription Status", checked)
                }
              />
              <Label
                htmlFor="subscription"
                className={`font-semibold ${
                  formData["Subscription Status"]
                    ? "text-cyan-400"
                    : "text-gray-500"
                }`}
              >
                {formData["Subscription Status"] ? "구독중" : "미 구독"}
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 gap-4">
            <Label className="text-right" htmlFor="frequency">
              구매 빈도
            </Label>
            <Select
              value={formData["Frequency of Purchases"]}
              onValueChange={(e) => handleChange("Frequency of Purchases", e)}
            >
              <SelectTrigger
                className="col-span-2 bg-slate-800 border-slate-600"
                id="frequency"
              >
                <SelectValue placeholder="구매 주기를 선택하세요" />
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

        <DialogFooter>
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={handleSubmit}>
              분석하기
            </Button>
          </div>
        </DialogFooter>

        {analysisResult && (
          <AnalysisResultDialog
            result={analysisResult}
            isOpen={!!analysisResult}
            isClose={handleResultDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AnalysisForm;
