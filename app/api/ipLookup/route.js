import { NextResponse } from 'next/server'

/**
 * 代理请求腾讯IP查询API
 * 解决跨域问题和获取真实用户IP
 */
export async function GET(request) {
  try {
    // 获取客户端真实IP地址
    let clientIp = null
    const forwardedFor = request.headers.get('x-forwarded-for')

    if (forwardedFor) {
      // 正确取第一个IP（真实客户端IP）
      console.log('forwardedFor:', forwardedFor)
      clientIp = forwardedFor.split(',')[1]?.trim()
    } 

    console.log('用户IP地址:', clientIp)

    // 如果有获取到客户端IP，将其传递给腾讯API
    // 注意：腾讯API使用的是客户端访问时的IP，而不是我们显式传递的IP
    // 这里我们仍然请求腾讯API，但同时保存我们获取到的IP信息
    const response = await fetch('https://r.inews.qq.com/api/ip2city', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': clientIp,
      },
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`Failed to fetch IP info: ${response.status}`);
    }

    // 解析响应数据
    const data = await response.json()

    // 记录腾讯API返回的IP和我们获取的IP，用于对比
    console.log('腾讯API返回的IP:', data.ip)
    console.log('我们获取的IP:', clientIp);

    // 如果查询失败则提前返回
    if (data.ret !== 0) {
      return NextResponse.json({
        ip: clientIp || "未知",
        country: "未知",
        region: "",
        city: "",
      });
    }

    // 返回处理后的地理位置信息，优先使用我们从请求头获取的客户端IP
    return NextResponse.json({
      ip: clientIp || data.ip,
      country: data.country,
      region: data.province,
      city: data.city,
    });
  } catch (error) {
    console.error('获取IP信息失败:', error)
    // 尝试获取客户端IP作为fallback
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '未知';
    return NextResponse.json(
      {
        error: '获取IP信息失败',
        ip: clientIp,
        country: '未知',
        region: '',
        city: '',
      },
      { status: 500 }
    );
  }
} 