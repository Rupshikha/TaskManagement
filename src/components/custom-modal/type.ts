export interface ICustomModal {
  open: boolean;
  handleClose: () => void;
  filteredTask: INewTaskData | null;
}

export interface INewTaskData {
  id: string;
  text: string;
  start_date: Date;
  end_date: Date;
  duration: number;
  progress: number;
  color: string;
  isParent?: boolean;
}
