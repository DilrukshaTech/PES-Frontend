import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import Loading from "./components/loading/Loading";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./screens/Dashbord";
import { Sessions } from "./screens/sessions/Sessions";
import { Judges } from "./screens/judges/Judges";
import { Members } from "./screens/members/Members";
import { Presenters } from "./screens/presenters/Presenters";
import { Event } from "./screens/event/Event";
import "./index.css";
import { AsignNewJudge } from "./screens/judges/AsignNewJudge";
import { AssignIndividual } from "./screens/presenters/AssignIndividual";
import { AssignGroups } from "./screens/presenters/AssignGroups";
import { Criteria } from "./screens/criteria/Criteria";
import FeedbackAlert from "./components/alart/Alart";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Event />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="judges/add" element={<Judges />} />
              <Route path="judges/assign" element={<AsignNewJudge />} />
              <Route path="members" element={<Members />} />
              <Route path="presenters" element={<Presenters />} />
              <Route
                path="presenters/individual"
                element={<AssignIndividual />}
              />
              <Route path="presenters/groups" element={<AssignGroups />} />
              <Route path="criteria" element={<Criteria />} />
            </Route>
          </Routes>
         <FeedbackAlert/>
        </Suspense>
      </ThemeProvider>
    </>
  );
}

export default App;
