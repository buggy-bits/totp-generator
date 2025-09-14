const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

interface TOTPEntry {
  id: string;
  issuer: string;
}

interface CreateTOTPRequest {
  issuer: string;
  secretCode: string;
}

interface UpdateTOTPRequest {
  id: string;
  issuer: string;
  secretCode?: string;
}

interface TOTPResponse {
  status: string;
  data: {
    id: string;
    createdAt: string;
  };
}

interface OTPResponse {
  otp: string;
  expires: number;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new ApiError(
      `API Error: ${response.status} - ${errorText}`,
      response.status
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError("Invalid JSON response from server");
  }
}

export const api = {
  // Create new TOTP entry
  async createTOTP(data: CreateTOTPRequest): Promise<TOTPResponse> {
    const response = await fetch(`${API_BASE_URL}/api/totp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<TOTPResponse>(response);
  },

  // Get OTP for specific entry
  async getOTP(id: string): Promise<OTPResponse> {
    const response = await fetch(`${API_BASE_URL}/api/totp/${id}`);
    return handleResponse<OTPResponse>(response);
  },

  // Update TOTP entry
  async updateTOTP(data: UpdateTOTPRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/totp/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        issuer: data.issuer,
        secretCode: data.secretCode,
      }),
    });
    return handleResponse<void>(response);
  },

  // Delete TOTP entry
  async deleteTOTP(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/totp/${id}`, {
      method: "DELETE",
    });
    return handleResponse<void>(response);
  },

  // List all entries
  // async listEntries(): Promise<TOTPEntry[]> {
  //   const response = await fetch(`${API_BASE_URL}/api/list`);
  //   return handleResponse<TOTPEntry[]>(response);
  // },
};

export type {
  TOTPEntry,
  CreateTOTPRequest,
  UpdateTOTPRequest,
  TOTPResponse,
  OTPResponse,
};
export { ApiError };
