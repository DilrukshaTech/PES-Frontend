import { Button } from "@mui/material";

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
  title?:string;
}
const PrimaryBtn: React.FC<PrimaryBtnProps> = ({
  variant,
  color,
  size,
  disabled,
  onClick,
  loading,
  title
}) => {
  return (
    <div>
      <Button
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        onClick={onClick}
        loading={loading}
        disableElevation={true} 

        sx={{
          backgroundColor:'#4880FF',
          color: '#fff',
          padding: '9px 20px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight:'400',
          textTransform:'capitalize'
        
        }}
      >
        {title || 'Send'}
      </Button>
    </div>
  );
};

export default PrimaryBtn;
