import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type {
  GridColDef,
  GridRowSelectionModel,
  GridEventListener,
} from "@mui/x-data-grid";

import "./table.scss";

interface TableProps {
  columns: GridColDef[];
  rows: object[];
  setSelectedID?: (ids: GridRowSelectionModel) => void;
  selectedID?: GridRowSelectionModel;
  isLoading?: boolean;
  columnVisibilityModel?: Record<string, boolean>;
  onRowClick?: (row: object) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  rows,
  setSelectedID,
  selectedID,
  isLoading = false,
  columnVisibilityModel,
  onRowClick,
}) => {
  const handleCellClick: GridEventListener<"cellClick"> = (params) => {
    onRowClick?.(params.row);
  };

  return (
    <div style={{ height: "60vh", width: "100%"}}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        columnHeaderHeight={49}
        rowHeight={57}
        rowSelectionModel={selectedID}
        onRowSelectionModelChange={(newSelection) => {
          setSelectedID?.(newSelection);
        }}
        onCellClick={handleCellClick}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
        }}
        pageSizeOptions={[ 50, 100]}
        columnVisibilityModel={columnVisibilityModel || {}}

    
      />
    </div>
  );
};

export default Table;
