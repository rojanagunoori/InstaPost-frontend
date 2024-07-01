
import React, { useState } from "react";
import { Card, CardHeader, CardBody, Button, Typography } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";

export default function AuthDashboard() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleUserAction = async () => {
        if (!email || !password || (!isLogin && !name)) {
            return toast.error("Fill all required fields");
        }
        try {
            if (isLogin) {
                // User login
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Login successful");
                navigate("/dashboard");
            } else {
                // User signup
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await updateProfile(user, { displayName: name });
                toast.success("User created successfully");
                navigate("/dashboard");
            }
            setEmail("");
            setPassword("");
            setName("");
        } catch (error) {
            const errorCode = error.code;
            let errorMessage = "Action failed";

            if (errorCode === 'auth/invalid-email') {
                errorMessage = "Invalid email address";
            } else if (errorCode === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters";
            } else if (errorCode === 'auth/email-already-in-use') {
                errorMessage = "Email already in use";
            } else if (errorCode === 'auth/wrong-password') {
                errorMessage = "Incorrect password";
            } else if (errorCode === 'auth/user-not-found') {
                errorMessage = "No user found with this email";
            }

            toast.error(errorMessage);
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-[24rem]" style={{ background: 'rgb(226, 232, 240)' }}>
                <CardHeader
                    color="blue"
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{ background: 'rgb(30, 41, 59)' }}
                >
                    <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-2 text-white">
                        <div className="flex justify-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/727/727399.png" className="h-20 w-20" alt="User Icon"/>
                        </div>
                    </div>
                    <Typography variant="h4" style={{ color: 'rgb(226, 232, 240)' }}>
                        {isLogin ? "Login" : "Signup"}
                    </Typography>
                </CardHeader>
                <CardBody>
                    <form className="flex flex-col gap-4">
                        {!isLogin && (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-medium" style={{ color: 'rgb(30, 41, 59)' }}>
                                    Name
                                </label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="p-2 border rounded"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium" style={{ color: 'rgb(30, 41, 59)' }}>
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="email"
                                id="email"
                                name="email"
                                className="p-2 border rounded"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-medium" style={{ color: 'rgb(30, 41, 59)' }}>
                                Password
                            </label>
                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                name="password"
                                className="p-2 border rounded"
                            />
                        </div>
                        <Button onClick={handleUserAction} style={{ background: 'rgb(30, 41, 59)', color: 'rgb(226, 232, 240)' }}>
                            {isLogin ? "Login" : "Signup"}
                        </Button>
                        <Button onClick={() => setIsLogin(!isLogin)} className="mt-4" style={{ background: 'rgb(226, 232, 240)', color: 'rgb(30, 41, 59)' }}>
                            {isLogin ? "Switch to Signup" : "Switch to Login"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
