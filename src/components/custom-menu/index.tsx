import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GanttStatic } from "../dhtmlx/codebase/dhtmlxgantt";
import { useRef, useState } from "react";

const StyledButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 14,
  padding: "10px 12px",
  border: "1px solid #5C55E5",
  backgroundColor: "#F9F9FF",
  color: "#5C55E5",
  borderRadius: "13px",
});

declare var gantt: GanttStatic;

export default function CustomMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportToJson = () => {
    gantt.exportToJSON({ name: "task-management-export.json" });
    handleClose();
  };

  const handleImportJson = () => {
    if (!inputFile.current) return;
    handleClose();
    inputFile.current.click();
  };

  const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log({ file });
    if (file) {
      // Validate file type
      if (file.type !== "application/json") {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          console.log("reader >>", reader.result);
          const json = JSON.parse(reader.result as string);
          console.log({ json });
          gantt.parse(json);
        } catch (err) {
          console.log("json load error: ", err);
        }
      };
      reader.onerror = () => {
        console.log("reader error");
      };

      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={handleFilePick}
      />
      <StyledButton
        id="basic-button"
        variant="outlined"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        endIcon={<ExpandMoreIcon />}
        onClick={handleClick}
      >
        Import / Export
      </StyledButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            boxShadow: "none",
            border: "1px solid #5C55E552",
            borderRadius: "12px",
            marginTop: "10px",
          },
        }}
      >
        <MenuItem
          onClick={handleImportJson}
          sx={{ color: "#5C55E5", fontSize: "15px" }}
        >
          Import from JSON
        </MenuItem>
        <MenuItem
          onClick={handleExportToJson}
          sx={{ color: "#5C55E5", fontSize: "15px" }}
        >
          Export to JSON
        </MenuItem>
      </Menu>
    </div>
  );
}
