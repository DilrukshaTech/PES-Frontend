import { Button } from "@mui/material";
import { PlusIcon } from "lucide-react";

interface PrimaryBtnProps {
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
  styles?: React.CSSProperties;
  title: string;
  startIcon?: React.ReactNode;
}
const SecondaryBtn: React.FC<PrimaryBtnProps> = ({
  variant,
  color,
  size,
  disabled,
  onClick,
  loading,
  styles,
  title,
  startIcon,
}) => {
  return (
    <div>
      <Button
        variant={variant}
        startIcon={startIcon || <PlusIcon />}
        color={color}
        size={size}
        disabled={disabled}
        onClick={onClick}
        loading={loading}
        style={styles}
        title={title}
         disableElevation={true} 
      >
        {loading ? "Loading..." : title}
      </Button>
    </div>
  );
};
export default SecondaryBtn;
