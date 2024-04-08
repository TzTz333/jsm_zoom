import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoutes = createRouteMatcher([
  '/',
  '/upcoming',
  '/previous',
  '/recordings',
  '/personal-room',
  '/meeting(.*)',
])

//中间件，通过要求用户在访问这些路由之前进行身份验证来保护应用程序中某些路由的方式
export default clerkMiddleware((auth, req) =>{
  if(protectedRoutes(req)) auth().protect();
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)','/','/(api|trpc)(.*)'],
};
