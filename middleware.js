import { NextResponse } from 'next/server'

// 中间件：处理用户请求，记录IP地址
export function middleware(request) {
  // 获取客户端真实IP
  const clientIp = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    '127.0.0.1'

  // 创建响应对象
  const response = NextResponse.next()

  // 将IP地址添加到请求头中，以便服务器端组件可以访问
  response.headers.set('x-client-ip', clientIp)

  return response
}

// 配置中间件应用的路径
export const config = {
  matcher: [
    // 只对API路由和页面应用中间件
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 