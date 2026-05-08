import { Outlet } from "react-router-dom";
import TabNavigator from "./components/TabNavigator";
import background from "./assets/background.jpg";

const AuthShell = () => {
  return (
    <div className="min-h-svh w-full px-4 py-10 flex items-start justify-center">
      <div className="w-full  overflow-hidden">
        <div
          className="h-[350px] w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background})` }}
        />
        <TabNavigator />
        <div className="py-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
