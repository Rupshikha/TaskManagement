import { useEffect, useRef } from "react";
import "./codebase/dhtmlxgantt";
import { GanttStatic } from "./codebase/dhtmlxgantt";
import "./codebase/dhtmlxgantt.css";
import "./style.css";

declare var gantt: GanttStatic;

const GanttChart = () => {
  const gantContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.plugins({
      auto_scheduling: true,
      export_api: true,
    });
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

    if (gantContainerRef.current) {
      // gantt.setSkin("material");
      gantt.init(gantContainerRef.current);
    }
  }, []);

  useEffect(() => {
    gantt.render();
  }, []);

  return (
    <>
      <div
        id="root_contaier"
        style={{
          width: "calc(100% - 60px)",
          height: "calc(100% - 200px)",
          position: "absolute",
        }}
      >
        <div id="gantt" ref={gantContainerRef} />
      </div>
    </>
  );
};

export default GanttChart;
