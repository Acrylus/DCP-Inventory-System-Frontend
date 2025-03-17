import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./app/auth/Login";
import LandingPage from "./app/LandingPage";
import LandingLayout from "./components/layout/LandingLayout";
import DivisionDashboard from "./app/division/Dashboard";
import NavbarLayout from "./components/layout/NavbarLayout";
import UploadSchool from "./app/UploadSchool";
import DCPBatchSearch from "./app/division/DCPBatchSearch";
import DCPPackage from "./app/division/DCPPackage";
import Reports from "./app/division/Reports";
import SchoolDCP from "./app/division/SchoolDCP";
import SchoolProfile from "./app/division/SchoolProfile";
import Search from "./app/division/Search";
import Settings from "./app/division/Settings";
import SchoolDashboard from "./app/school/Dashboard";
//import "./App.css";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LandingLayout />}>
                    <Route index element={<LandingPage />} />
                </Route>
                <Route element={<NavbarLayout />}>
                    <Route
                        path="/division-dashboard"
                        element={<DivisionDashboard />}
                    />
                    <Route
                        path="/school-dashboard"
                        element={<SchoolDashboard />}
                    />
                    <Route path="/upload" element={<UploadSchool />} />
                    <Route
                        path="/dcp-batch-search"
                        element={<DCPBatchSearch />}
                    />
                    <Route path="/dcp-package" element={<DCPPackage />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/school-dcp" element={<SchoolDCP />} />
                    <Route path="/school-profile" element={<SchoolProfile />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
