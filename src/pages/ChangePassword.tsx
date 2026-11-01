import { Alert, Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getInputProps } from "../utils/helpers";
import { authServices } from "../services/authService";
import { changePasswordSchema } from "../schemas/changePasswordSchema";
import type { ChangePasswordData } from "../types/changePasswordData";

export default function ChangePassword() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      rePassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutate, isPending, isSuccess, isError, data, error, reset: resetMutation } =
    useMutation({
      mutationFn: (values: ChangePasswordData) =>
        authServices.changePassword(values),
      onSuccess: (response) => {
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        reset();
      },
    });

  function changePassword(values: {
    password: string;
    newPassword: string;
    rePassword: string;
  }) {
    resetMutation();
    mutate({ password: values.password, newPassword: values.newPassword });
  }

  const errMsg = isError
    ? isAxiosError<{ message: string }>(error)
      ? (error.response?.data?.message ?? error.message)
      : "Something went wrong"
    : "";

  return (
    <form
      onSubmit={handleSubmit(changePassword)}
      className="max-w-md mx-auto my-10"
    >
      <div className="grid gap-4">
        <div className="grid gap-3 text-center">
          <h1>Change Password</h1>
          <p>Keep your account secure with a new password</p>
        </div>

        <Input
          {...register("password")}
          {...getInputProps("password", "Current Password")}
          isInvalid={!!errors.password?.message}
          errorMessage={errors.password?.message as string}
        />

        <Input
          {...register("newPassword")}
          {...getInputProps("password", "New Password")}
          isInvalid={!!errors.newPassword?.message}
          errorMessage={errors.newPassword?.message as string}
        />

        <Input
          {...register("rePassword")}
          {...getInputProps("password", "Confirm New Password")}
          isInvalid={!!errors.rePassword?.message}
          errorMessage={errors.rePassword?.message as string}
        />

        <Button
          isLoading={isPending}
          color="primary"
          variant="solid"
          type="submit"
        >
          Change Password
        </Button>

        {errMsg && (
          <Alert
            hideIcon
            color="danger"
            title={errMsg}
            variant="faded"
            classNames={{ base: "py-0 capitalize text-center" }}
          />
        )}
        {isSuccess && (
          <Alert
            hideIcon
            color="success"
            title={data.message}
            variant="faded"
            classNames={{ base: "py-0 capitalize text-center" }}
          />
        )}
      </div>
    </form>
  );
}