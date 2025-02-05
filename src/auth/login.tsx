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
import DepedImage from "../assets/images/Deped.png"; // ✅ Fix: Use /public folder OR `new URL()` if using /src/assets/

export function Login() {
    const navigate = useNavigate();
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!idNumber || !password) {
            setError("Please enter both ID number and password.");
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
            setError((err as Error).message);
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
                        <Typography
                            variant="h2"
                            className="font-bold mb-4"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                            >
                            Log in
                        </Typography>

                        <Typography
                            variant="paragraph"
                            color="blue-gray"
                            className="text-lg font-normal"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            Enter your ID number and password
                        </Typography>
                    </div>
                    <form
                        className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
                        onSubmit={handleSubmit}
                    >
                        {error && (
                            <Alert color="red" className="mb-4">
                                {error}
                            </Alert>
                        )}

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
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                crossOrigin={undefined} // ✅ Fix TS error
                                error={false} // ✅ Fix TS error (if applicable)
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
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                crossOrigin={undefined} // ✅ Fix TS error
                                error={false} // ✅ Fix TS error (if applicable)
                            />
                        </div>

                        <Checkbox
                            label={
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="flex items-center font-medium"
                                    placeholder={undefined} // ✅ Fix TS error
                                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
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
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                            crossOrigin={undefined} // ✅ Fix TS error
                            iconProps={undefined} // ✅ Fix TS error
                        />

                        <Button
                            type="submit"
                            className="mt-6 bg-[#F97108] text-white hover:bg-orange-700"
                            fullWidth
                            disabled={loading}
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            {loading ? <Spinner
                                className="h-5 w-5"
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                />
                                : "Log in"
                            }
                        </Button>

                        <Typography
                            variant="paragraph"
                            className="text-center text-black font-medium mt-4"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            Not registered?
                        </Typography>

                        <Link to="/signup">
                            <Button
                                className="mt-6 bg-[#F97108] text-white hover:bg-orange-700"
                                fullWidth
                                placeholder={undefined} // ✅ Fix TS error
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                            >
                                Register Now
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between gap-2 mt-6">
                            <Typography
                                variant="small"
                                className="font-medium text-gray-900"
                                placeholder={undefined} // ✅ Fix TS error
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
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
                        alt="DepEd"
                    />
                </div>
            </section>

            {/* Terms and Conditions Dialog */}
            <Dialog open={open} handler={handleOpen}
                placeholder={undefined} // ✅ Fix TS error
                onPointerEnterCapture={undefined} // ✅ Fix TS error
                onPointerLeaveCapture={undefined} // ✅ Fix TS error
            > {/* ✅ Fix: Use onClose instead of handler */}
                <DialogHeader
                    placeholder={undefined} // ✅ Fix TS error
                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                >Terms and Conditions</DialogHeader>
                <DialogBody 
                    placeholder={undefined} // ✅ Fix TS error
                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                divider>
                    <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="text-lg font-normal"
                        placeholder={undefined} // ✅ Fix TS error
                        onPointerEnterCapture={undefined} // ✅ Fix TS error
                        onPointerLeaveCapture={undefined} // ✅ Fix TS error
                    >
                        {/* Add your terms and conditions text here */}
                        Terms and conditions content goes here.
                    </Typography>
                </DialogBody>
                <DialogFooter
                    placeholder={undefined} // ✅ Fix TS error
                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                >
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                        placeholder={undefined} // ✅ Fix TS error
                        onPointerEnterCapture={undefined} // ✅ Fix TS error
                        onPointerLeaveCapture={undefined} // ✅ Fix TS error
                    >
                        <span>Close</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default Login;
