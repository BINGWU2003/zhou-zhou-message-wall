import { NextResponse } from 'next/server'

/**
 * 查询IP地址信息
 * 在服务端使用http请求ip-api.com，避免前端混合内容问题
 */
export async function GET(request) {
  try {
    // 获取客户端IP地址
    const ip = request.headers.get('x-real-ip')
    // 通过ip-api.com接口获取IP地址信息
    // 在服务端发起http请求，避免客户端混合内容警告
    // console.log('ip', request.headers.get('x-forwarded-for'))
    // console.log('x-real-ip', request.headers.get('x-real-ip'))
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
      ip: data.query,
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