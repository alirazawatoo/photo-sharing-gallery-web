import { Route, Routes } from "react-router";

import ArchitectureScreen from "../screens/ArchitectureScreen";
import FashionScreen from "../screens/FashionScreen";
import NatureScreen from "../screens/NatureScreen";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<NatureScreen />} />
      <Route path="/architecture" element={<ArchitectureScreen />} />
      <Route path="/fashion" element={<FashionScreen />} />
    </Routes>
  );
};

export default AppRouter;
