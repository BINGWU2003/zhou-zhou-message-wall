import { NextResponse } from 'next/server'

// IP地址查询API
export async function GET(request) {
  try {
    // 从URL参数中获取IP地址
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get('ip')

    if (!ip) {
      return NextResponse.json({ error: 'IP参数缺失' }, { status: 400 })
    }

    // 如果是本地IP或内部IP，返回默认值
    if (ip === '::1' || ip.includes('127.0.0.1') || ip.includes('localhost')) {
      return NextResponse.json({
        status: 'success',
        country: '未知',
        regionName: '未知',
        city: '未知'
      })
    }

    // 使用ip-api.com服务查询IP地理位置
    const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`IP查询服务响应错误: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('IP地址查询错误:', error)
    return NextResponse.json(
      {
        error: 'IP地址查询失败',
        message: error.message
      },
      { status: 500 }
    )
  }
} 