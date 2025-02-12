import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./app/auth/Login";
import LandingPage from "./app/LandingPage";
import LandingLayout from "./components/layout/LandingLayout";
import Dashboard from "./app/admin/Dashboard";
import NavbarLayout from "./components/layout/NavbarLayout";
import UploadSchool from "./app/UploadSchool";
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
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
