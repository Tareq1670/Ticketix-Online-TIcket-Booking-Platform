"use client";

import {
    Button,
    Description,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useState, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineEventSeat } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi2";
import {
    BsShieldLock,
    BsEnvelope,
    BsPerson,
    BsPeopleFill,
    BsArrowRight,
    BsArrowLeft,
    BsCheckCircleFill,
    BsCircle,
} from "react-icons/bs";
import {
    FiUploadCloud,
    FiX,
    FiCheck,
    FiCamera,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";
import { RiStoreLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { imageUploader } from "@/lib/imageUpload";
import { authClient } from "@/lib/auth-client";

const validateStrongPassword = (value) => {
    if (!value || value.length < 8)
        return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value))
        return "Password must contain at least 1 uppercase letter";
    if (!/[a-z]/.test(value))
        return "Password must contain at least 1 lowercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least 1 number";
    if (!/[^A-Za-z0-9]/.test(value))
        return "Password must contain at least 1 special character";
    return null;
};

const STEPS = [
    { id: 1, title: "Role", icon: "👤" },
    { id: 2, title: "Profile", icon: "📝" },
    { id: 3, title: "Security", icon: "🔐" },
];

const RegisterPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";
    const fileInputRef = useRef(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);

    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const updateField = useCallback((field, value) => {
        setFormFields((prev) => ({ ...prev, [field]: value }));
    }, []);

    const passwordStrength = useMemo(() => {
        const p = formFields.password;
        if (!p) return { score: 0, label: "", color: "" };
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[a-z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;

        const configs = [
            { label: "", color: "" },
            { label: "Very Weak", color: "bg-red-500" },
            { label: "Weak", color: "bg-orange-500" },
            { label: "Fair", color: "bg-yellow-500" },
            { label: "Good", color: "bg-green-400" },
            { label: "Strong ✓", color: "bg-green-500" },
        ];
        return { score: s, ...configs[s] };
    }, [formFields.password]);

    const isStepValid = useCallback(
        (step) => {
            switch (step) {
                case 1:
                    return selectedRole !== "";
                case 2:
                    return (
                        formFields.name.trim().length >= 2 &&
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            formFields.email,
                        )
                    );
                case 3:
                    return (
                        !validateStrongPassword(formFields.password) &&
                        formFields.password === formFields.confirmPassword &&
                        agreedTerms
                    );
                default:
                    return false;
            }
        },
        [selectedRole, formFields, agreedTerms],
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        processImage(file);
    };

    const processImage = (file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB", {
                position: "top-center",
                style: { borderRadius: "12px" },
            });
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file", {
                position: "top-center",
                style: { borderRadius: "12px" },
            });
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processImage(e.dataTransfer.files[0]);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const nextStep = () => {
        if (isStepValid(currentStep) && currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isStepValid(3)) return;

        setError("");
        setLoading(true);

        try {
            let imageURL = "";
            if (imageFile) {
                const uploadData = await imageUploader(imageFile);
                imageURL = uploadData?.display_url || uploadData?.url || "";
            }

            const { data, error } = await authClient.signUp.email({
                email: formFields.email,
                password: formFields.password,
                name: formFields.name,
                image: imageURL || undefined,
                role: selectedRole,
            });

            if (error) {
                setError(
                    error.message || "Registration failed. Please try again.",
                );
                setLoading(false);
                return;
            }

            toast.success(
                `Welcome to Ticketix as ${selectedRole === "vendor" ? "a Vendor" : "a User"}! 🎉`,
                {
                    duration: 3500,
                    position: "top-center",
                    style: {
                        background:
                            "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                        color: "#065f46",
                        borderRadius: "16px",
                        border: "1px solid #6ee7b7",
                        fontWeight: "600",
                        padding: "14px 20px",
                    },
                },
            );

            router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        } catch (err) {
            setError(err?.message || "Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        if (!selectedRole) {
            toast.error("Please select a role first", {
                position: "top-center",
            });
            return;
        }

        try {
            document.cookie = `pending_role=${selectedRole}; path=/; max-age=600; SameSite=Lax`;

            await new Promise((resolve) => setTimeout(resolve, 100));

            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (err) {
            toast.error("Google sign-in failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-500 relative overflow-hidden">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-300/25 to-emerald-400/20 dark:from-green-800/10 dark:to-emerald-900/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-tl from-teal-300/20 to-green-400/15 dark:from-teal-900/10 dark:to-green-900/8 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-200/20 dark:bg-emerald-900/8 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-green-300/15 dark:bg-green-900/8 rounded-full blur-2xl animate-pulse delay-500" />

                <div className="absolute top-[10%] left-[6%] text-green-300/15 dark:text-green-700/10 animate-bounce duration-[3000ms]">
                    <IoTicketOutline size={55} />
                </div>
                <div className="absolute top-[18%] right-[10%] text-emerald-300/15 dark:text-emerald-700/10 animate-bounce delay-700 duration-[4000ms]">
                    <HiOutlineTicket size={40} />
                </div>
                <div className="absolute bottom-[15%] left-[10%] text-teal-300/12 dark:text-teal-700/8 animate-bounce delay-1000 duration-[3500ms]">
                    <MdOutlineEventSeat size={45} />
                </div>
                <div className="absolute bottom-[25%] right-[6%] text-green-300/12 dark:text-green-700/8 animate-bounce delay-300 duration-[4500ms]">
                    <IoTicketOutline size={30} />
                </div>
                <div className="absolute top-[55%] left-[3%] text-emerald-300/10 dark:text-emerald-800/6 animate-bounce delay-200 duration-[5000ms]">
                    <HiSparkles size={25} />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)]" />
            </div>

            <div className="relative w-full max-w-xl z-10">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-green-400/15 via-emerald-400/15 to-teal-400/15 dark:from-green-600/8 dark:via-emerald-600/8 dark:to-teal-600/8 rounded-3xl blur-2xl" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10 dark:from-green-600/5 dark:via-emerald-600/5 dark:to-teal-600/5 rounded-3xl blur-md" />

                <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-green-100/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl shadow-green-900/5 dark:shadow-black/30 overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

                    <div className="p-8 md:p-10">
                        <div className="text-center mb-8">
                            <div className="relative inline-flex items-center justify-center w-18 h-18 mb-4">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl rotate-6 opacity-20" />
                                <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/30">
                                    <IoTicketOutline
                                        className="text-white"
                                        size={30}
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent tracking-tight">
                                Join Ticketix
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
                                Create your account in just a few steps
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-0 mb-8">
                            {STEPS.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="flex items-center"
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (step.id < currentStep)
                                                setCurrentStep(step.id);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-400 ${
                                            step.id === currentStep
                                                ? "bg-green-100 dark:bg-green-900/25 border border-green-300 dark:border-green-700/50"
                                                : step.id < currentStep
                                                  ? "bg-green-50 dark:bg-green-900/15 border border-green-200/50 dark:border-green-800/30 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/25"
                                                  : "bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/30"
                                        }`}
                                    >
                                        <span className="text-base">
                                            {step.id < currentStep ? (
                                                <BsCheckCircleFill className="text-green-500 w-4 h-4" />
                                            ) : (
                                                step.icon
                                            )}
                                        </span>
                                        <span
                                            className={`text-xs font-semibold hidden sm:block ${
                                                step.id === currentStep
                                                    ? "text-green-700 dark:text-green-400"
                                                    : step.id < currentStep
                                                      ? "text-green-600 dark:text-green-500"
                                                      : "text-zinc-400 dark:text-zinc-500"
                                            }`}
                                        >
                                            {step.title}
                                        </span>
                                    </button>

                                    {index < STEPS.length - 1 && (
                                        <div
                                            className={`w-8 h-0.5 mx-1 rounded-full transition-colors duration-300 ${
                                                step.id < currentStep
                                                    ? "bg-green-400 dark:bg-green-600"
                                                    : "bg-zinc-200 dark:bg-zinc-700"
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-8 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${(currentStep / 3) * 100}%`,
                                }}
                            />
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40 rounded-2xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2.5 animate-in slide-in-from-top-2">
                                <svg
                                    className="w-5 h-5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {error}
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                                <div className="text-center mb-2">
                                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                                        How will you use Ticketix?
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                        Choose your account type to get started
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole("user")}
                                        className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-400 cursor-pointer group overflow-hidden ${
                                            selectedRole === "user"
                                                ? "border-green-500 bg-gradient-to-b from-green-50/90 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 shadow-lg shadow-green-500/15 scale-[1.02]"
                                                : "border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/30 dark:hover:bg-green-900/10 hover:shadow-md"
                                        }`}
                                    >
                                        {selectedRole === "user" && (
                                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                                                <FiCheck
                                                    className="text-white"
                                                    size={14}
                                                />
                                            </div>
                                        )}

                                        <div
                                            className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full transition-opacity ${
                                                selectedRole === "user"
                                                    ? "bg-green-200/30 dark:bg-green-800/15 opacity-100"
                                                    : "bg-zinc-200/20 dark:bg-zinc-700/10 opacity-0 group-hover:opacity-100"
                                            }`}
                                        />

                                        <div
                                            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                                selectedRole === "user"
                                                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 rotate-3"
                                                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-600 dark:group-hover:text-green-400"
                                            }`}
                                        >
                                            <BsPeopleFill size={24} />
                                        </div>

                                        <div className="text-center relative">
                                            <p
                                                className={`text-base font-bold ${
                                                    selectedRole === "user"
                                                        ? "text-green-700 dark:text-green-400"
                                                        : "text-zinc-700 dark:text-zinc-300"
                                                }`}
                                            >
                                                User
                                            </p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-relaxed">
                                                Browse events, book tickets
                                                <br />& enjoy experiences
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedRole("vendor")
                                        }
                                        className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-400 cursor-pointer group overflow-hidden ${
                                            selectedRole === "vendor"
                                                ? "border-green-500 bg-gradient-to-b from-green-50/90 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 shadow-lg shadow-green-500/15 scale-[1.02]"
                                                : "border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/30 dark:hover:bg-green-900/10 hover:shadow-md"
                                        }`}
                                    >
                                        {selectedRole === "vendor" && (
                                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                                                <FiCheck
                                                    className="text-white"
                                                    size={14}
                                                />
                                            </div>
                                        )}

                                        <div
                                            className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full transition-opacity ${
                                                selectedRole === "vendor"
                                                    ? "bg-green-200/30 dark:bg-green-800/15 opacity-100"
                                                    : "bg-zinc-200/20 dark:bg-zinc-700/10 opacity-0 group-hover:opacity-100"
                                            }`}
                                        />

                                        <div
                                            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                                selectedRole === "vendor"
                                                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 -rotate-3"
                                                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-600 dark:group-hover:text-green-400"
                                            }`}
                                        >
                                            <RiStoreLine size={24} />
                                        </div>

                                        <div className="text-center relative">
                                            <p
                                                className={`text-base font-bold ${
                                                    selectedRole === "vendor"
                                                        ? "text-green-700 dark:text-green-400"
                                                        : "text-zinc-700 dark:text-zinc-300"
                                                }`}
                                            >
                                                Vendor
                                            </p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-relaxed">
                                                Create events, sell tickets
                                                <br />& manage bookings
                                            </p>
                                        </div>
                                    </button>
                                </div>

                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    isDisabled={!isStepValid(1)}
                                    className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3.5 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-green-500/20 hover:shadow-green-500/35 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
                                >
                                    Continue
                                    <BsArrowRight size={16} />
                                </Button>

                                <div className="relative flex items-center justify-center">
                                    <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
                                    <span className="mx-4 text-zinc-400 dark:text-zinc-500 text-xs font-medium uppercase tracking-widest">
                                        Or
                                    </span>
                                    <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
                                </div>

                                <Button
                                    type="button"
                                    isDisabled={!selectedRole}
                                    onClick={handleGoogleRegister}
                                    variant="flat"
                                    className="w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 font-medium py-3 hover:bg-green-50 dark:hover:bg-zinc-700/70 transition-all duration-200 flex items-center justify-center gap-3 border border-zinc-200/60 dark:border-zinc-700/40 active:scale-[0.98]"
                                >
                                    <FcGoogle size={20} />
                                    Sign up with Google
                                </Button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-400">
                                <div className="flex flex-col items-center mb-2">
                                    <div className="relative group">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-green-400 dark:border-green-600 shadow-xl shadow-green-500/15 ring-4 ring-green-100 dark:ring-green-900/20">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors z-10"
                                                >
                                                    <FiX size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center shadow-lg transition-colors z-10"
                                                >
                                                    <FiCamera size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                                                    isDragging
                                                        ? "border-green-400 bg-green-50 dark:bg-green-900/20 scale-105"
                                                        : "border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/15 group-hover:scale-105"
                                                }`}
                                            >
                                                <FiUploadCloud
                                                    className="text-zinc-400 dark:text-zinc-500 group-hover:text-green-500 transition-colors"
                                                    size={22}
                                                />
                                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
                                                    Upload
                                                </span>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>

                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
                                        Upload a profile photo{" "}
                                        <span className="text-zinc-300 dark:text-zinc-600">
                                            (optional)
                                        </span>
                                    </p>

                                    {imageFile && (
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <FiCheck
                                                className="text-green-500"
                                                size={12}
                                            />
                                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                {imageFile.name} (
                                                {(
                                                    imageFile.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(1)}
                                                MB)
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <TextField
                                    isRequired
                                    name="name"
                                    type="text"
                                    className="w-full"
                                    value={formFields.name}
                                    onChange={(value) =>
                                        updateField("name", value)
                                    }
                                    validate={(value) => {
                                        if (!value || value.trim().length < 2)
                                            return "Name must be at least 2 characters";
                                        if (value.trim().length > 50)
                                            return "Name must be less than 50 characters";
                                        return null;
                                    }}
                                >
                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 z-10 pointer-events-none">
                                            <BsPerson size={16} />
                                        </div>
                                        <Input
                                            autoComplete="name"
                                            placeholder="Enter your full name"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400/20 dark:focus:ring-green-500/15 outline-none transition-all duration-200 text-sm"
                                        />
                                    </div>
                                    <FieldError className="text-xs text-red-500 mt-1.5" />
                                </TextField>

                                <TextField
                                    isRequired
                                    name="email"
                                    type="email"
                                    className="w-full"
                                    value={formFields.email}
                                    onChange={(value) =>
                                        updateField("email", value)
                                    }
                                    validate={(value) => {
                                        if (
                                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                                value,
                                            )
                                        )
                                            return "Please enter a valid email address";
                                        return null;
                                    }}
                                >
                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 z-10 pointer-events-none">
                                            <BsEnvelope size={16} />
                                        </div>
                                        <Input
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400/20 dark:focus:ring-green-500/15 outline-none transition-all duration-200 text-sm"
                                        />
                                    </div>
                                    <FieldError className="text-xs text-red-500 mt-1.5" />
                                </TextField>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        onClick={prevStep}
                                        variant="flat"
                                        className="flex-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium py-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 flex items-center justify-center gap-2 border border-zinc-200/50 dark:border-zinc-700/50 active:scale-[0.98]"
                                    >
                                        <BsArrowLeft size={14} />
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        isDisabled={!isStepValid(2)}
                                        className="flex-[2] rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-green-500/20 hover:shadow-green-500/35 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        Continue
                                        <BsArrowRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <Form
                                onSubmit={handleRegister}
                                className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-400"
                            >
                                <TextField
                                    isRequired
                                    minLength={8}
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="w-full"
                                    value={formFields.password}
                                    onChange={(value) =>
                                        updateField("password", value)
                                    }
                                    validate={validateStrongPassword}
                                >
                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 z-10 pointer-events-none">
                                            <BsShieldLock size={16} />
                                        </div>
                                        <Input
                                            autoComplete="new-password"
                                            placeholder="Create a strong password"
                                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400/20 dark:focus:ring-green-500/15 outline-none transition-all duration-200 text-sm"
                                        />
                                        <Button
                                            variant="none"
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-green-600 dark:hover:text-green-400 transition-colors z-10 p-1"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff size={16} />
                                            ) : (
                                                <FiEye size={16} />
                                            )}
                                        </Button>
                                    </div>

                                    {formFields.password && (
                                        <div className="mt-2.5 space-y-1.5">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(
                                                    (level) => (
                                                        <div
                                                            key={level}
                                                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                                                level <=
                                                                passwordStrength.score
                                                                    ? passwordStrength.color
                                                                    : "bg-zinc-200 dark:bg-zinc-700"
                                                            }`}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                            <p
                                                className={`text-[11px] font-medium ${
                                                    passwordStrength.score <= 2
                                                        ? "text-red-500"
                                                        : passwordStrength.score <=
                                                            3
                                                          ? "text-yellow-500"
                                                          : "text-green-500"
                                                }`}
                                            >
                                                {passwordStrength.label}
                                            </p>
                                        </div>
                                    )}

                                    {formFields.password && (
                                        <div className="mt-3 grid grid-cols-2 gap-1.5">
                                            {[
                                                {
                                                    label: "8+ characters",
                                                    valid:
                                                        formFields.password
                                                            .length >= 8,
                                                },
                                                {
                                                    label: "Uppercase",
                                                    valid: /[A-Z]/.test(
                                                        formFields.password,
                                                    ),
                                                },
                                                {
                                                    label: "Lowercase",
                                                    valid: /[a-z]/.test(
                                                        formFields.password,
                                                    ),
                                                },
                                                {
                                                    label: "Number",
                                                    valid: /[0-9]/.test(
                                                        formFields.password,
                                                    ),
                                                },
                                                {
                                                    label: "Special char",
                                                    valid: /[^A-Za-z0-9]/.test(
                                                        formFields.password,
                                                    ),
                                                },
                                            ].map((req) => (
                                                <div
                                                    key={req.label}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    {req.valid ? (
                                                        <BsCheckCircleFill
                                                            className="text-green-500 flex-shrink-0"
                                                            size={11}
                                                        />
                                                    ) : (
                                                        <BsCircle
                                                            className="text-zinc-300 dark:text-zinc-600 flex-shrink-0"
                                                            size={11}
                                                        />
                                                    )}
                                                    <span
                                                        className={`text-[11px] ${
                                                            req.valid
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-zinc-400 dark:text-zinc-500"
                                                        }`}
                                                    >
                                                        {req.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <FieldError className="text-xs text-red-500 mt-1.5" />
                                </TextField>

                                <TextField
                                    isRequired
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="w-full"
                                    value={formFields.confirmPassword}
                                    onChange={(value) =>
                                        updateField("confirmPassword", value)
                                    }
                                    validate={(value) => {
                                        if (!value)
                                            return "Please confirm your password";
                                        if (value !== formFields.password)
                                            return "Passwords do not match";
                                        return null;
                                    }}
                                >
                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 z-10 pointer-events-none">
                                            <BsShieldLock size={16} />
                                        </div>
                                        <Input
                                            autoComplete="new-password"
                                            placeholder="Re-enter your password"
                                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400/20 dark:focus:ring-green-500/15 outline-none transition-all duration-200 text-sm"
                                        />
                                        <Button
                                            variant="none"
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-green-600 dark:hover:text-green-400 transition-colors z-10 p-1"
                                        >
                                            {showConfirmPassword ? (
                                                <FiEyeOff size={16} />
                                            ) : (
                                                <FiEye size={16} />
                                            )}
                                        </Button>
                                    </div>

                                    {formFields.confirmPassword && (
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            {formFields.confirmPassword ===
                                            formFields.password ? (
                                                <>
                                                    <BsCheckCircleFill
                                                        className="text-green-500"
                                                        size={12}
                                                    />
                                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                        Passwords match
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiX
                                                        className="text-red-500"
                                                        size={12}
                                                    />
                                                    <span className="text-xs text-red-500 font-medium">
                                                        Passwords don&apos;t
                                                        match
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <FieldError className="text-xs text-red-500 mt-1.5" />
                                </TextField>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/30">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        name="terms"
                                        checked={agreedTerms}
                                        onChange={(e) =>
                                            setAgreedTerms(e.target.checked)
                                        }
                                        className="w-4 h-4 mt-0.5 rounded border-zinc-300 dark:border-zinc-600 text-green-600 focus:ring-green-500 dark:bg-zinc-800 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none leading-relaxed"
                                    >
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="text-green-600 dark:text-green-400 font-medium hover:underline"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="text-green-600 dark:text-green-400 font-medium hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>

                                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/50 dark:from-green-900/15 dark:to-emerald-900/10 border border-green-200/50 dark:border-green-800/30">
                                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
                                        <HiSparkles size={14} />
                                        Account Summary
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                            <span className="font-medium">
                                                Role:
                                            </span>{" "}
                                            <span className="capitalize text-green-600 dark:text-green-400 font-semibold">
                                                {selectedRole}
                                            </span>
                                        </p>
                                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                            <span className="font-medium">
                                                Name:
                                            </span>{" "}
                                            {formFields.name}
                                        </p>
                                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                            <span className="font-medium">
                                                Email:
                                            </span>{" "}
                                            {formFields.email}
                                        </p>
                                        {imageFile && (
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                <span className="font-medium">
                                                    Photo:
                                                </span>{" "}
                                                ✓ Uploaded
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <Button
                                        type="button"
                                        onClick={prevStep}
                                        variant="flat"
                                        className="flex-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium py-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 flex items-center justify-center gap-2 border border-zinc-200/50 dark:border-zinc-700/50 active:scale-[0.98]"
                                    >
                                        <BsArrowLeft size={14} />
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        isDisabled={
                                            isLoading || !isStepValid(3)
                                        }
                                        className="flex-[2] rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-green-500/20 hover:shadow-green-500/35 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <IoTicketOutline size={18} />
                                                Create Account
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}

                        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-8">
                            Already have an account?{" "}
                            <Link
                                href={`/login?redirect=${encodeURIComponent(redirect)}`}
                                className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
