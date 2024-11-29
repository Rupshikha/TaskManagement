import { useEffect, useRef, useState } from "react";
import "./codebase/dhtmlxgantt";
import "./codebase/dhtmlxgantt.css";
import { GanttStatic } from "./codebase/dhtmlxgantt";
import { styled, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomMenu from "../custom-menu";
import CustomSwitch from "../custom-switch";
import "./style.css";
import CustomModal from "../custom-modal";
import { INewTaskData } from "../custom-modal/type";

const TaskDataList = {
  data: [],
};

export interface ITaskDataList {
  data: {
    id: string;
    text: string;
    start_date: string;
    end_date: string;
    duration: number;
    progress: number;
    color: string;
  }[];
}

const ButtonContainer = styled("div")({
  display: "flex",
  gap: "15px",
  alignItems: "center",
  marginBottom: "20px",
});

const SwitchContainer = styled("div")({
  display: "flex",
  border: "1px solid rgba(0, 0, 0, 0.30)",
  padding: "10px",
  gap: "30px",
  alignItems: "center",
  borderRadius: "12px",
});

declare var gantt: GanttStatic;

const GanttChart = () => {
  const gantContainerRef = useRef<HTMLDivElement>(null);
  const [taskDataList, setTaskDataList] = useState<ITaskDataList>(TaskDataList);
  const [filteredTask, setFilteredTask] = useState<INewTaskData | null>(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterEditedTask = (id: string | number) => {
    console.log("taskDataList", taskDataList, id);
    const filteredTaskItems = gantt.getTaskBy("id", id);
    const toSetTask = filteredTaskItems[0] as any as INewTaskData;

    setFilteredTask({
      ...toSetTask,
      start_date: new Date(toSetTask.start_date),
      end_date: new Date(toSetTask.end_date),
    });
  };

  const updateTaskHandler = (id: string, task: any) => {
    gantt.updateTask(id, task);
    setFilteredTask(null);
    handleClose();
  };

  useEffect(() => {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";

    gantt.config.server_utc = true;
    gantt.config.drag_resize = true;
    gantt.config.order_branch = true;
    gantt.config.columns = [
      { name: "text", tree: true, width: "*", min_width: 80, resize: true },
      { name: "start_date", width: 120, align: "center", resize: true },
      { name: "duration", align: "center", width: 80, resize: true },
      { name: "add", width: 60, resize: true },
    ];

    gantt.config.scales = [
      {
        unit: "week",
        step: 1,
        format: (date) => {
          const weekStart = gantt.date.week_start(date);
          const weekEnd = gantt.date.add(weekStart, 6, "day");
          const formatDate = gantt.date.date_to_str("%j %M");
          return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
        },
      },
      {
        unit: "day",
        step: 1,
        format: "%j",
      },
    ];

    gantt.config.keep_grid_width = false;
    gantt.config.grid_resize = true;
    gantt.config.min_column_width = 50;
    gantt.config.scale_height = 60;

    gantt.config.start_date = new Date(new Date().getFullYear(), 1, 1);
    gantt.config.end_date = gantt.date.add(gantt.config.start_date, 1, "year");
    gantt.attachEvent("onTaskDblClick", function (id, e) {
      //any custom logic here
      filterEditedTask(id);

      handleOpen();
      return false;
    });

    gantt.attachEvent("onGridHeaderClick", function () {
      //any custom logic here

      handleOpen();
      return false;
    });

    if (gantContainerRef.current) {
      gantt.init(gantContainerRef.current);
    }
  }, []);

  useEffect(() => {
    gantt.parse({
      data: taskDataList?.data,
    });
    gantt.render();
  });

  return (
    <>
      <ButtonContainer>
        <Button
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#5C55E5",
            color: "#FFFFFF",
            fontWeight: "500",
            fontSize: "15px",
            borderRadius: "13px",
            padding: "10px 15px",
          }}
          onClick={handleOpen}
        >
          New Task
        </Button>
        <CustomModal
          open={open}
          handleClose={handleClose}
          setTaskDataList={setTaskDataList}
          filteredTask={filteredTask}
          updateTask={updateTaskHandler}
        />
        <CustomMenu />
        <SwitchContainer>
          <Typography>Auto Schedule Adjustment</Typography>
          <CustomSwitch />
        </SwitchContainer>
      </ButtonContainer>

      <div
        id="root_contaier"
        style={{
          width: "100%",
          height: "calc(100% - 102px)",
          position: "absolute",
        }}
      >
        <div id="gantt" ref={gantContainerRef} />
      </div>
    </>
  );
};

export default GanttChart;
