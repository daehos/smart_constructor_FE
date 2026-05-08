import { ClockWidget } from "./components/ClockWidget";
import WeekSummaryWidget from "./components/WeekSummaryWidget";

const HomePage = () => {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-6 p-4">
      <ClockWidget />
      <WeekSummaryWidget />
    </div>
  );
};

export default HomePage;
