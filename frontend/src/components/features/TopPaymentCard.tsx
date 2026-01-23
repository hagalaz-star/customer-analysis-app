import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const iconMap: { [key: string]: string } = {
  "Credit Card": "/icons/creditCard.svg",
  PayPal: "/icons/paypal.svg",
  Cash: "/icons/coinsMoney.svg",
  "Debit Card": "/icons/debitCard.svg",
  Venmo: "/icons/venmo.svg",
  "Bank Transfer": "/icons/bankTransfer.svg",
};

interface PaymentProps {
  title: string;
  count: number;
  percentage: number;
}

function TopPaymentCard({ title, percentage }: PaymentProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-col items-center space-y-3">
        <div className="rounded-2xl bg-slate-100 p-3">
          <Image src={iconMap[title]} alt="지불방법" width={64} height={64} />
        </div>
        <CardTitle className="text-center text-base font-semibold text-slate-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center text-sm text-slate-500">
        <span className="block text-2xl font-semibold text-slate-900">
          {percentage}%
        </span>
        지불 점유율
      </CardContent>
    </Card>
  );
}

export default TopPaymentCard;
