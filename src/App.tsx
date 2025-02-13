import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./app/auth/Login";
import LandingPage from "./app/LandingPage";
import LandingLayout from "./components/layout/LandingLayout";
import Dashboard from "./app/admin/Dashboard";
import NavbarLayout from "./components/layout/NavbarLayout";
import UploadSchool from "./app/UploadSchool";
import DCPBatchSearch from "./app/admin/DCPBatchSearch";
import DCPPackage from "./app/admin/DCPPackage";
import Reports from "./app/admin/Reports";
import SchoolDCP from "./app/admin/SchoolDCP";
import SchoolProfile from "./app/admin/SchoolProfile";
import Search from "./app/admin/Search";
import Settings from "./app/admin/Settings";
//import "./App.css";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LandingLayout />}>
                    <Route index element={<LandingPage />} />
                </Route>
                <Route element={<NavbarLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
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
