import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/'],
  afterAuth(auth, req) {
    if(auth.userId && auth.isPublicRoute) {
        let path = "/select-org";
        if(auth.orgId) {
            path = `/organization/${auth.orgId}`;
        }
        const orgSelection = new URL(path, req.url);
        return NextResponse.redirect(orgSelection)
    }
    if(!auth.userId && !auth.isPublicRoute) {
        return redirectToSignIn({returnBackUrl: req.url})
    }
    if(auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
        const orgSelection = new URL("/select-org", req.url);
        return NextResponse.redirect(orgSelection)
    }
  }
  // Routes that can always be accessed, and have
  // no authentication information
//   ignoredRoutes: ['/no-auth-in-this-route'],
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};