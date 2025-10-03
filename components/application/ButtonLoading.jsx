import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ButtonLoading = ({
  type,
  text,
  loading,
  onClick = null,
  className,
  ...props
}) => {
  return (
    <Button
      size="sm"
      disabled={loading}
      type={type}
      onClick={onClick}
      className={cn("", className)}
      {...props}
    >
      {loading && <Loader2Icon className="animate-spin" />}
      {text}
    </Button>
  );
};

export default ButtonLoading;
