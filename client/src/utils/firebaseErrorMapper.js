export const mapFirebaseAuthError = (error) => {
    const errorCode = typeof error === "string" ? error.match(/auth\/[a-z\-]+/)?.[0] : error?.code;

    const errorMap = {
        "auth/invalid-credential": "Invalid credentials. Please check your email or password.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Try again.",
        "auth/network-request-failed": "Network error. Please check your internet connection.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/invalid-email": "Invalid email format.",
    };

    return errorMap[errorCode] || "An unexpected error occurred. Please try again.";
};
