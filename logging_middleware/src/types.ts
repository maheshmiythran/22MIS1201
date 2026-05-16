export type Stack = "frontend";

export type Level = "debug" | "info" | "warn" | "error" | "fatal";

export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

export type SharedPackage =
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export type Package = FrontendPackage | SharedPackage;

export interface LogRequestBody {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

export interface AuthRequestBody {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export interface LoggerConfig {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
  baseUrl?: string;
  consoleOutput?: boolean;
}
