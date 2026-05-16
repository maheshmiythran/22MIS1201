import { AuthManager } from "./auth";
import {
  Level,
  LoggerConfig,
  LogRequestBody,
  LogResponse,
  Package,
  Stack,
} from "./types";

const VALID_STACKS: Stack[] = ["frontend"];
const VALID_LEVELS: Level[] = ["debug", "info", "warn", "error", "fatal"];

const VALID_FRONTEND_PACKAGES: Package[] = [
  "api", "component", "hook", "page", "state", "style",
];

const VALID_SHARED_PACKAGES: Package[] = [
  "auth", "config", "middleware", "utils",
];

const ALL_VALID_PACKAGES: Package[] = [
  ...VALID_FRONTEND_PACKAGES,
  ...VALID_SHARED_PACKAGES,
];

export class Logger {
  private authManager: AuthManager;
  private baseUrl: string;
  private consoleOutput: boolean;

  constructor(config: LoggerConfig) {
    this.authManager = new AuthManager(config);
    this.baseUrl = config.baseUrl || "http://4.224.186.213/evaluation-service";
    this.consoleOutput = config.consoleOutput ?? true;
  }

  async Log(
    stack: Stack,
    level: Level,
    pkg: Package,
    message: string
  ): Promise<LogResponse | null> {
    if (!VALID_STACKS.includes(stack)) {
      throw new Error("Invalid stack");
    }

    if (!VALID_LEVELS.includes(level)) {
      throw new Error("Invalid level");
    }

    if (!ALL_VALID_PACKAGES.includes(pkg)) {
      throw new Error("Invalid package");
    }

    if (this.consoleOutput) {
      console.log(`[${level.toUpperCase()}] [${stack}/${pkg}] ${message}`);
    }

    try {
      const token = await this.authManager.getToken();
      
      let truncatedMessage = message;
      if (message.length > 48) {
        truncatedMessage = message.substring(0, 45) + "...";
      }

      const body: LogRequestBody = {
        stack,
        level,
        package: pkg,
        message: truncatedMessage,
      };

      const response = await fetch(`${this.baseUrl}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("Failed to send log");
        return null;
      }

      return (await response.json()) as LogResponse;
    } catch (error) {
      console.error("Error sending log");
      return null;
    }
  }
}
