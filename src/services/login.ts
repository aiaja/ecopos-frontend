import { BASE_URL } from "./BASE_URL"

type LoginRequest = {
    email: string;
    password: string;
}


export const LoginService = async (data: LoginRequest) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const result = await response.json();
    return result;
}
//