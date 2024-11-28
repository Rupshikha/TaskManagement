import React from "react";
import { Avatar, styled, Typography, Box } from "@mui/material";
import { UserAuth } from "../../context/auth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router";

const Container = styled("div")({
  display: "flex",
  justifyContent: "space-between",
});

const ProfileContainer = styled("div")({
  display: "flex",
});

export default function Header() {
  const { user, logOut } = UserAuth();
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickLogOutIcon = async () => {
    await logOut();
    handleClose();
    navigate("/");
  };

  return (
    <Container>
      <Typography>
        project/{" "}
        <span style={{ color: "#000000", fontWeight: "600", fontSize: "20px" }}>
          Design
        </span>
      </Typography>
      <ProfileContainer>
        <Avatar
          alt={user?.displayName ?? "user"}
          src="https://lh3.googleusercontent.com/a/ACg8ocLPxpL-J5xmlZ3s1Eiyg5gG5Z00v7E9i30WHlhlHfrO6KQ99A=s96-c"
          sx={{ marginRight: "10px" }}
        />
        <Box>
          <Typography
            sx={{ color: "#000000", fontWeight: "600", fontSize: "16px" }}
          >
            {user?.displayName}
          </Typography>
          <Typography
            sx={{
              color: "rgb(0,0,0,0.5)",
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            Designer
          </Typography>
        </Box>
        <Box onClick={handleClick}>
          <ExpandMoreIcon />
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={onClickLogOutIcon}>Log out</MenuItem>
        </Menu>
      </ProfileContainer>
    </Container>
  );
}
