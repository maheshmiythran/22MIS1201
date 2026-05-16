import { AuthRequestBody, AuthResponse, LoggerConfig } from "./types";

export class AuthManager {
  private config: LoggerConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private refreshPromise: Promise<string> | null = null;
  private baseUrl: string;

  constructor(config: LoggerConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || "http://4.224.186.213/evaluation-service";
  }

  async getToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    if (this.accessToken && now < this.tokenExpiresAt - 60) {
      return this.accessToken;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.fetchToken();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async fetchToken(): Promise<string> {
    const authBody: AuthRequestBody = {
      email: this.config.email,
      name: this.config.name,
      rollNo: this.config.rollNo,
      accessCode: this.config.accessCode,
      clientID: this.config.clientID,
      clientSecret: this.config.clientSecret,
    };

    const response = await fetch(`${this.baseUrl}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth failed: ${errorText}`);
    }

    const data = (await response.json()) as AuthResponse;

    this.accessToken = data.access_token;
    this.tokenExpiresAt = data.expires_in;

    return this.accessToken;
  }
}
