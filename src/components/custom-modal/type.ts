import { ITaskDataList } from "../dhtmlx/Gantt";

export interface ICustomModal {
  open: boolean;
  handleClose: () => void;
  setTaskDataList: React.Dispatch<React.SetStateAction<ITaskDataList>>;
  filteredTask: INewTaskData | null;
  updateTask: (id: string, task: any) => void;
}

export interface INewTaskData {
  id: string;
  text: string;
  start_date: Date;
  end_date: Date;
  duration: number;
  progress: number;
  color: string;
}
