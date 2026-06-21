// Main dashboard — shows AI chat interface and usage stats
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/plans";
import ChatInterface from "@/components/chat/ChatInterface";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  const plan = user?.plan ?? "FREE";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await db.aIUsage.findUnique({
    where: { userId_date: { userId: session.user.id, date: today } },
  });

  const usedToday = usage?.requestCount ?? 0;
  const dailyLimit = plan === "FREE" ? PLANS.FREE.aiRequestsPerDay : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">AI Assistant</h1>
          <p className="text-sm text-gray-500">Powered by Claude {plan !== "FREE" ? "· Unlimited requests" : ""}</p>
        </div>
        {plan === "FREE" && (
          <a href="/billing"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
            Upgrade to Pro
          </a>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface plan={plan} usedToday={usedToday} dailyLimit={dailyLimit} />
      </div>
    </div>
  );
}
