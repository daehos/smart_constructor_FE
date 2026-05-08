import "./index.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-svh w-full">
      <Outlet />
    </div>
  );
}

export default App;
