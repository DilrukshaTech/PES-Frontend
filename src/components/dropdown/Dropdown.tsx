import { FormControl, InputAdornment, MenuItem, Select } from "@mui/material";
import "./dropdown.scss";

interface TextInputProps {
  value?: string | number;
 onChange?: (selectedValue: string) => void;
  onClick?: () => void;
  label?: string;
  touched?: boolean;
  error?: boolean | string;
  options?: Array<{ value: string; label: string }>;
  helperText?: string;
  placeholder?: string;
  startIcon?: React.ReactNode;
  name?: string;
  type?: string;
  styles?: React.CSSProperties;
}
export const Dropdown: React.FC<TextInputProps> = ({
  value,
  onChange,
  onClick,
  startIcon,
  label,
  placeholder,
  options = [],
  helperText,
  name,
  type,
  styles,
}) => {

   const handleSelect = (e: any) => {
    const selected = e.target.value;
    onChange?.(selected); 
  };


  return (
    <div id="dropdown">
      <FormControl>
        <Select
        id="fullWidth"
          sx={{
            "& .MuiInputBase-root": {
              border: "none",
              boxShadow: "none",
              backgroundColor: "transparent",
              borderRadius: "8px",
            },
            "& .MuiSelect-select": {
              padding: "0px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          style={styles}
          startIcon={startIcon}
          label={label}
          name={name}
          type={type}
          startAdornment={
            startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : null
          }
          helperText={helperText}
          value={value}
          onChange={handleSelect}
          onClick={onClick}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          disableElevation={true}
        >
          <MenuItem>
            <em>{placeholder}</em>
          </MenuItem>
          {Array.isArray(options) ? options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
      
              {option.label}
            </MenuItem>
          )): undefined}
        </Select>
      </FormControl>
    </div>
  );
};
