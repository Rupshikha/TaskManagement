import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

export default function CustomMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledButton
        id="basic-button"
        variant="outlined"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        endIcon={<ExpandMoreIcon />}
        onClick={handleClick}
      >
        Import/ Export
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
          onClick={handleClose}
          sx={{ color: "#5C55E5", fontSize: "15px" }}
        >
          Export to Csv
        </MenuItem>
      </Menu>
    </div>
  );
}
