import SecondaryBtn from "../buttons/SecondaryBtn";
import "./_.scss";

import { BsTrashFill } from "react-icons/bs";

type TopBarProps = {
  handleOpen: () => void;
    btnLable?: string;
};

export const TableTop = ({ handleOpen,btnLable }: TopBarProps) => {
  return (
    <div id="tabletop-container">
      
<div className="filters">

</div>
      
      <div className="rightbar">
       <SecondaryBtn
        color="primary"
        size="large"
        variant="contained"
        title={btnLable || "New Event"}
        onClick={handleOpen}
        styles={{
        
        
          textTransform: "none",
          textWrap: "nowrap",
          fontWeight: 500,
          fontSize: "15px",
          color: "#fff",
          padding: "9px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
            flexWrap: "nowrap",   
          borderRadius: "8px",
        }}
      />
       <div className="delete">
    <BsTrashFill className="delete-icon"/>
       </div>
  
      </div>
    </div>
  );
};
