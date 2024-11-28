import styled from "@emotion/styled";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";
import { ICustomModal, INewTaskData } from "./type";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

const NEW_TASK_DATA = {
  id: "",
  text: "",
  start_date: new Date(),
  end_date: new Date(),
  color: "",
  duration: 0,
  progress: 0,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  width: "696px",
  height: "600px",
};

const HeaderContainer = styled(Box)({
  backgroundColor: "#5C55E5",
  color: "#F9F9FF",
});

const BottonContainer = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  padding: "30px",
});

export default function CustomModal({
  open,
  handleClose,
  setTaskDataList,
  filteredTask,
  updateTask,
}: ICustomModal) {
  console.log("filteredtask", filteredTask);
  const textFieldRef = React.useRef<HTMLInputElement>(null);
  const [newTaskData, setNewTaskData] = React.useState<INewTaskData>(
    filteredTask ?? NEW_TASK_DATA
  );
  console.log("newTaskData", newTaskData);

  const handleTaskDataChange = (e: {
    target: { name: string; value: Date | string | null };
  }) => {
    setNewTaskData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTaskCreate = () => {
    setTaskDataList((prev) => ({
      data: [
        ...prev.data,
        {
          ...newTaskData,
          id: uuidv4(),
          start_date: format(newTaskData.start_date, "yyyy-MM-dd"),
          end_date: format(newTaskData.end_date, "yyyy-MM-dd"),
        },
      ],
    }));
    setNewTaskData(NEW_TASK_DATA);
    handleClose();
  };

  const handleUpdatedFn = () => {
    if (!filteredTask) return;
    updateTask(filteredTask?.id, {
      id: newTaskData?.id,
      text: newTaskData?.text,
      start_date: newTaskData.start_date,
      end_date: newTaskData.end_date,
      duration: newTaskData.duration,
      progress: newTaskData.progress,
      color: newTaskData.color,
    });

    
  };

  const onClickArrowIcon = () => {
    if (!textFieldRef?.current) return;
    textFieldRef?.current.click();
  };

  React.useEffect(() => {
    if (filteredTask) setNewTaskData(filteredTask);
  }, [filteredTask]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <HeaderContainer>
            <Typography
              variant="h4"
              sx={{ color: "#F9F9FF", weight: "700", padding: "30px" }}
            >
              New Task
            </Typography>
          </HeaderContainer>

          <Grid container spacing={2} sx={{ padding: "30px" }}>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>Task Name</Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter the Task Name"
                  name="text"
                  onChange={(e) => {
                    handleTaskDataChange(e);
                  }}
                  value={newTaskData.text}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>Start Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={newTaskData.start_date}
                    name="start_date"
                    onChange={(date) => {
                      handleTaskDataChange({
                        target: {
                          value: date,
                          name: "start_date",
                        },
                      });
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>End Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={newTaskData.end_date}
                    name="endDate"
                    onChange={(date) => {
                      handleTaskDataChange({
                        target: {
                          value: date,
                          name: "end_date",
                        },
                      });
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>Color</Typography>
                <Box
                  sx={{
                    border: "1px solid rgb(0,0,0,0.3)",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    padding: "14px 14px",
                    position: "relative",
                    marginTop: "1.5px",
                  }}
                >
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      marginRight: "5px",
                      backgroundColor: `${newTaskData?.color}`,
                    }}
                  ></Box>
                  <Typography sx={{ flexGrow: 1 }}>
                    {newTaskData?.color}
                  </Typography>
                  <KeyboardArrowDownIcon onClick={onClickArrowIcon} />
                  <input
                    id="outlined-basic"
                    value={newTaskData.color}
                    type="color"
                    onChange={(e) => handleTaskDataChange(e)}
                    name="color"
                    ref={textFieldRef}
                    style={{
                      visibility: "hidden",
                      width: 0,
                      position: "absolute",
                      top: "28px",
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>Duration</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  name="duration"
                  onChange={(e) => handleTaskDataChange(e)}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
                  value={newTaskData.duration}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>Progress</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  name="progress"
                  placeholder="0.00"
                  onChange={(e) => handleTaskDataChange(e)}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 0.1,
                    },
                  }}
                  value={newTaskData.progress}
                />
              </Box>
            </Grid>
          </Grid>
          <BottonContainer>
            <Button
              sx={{
                backgroundColor: "#5C55E5",
                color: "#F9F9FF",
                textTransform: "none",
                padding: "10px 50px",
              }}
              onClick={() =>
                filteredTask ? handleUpdatedFn() : handleTaskCreate()
              }
            >
              {filteredTask ? "Update" : "Create"}
            </Button>
            <Button
              sx={{
                backgroundColor: "#F9F9FF",
                color: "#000000",
                border: "1px solid rgb(0,0,0,0.3)",
                textTransform: "none",
                padding: "10px 50px",
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </BottonContainer>
        </Box>
      </Modal>
    </div>
  );
}
