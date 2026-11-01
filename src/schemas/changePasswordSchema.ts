import * as zod from "zod";
import { regex } from "../utils/regex";


export const changePasswordSchema = zod
    .object({
        password: zod
            .string()
            .nonempty("Current password is required"),
        newPassword: zod
            .string()
            .nonempty("New password is required")
            .regex(
                regex.password,
                "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            ),
        rePassword: zod.string().nonempty("Confirm Password is required"),
    })
    .refine((data) => data.newPassword !== data.password, {
        message: "New password must be different from the current password",
        path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.rePassword, {
        message: "Confirm Password must match the New Password",
        path: ["rePassword"],
    });