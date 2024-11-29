import AddIcon from "@mui/icons-material/Add";
import {
  Backdrop,
  Button,
  CircularProgress,
  styled,
  Typography,
} from "@mui/material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import CustomMenu from "../../components/custom-menu";
import CustomModal from "../../components/custom-modal";
import { INewTaskData } from "../../components/custom-modal/type";
import CustomSwitch from "../../components/custom-switch";
import { GanttStatic } from "../../components/dhtmlx/codebase/dhtmlxgantt";
import GanttChart from "../../components/dhtmlx/Gantt";
import Header from "../../components/header";
import { UserAuth } from "../../context/auth";
import { db } from "../../firebase";

export const MainContainer = styled("div")({
  padding: "0 20px",
});

const ButtonContainer = styled("div")({
  display: "flex",
  gap: "15px",
  alignItems: "center",
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
// let taskListData: ITaskDataList["data"] = [];
export default function Dashboard() {
  const [filteredTask, setFilteredTask] = useState<INewTaskData | null>(null);
  // const [taskListData, setTaskListData] = useState<ITaskDataList["data"]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const { user } = UserAuth();
  const userEmail = user?.email ?? "";

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFilteredTask(null);
  };

  const handleAutoScheduleChange = (value: boolean) => {
    gantt.config.auto_scheduling = value;
    gantt.render();
  };

  const addItemsToUserCollection = async (tasks: any, userEmail: string) => {
    try {
      const userDocRef = doc(db, "users", userEmail);
      await setDoc(userDocRef, {
        tasks: tasks,
      });
      console.log("Tasks assigned successfully!");
    } catch (error) {
      console.error("Error assigning tasks: ", error);
    }
  };

  const getUserTasks = async (userEmail: string) => {
    try {
      setLoading(true);
      const userDocRef = doc(db, "users", userEmail);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        const tasks = data.tasks || [];
        setLoading(false);
        // wait for state change
        console.log({ tasks });
        setTimeout(() => {
          gantt.parse(tasks);
        }, 100);
      } else {
        setLoading(false);
        // wait for state change
        setTimeout(() => {
          gantt.parse({ data: [] });
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching user tasks: ", error);
      setLoading(false);
      // wait for state change
      setTimeout(() => {
        gantt.parse({ data: [] });
      }, 100);
    }
  };

  useEffect(() => {
    if (!user) return;
    getUserTasks(userEmail);

    const onAfterTaskAdd = gantt.attachEvent("onAfterTaskAdd", async () => {
      const serializedJson = gantt.serialize("json");
      await addItemsToUserCollection(serializedJson, userEmail);
    });

    const onDbClickTask = gantt.attachEvent("onTaskDblClick", (id) => {
      const task = gantt.getTask(id);
      setFilteredTask({
        color: task.color ?? "",
        duration: task.duration ?? 0,
        end_date: task.end_date ?? new Date(),
        id: task.id ? task.id + "" : "",
        progress: task.progress ? task.progress : 0,
        start_date: task.start_date ?? new Date(),
        text: task.text ?? "",
      });
      handleOpen();
      return false;
    });

    const onGridClick = gantt.attachEvent("onGridHeaderClick", (name) => {
      if (name === "add") handleOpen();
      return false;
    });

    const onTaskClick = gantt.attachEvent("onTaskClick", (id, event) => {
      console.log("TASK WAS CLICKED", id);
      const isAddButtonClick = gantt.utils.dom.closest(
        // @ts-ignore
        event?.target,
        ".gantt_add"
      );

      console.log({ isAddButtonClick });

      if (!isAddButtonClick) return true;

      setFilteredTask({
        id: id + "",
        color: "",
        duration: 0,
        start_date: new Date(),
        end_date: new Date(),
        progress: 0,
        text: "",
        isParent: true,
      });
      handleOpen();
      return false;
    });

    const onTaskDelete = gantt.attachEvent("onAfterTaskDelete", async () => {
      const serializedJson = gantt.serialize("json");
      await addItemsToUserCollection(serializedJson, userEmail);
    });

    const onAfterTaskMove = gantt.attachEvent(
      "onAfterTaskMove",
      async (id, mode, event) => {
        console.log("TASK MOVE", id, mode, typeof mode);
        if (typeof mode !== "number") return;
        const serializedJson = gantt.serialize("json");
        await addItemsToUserCollection(serializedJson, userEmail);
      }
    );

    return () => {
      gantt.detachEvent(onAfterTaskAdd);
      gantt.detachEvent(onDbClickTask);
      gantt.detachEvent(onGridClick);
      gantt.detachEvent(onTaskClick);
      gantt.detachEvent(onTaskDelete);
    };
  }, [user]);

  return (
    <MainContainer>
      <Header />
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
          filteredTask={filteredTask}
        />
        <CustomMenu />
        <SwitchContainer>
          <Typography>Auto Schedule Adjustment</Typography>
          <CustomSwitch onChange={handleAutoScheduleChange} />
        </SwitchContainer>
      </ButtonContainer>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        onClick={handleClose}
      >
        <CircularProgress
          sx={{
            color: "#bcbcff",
          }}
        />
      </Backdrop>

      <GanttChart />
    </MainContainer>
  );
}
