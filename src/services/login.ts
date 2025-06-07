import { BASE_URL } from "./BASE_URL"

type LoginRequest = {
    email: string;
    password: string;
}

type ValidationErrors = {
  [key: string]: string[];
};

type ErrorResponse = {
  error?: string;
  message?: string;
  errors?: ValidationErrors;
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
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      try {
        const errorData: ErrorResponse = await response.json();

        if (errorData.errors && typeof errorData.errors === 'object') {
          const fieldKeys = Object.keys(errorData.errors);
          if (fieldKeys.length > 0) {
            const firstErrorField = fieldKeys[0];
            if (errorData.errors[firstErrorField] && errorData.errors[firstErrorField].length > 0) {
              errorMessage = errorData.errors[firstErrorField][0];
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.warn("Gagal parse error response atau struktur tidak dikenal:", e);
        errorMessage = `Error ${response.status}: ${response.statusText || 'tidak diketahui dari server'}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
}
//