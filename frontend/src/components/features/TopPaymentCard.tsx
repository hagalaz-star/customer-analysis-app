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
    <Card>
      <CardHeader className="flex flex-col items-center  space-y-2">
        <CardTitle className="text-center">{title}</CardTitle>
        <Image src={iconMap[title]} alt="지불방법" width={100} height={200} />
      </CardHeader>
      <CardContent>{`지불 점유율 ${percentage} %`}</CardContent>
    </Card>
  );
}

export default TopPaymentCard;
