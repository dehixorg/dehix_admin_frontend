import { Info } from "lucide-react"; // Importing an "Info" icon from Lucide
import { Button, ButtonProps } from "@/components/ui/button";

export function InfoButton({
  onClick,
  variant = "ghost",
  ...props
}: ButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      className="h-4 py-3"
      onClick={onClick}
      {...props}
    >
      <Info className="w-6 h-6" /> {/* Info icon */}
    </Button>
  );
}
