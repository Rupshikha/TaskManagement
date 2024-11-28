import { styled } from "@mui/material";
import Header from "../../components/header";
import GanttChart from "../../components/dhtmlx/Gantt";

export const MainContainer = styled("div")({
  padding: "0 20px",
});

export default function Dashboard() {
  return (
    <MainContainer>
      <Header />
      <GanttChart />
    </MainContainer>
  );
}
