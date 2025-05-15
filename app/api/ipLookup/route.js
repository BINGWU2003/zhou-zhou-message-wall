import { NextResponse } from 'next/server'

/**
 * 代理请求腾讯IP查询API
 * 解决跨域问题
 */
export async function GET() {
  try {
    // 通过服务端请求腾讯API
    const response = await fetch('https://r.inews.qq.com/api/ip2city', {
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
    if (data.ret !== 0) {
      return NextResponse.json({
        ip: "未知",
        country: "未知",
        region: "",
        city: "",
      })
    }

    // 返回处理后的地理位置信息
    return NextResponse.json({
      ip: data.ip,
      country: data.country,
      region: data.province,
      city: data.city,
    })
  } catch (error) {
    console.error('获取IP信息失败:', error)
    return NextResponse.json(
      {
        error: '获取IP信息失败',
        ip: '未知',
        country: '未知',
        region: '',
        city: '',
      },
      { status: 500 }
    )
  }
} 