import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface AnalysisResultDialogProps {
  result: {
    name: string;
    description: string;
  };
  isOpen: boolean;
  isClose: () => void;
}

const AnalysisResultDialog = ({
  result,
  isOpen,
  isClose,
}: AnalysisResultDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={isClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>분석결과:{result.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{result.description}</DialogDescription>
        <Button onClick={isClose}>확인</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisResultDialog;
