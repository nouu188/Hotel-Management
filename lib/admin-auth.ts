import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/sign-in");
  }
  return session;
}

export async function requireAdminApi() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export function withAdminApi(
  handler: (req: NextRequest, session: Session) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const session = await requireAdminApi();
      if (!session) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
      return await handler(req, session);
    } catch (error) {
      console.error(`Admin API error [${req.method} ${req.nextUrl.pathname}]:`, error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
