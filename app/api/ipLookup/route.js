import { NextResponse } from 'next/server'

// 配置为动态路由，必须添加这个导出，否则会尝试静态生成
export const dynamic = 'force-dynamic'

/**
 * 查询IP地址信息
 * 在服务端使用http请求ip-api.com，避免前端混合内容问题
 */
export async function GET(request) {
  try {
    // 获取客户端IP地址
    const forwardedIp = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')

    // 处理可能包含多个IP的情况（如代理服务器链），取最后一个IP
    let ip = forwardedIp || realIp || '106.16.161.246' // 默认IP，仅用于测试

    // 如果包含逗号，说明是代理链，取逗号后面的第一个IP（通常是客户端真实IP）
    if (ip.includes(',')) {
      // 分割IP字符串，取逗号后的部分并去除空格
      ip = ip.split(',')[1].trim()
    }


    // 通过ip-api.com接口获取IP地址信息
    // 在服务端发起http请求，避免客户端混合内容警告
    const apiUrl = `http://ip-api.com/json/${ip}?lang=zh-CN`
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`Failed to fetch IP info: ${response.status}`)
    }

    // 解析响应数据
    const data = await response.json()

    // 如果查询失败则提前返回
    if (data.status === 'fail') {
      return NextResponse.json({
        ip: ip,
        country: '未知',
        region: '',
        city: '',
      })
    }

    // 返回所需的地理位置信息
    return NextResponse.json({
      ip: data.query || ip,
      ip1: forwardedIp,
      ip2: realIp,
      country: data.country,
      region: data.regionName,
      city: data.city,
    })
  } catch (error) {
    console.error('获取IP信息失败:', error)
    return NextResponse.json(
      {
        error: '获取IP信息失败',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '未知',
        country: '未知',
        region: '',
        city: '',
      },
      { status: 500 }
    )
  }
}