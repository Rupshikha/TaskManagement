import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useState } from "react";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 38,
  height: 20,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(18px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#D8D8FF",
        ...theme.applyStyles("dark", {
          backgroundColor: "#177ddc",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 15,
    height: 15,
    borderRadius: 10,
    color: "#5C55E5",
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16,
    opacity: 1,
    backgroundColor: "#D8D8FF",
    boxSizing: "border-box",
    ...theme.applyStyles("dark", {
      backgroundColor: "#D8D8FF",
    }),
  },
}));

interface ICustomSwitchProps {
  onChange?: (value: boolean) => void;
}

export default function CustomSwitch({ onChange }: ICustomSwitchProps) {
  const [value, setValue] = useState(false);
  return (
    <AntSwitch
      value={value}
      inputProps={{ "aria-label": "auto schedule toggle" }}
      onChange={() => {
        setValue((prev) => {
          onChange?.(!prev);
          return !prev;
        });
      }}
    />
  );
}
