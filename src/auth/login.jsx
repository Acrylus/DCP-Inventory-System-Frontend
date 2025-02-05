import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Input,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DepedImage from "/src/assets/images/Deped.png";

export function Login() {
    const navigate = useNavigate();
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!idNumber || !password) {
            alert("Please enter both ID number and password.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("YOUR_BACKEND_URL/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idNumber, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Login failed");
            }

            const data = await response.json();
            console.log("Login successful", data);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => setOpen(!open);

    return (
        <div>
            <section className="m-8 flex gap-4">
                {/* Login Form Section */}
                <div className="w-full lg:w-3/5 mt-24">
                    <div className="text-center">
                        <Typography variant="h2" className="font-bold mb-4">
                            Log in
                        </Typography>
                        <Typography
                            variant="paragraph"
                            color="blue-gray"
                            className="text-lg font-normal"
                        >
                            Enter your ID number and password
                        </Typography>
                    </div>
                    <form
                        className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
                        onSubmit={handleSubmit}
                    >
                        <div className="mb-4">
                            <label
                                htmlFor="idNumber"
                                className="block text-sm font-medium text-gray-700"
                            >
                                ID Number
                            </label>
                            <Input
                                id="idNumber"
                                size="lg"
                                placeholder="Enter your ID number"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                className="border border-gray-300 rounded-md focus:border-gray-900 focus:ring-2 focus:ring-gray-400"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                size="lg"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded-md focus:border-gray-900 focus:ring-2 focus:ring-gray-400"
                            />
                        </div>

                        <Checkbox
                            label={
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="flex items-center font-medium"
                                >
                                    I agree to the&nbsp;
                                    <a
                                        href="#"
                                        className="font-normal text-[#F97108] transition-colors hover:text-gray-900 underline"
                                        onClick={handleOpen}
                                    >
                                        Terms and Conditions
                                    </a>
                                </Typography>
                            }
                            containerProps={{ className: "-ml-2.5" }}
                        />

                        <Button
                            type="submit"
                            className="mt-6 bg-[#F97108] text-white hover:bg-orange-700"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" /> : "Log in"}
                        </Button>

                        <Typography
                            variant="paragraph"
                            className="text-center text-black font-medium mt-4"
                        >
                            Not registered?
                        </Typography>

                        <Link to="/signup">
                            <Button
                                className="mt-6 bg-[#F97108] text-white hover:bg-orange-700"
                                fullWidth
                            >
                                Register Now
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between gap-2 mt-6">
                            <Typography
                                variant="small"
                                className="font-medium text-gray-900"
                            >
                                <a href="#">Forgot Password?</a>
                            </Typography>
                        </div>
                    </form>
                </div>

                {/* Image Section */}
                <div className="w-2/5 h-full hidden lg:block">
                    <img
                        src={DepedImage}
                        className="h-full w-full object-cover rounded-3xl"
                        alt="Deped"
                    />
                </div>
            </section>

            {/* Terms and Conditions Dialog */}
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Terms and Conditions</DialogHeader>
                <DialogBody divider>
                    <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="text-lg font-normal"
                    >
                        {/* Add your terms and conditions text here */}
                        Terms and conditions content goes here.
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Close</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default Login;
