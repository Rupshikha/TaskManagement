import { styled } from "@mui/material";
import Header from "../../components/header";
import GanttChart from "../../components/dhtmlx/Gantt";

export const MainContainer = styled("div")({
  margin: "0 30px",
});

export default function Dashboard() {
  return (
    <MainContainer>
      <Header />
      <GanttChart />
    </MainContainer>
  );
}
