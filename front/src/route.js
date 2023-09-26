import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Answer from "./pages/Answer";
import Enter from "./pages/Enter";
import List from "./pages/List";
import Theme from "./pages/Theme";
import { url, urlList } from "./lien";
export const AppRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<Enter />} />
      <Route path={url} element={<Game />} />
      <Route path="/answer" element={<Answer />} />
      <Route path={urlList} element={<List />} />
      <Route path="/themes" element={<Theme />} />
    </Routes>
  );
};
