"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authCookieName, authCookieValue, isValidLogin } from "@/lib/auth";
import { withToast } from "@/lib/toastUrl";

export type LoginActionState = {
  ok: boolean;
  message?: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidLogin(username, password)) {
    return {
      ok: false,
      message: "Invalid username or password."
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(authCookieName, authCookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  redirect(withToast("/", "Logged in successfully."));
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete(authCookieName);
  redirect(withToast("/login", "Logged out successfully."));
}
