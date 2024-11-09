export type ChangePasswordForm = {
    verifyToken: string;
    password: string;
    confirmPassword: string;
    email?: string;
}

export type LoginForm = {
    password: string;
    email?: string;
};