import { Logger, AuthManager } from "logging-middleware";

const config = {
  email: "student@example",
  name: "Student",
  rollNo: "XXXX",
  accessCode: "XXXX",
  clientID: "XXXX",
  clientSecret: "XXXX",
};

const logger = new Logger(config);
const auth = new AuthManager(config);

async function start() {
  const token = await auth.getToken();

  const res = await fetch("http://4.224.186.213/evaluation-service/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    await logger.Log("frontend", "error", "api", "Failed to fetch notifications");
    return;
  }

  const data = await res.json();
  const list = data.notifications;

  const weights: any = { Placement: 3, Result: 2, Event: 1 };

  const sorted = list.sort((a: any, b: any) => {
    const wa = weights[a.Type] || 0;
    const wb = weights[b.Type] || 0;
    if (wa !== wb) return wb - wa;
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
  });

  const top10 = sorted.slice(0, 10);

  await logger.Log("frontend", "info", "utils", "Top 10 notifications sorted");

  top10.forEach((n: any, i: number) => {
    console.log(`${i + 1}. [${n.Type}] ${n.Message} | ${n.Timestamp}`);
  });
}

start().catch(async (err) => {
  await logger.Log("frontend", "fatal", "utils", err.message);
});
