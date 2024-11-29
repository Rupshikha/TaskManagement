import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GanttStatic } from "../dhtmlx/codebase/dhtmlxgantt";
import { useRef, useState } from "react";
import { INewTaskData } from "../custom-modal/type";

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

  // const handleImportJson = () => {
  //   if (!inputFile.current) return;
  //   inputFile.current.click();
  //   handleClose();
  // };

  const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/json") {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);

          let toParseData = (json.data.data as INewTaskData[]).map((task) => {
            return {
              color: task.color ?? "",
              duration: task.duration ?? 0,
              end_date: task.end_date ?? new Date(),
              id: task.id ? task.id + "" : "",
              progress: task.progress ? task.progress : 0,
              start_date: task.start_date ?? new Date(),
              text: task.text ?? "",
            };
          });

          toParseData = toParseData.map((task) => {
            return {
              color: task.color ?? "",
              duration: task.duration ?? 0,
              end_date: task.end_date ?? new Date(),
              id: task.id ? task.id + "" : "",
              progress: task.progress ? task.progress : 0,
              start_date: task.start_date ?? new Date(),
              text: task.text ?? "",
            };
          });

          gantt.parse({
            data: toParseData,
          });
          gantt.render();
          console.log({ toParseData });
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
          onClick={handleClose}
          sx={{ color: "#5C55E5", fontSize: "15px" }}
        >
          Import from Csv
        </MenuItem>
        <MenuItem
          onClick={handleExportToJson}
          sx={{ color: "#5C55E5", fontSize: "15px" }}
        >
          Export to Csv
        </MenuItem>
      </Menu>
    </div>
  );
}
