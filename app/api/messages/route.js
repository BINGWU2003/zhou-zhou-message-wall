import { NextResponse } from 'next/server'

// 模拟数据库 - 在实际应用中应该使用真实数据库
let messages = [
  {
    id: '1',
    name: '小明',
    content: '周周老师，加油！你的课程一定很精彩！',
    timestamp: new Date('2023-10-10').toISOString(),
    ip: '114.88.200.120',
    location: {
      country: '中国',
      province: '上海',
      city: '上海市'
    }
  },
  {
    id: '2',
    name: '小红',
    content: '周周老师辛苦了，祝你备考顺利！',
    timestamp: new Date('2023-10-11').toISOString(),
    ip: '220.181.38.148',
    location: {
      country: '中国',
      province: '北京',
      city: '北京市'
    }
  },
  {
    id: '3',
    name: '老王',
    content: '周周老师，你的学生们都等着听你的精彩课程！',
    timestamp: new Date('2023-10-12').toISOString(),
    ip: '123.125.71.38',
    location: {
      country: '中国',
      province: '广东',
      city: '深圳市'
    }
  },
]

// 获取IP地址和地理位置信息
async function getIpLocation(ip) {
  try {
    // 如果是开发环境或没有IP地址，返回默认值
    if (!ip || ip === '::1' || ip.includes('127.0.0.1')) {
      return {
        country: '未知',
        province: '未知',
        city: '未知'
      }
    }

    // 使用内部API端点查询IP地理位置
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : ''

    const response = await fetch(`${baseUrl}/api/ipLookup?ip=${ip}`)
    const data = await response.json()

    if (data && data.status === 'success') {
      return {
        country: data.country || '未知',
        province: data.regionName || '未知',
        city: data.city || '未知'
      }
    } else {
      return {
        country: '未知',
        province: '未知',
        city: '未知'
      }
    }
  } catch (error) {
    console.error('IP地理位置查询失败:', error)
    return {
      country: '未知',
      province: '未知',
      city: '未知'
    }
  }
}

// 获取客户端真实IP
function getClientIp(request) {
  // 首先尝试从中间件添加的头中获取
  const clientIp = request.headers.get('x-client-ip')
  if (clientIp && clientIp !== '127.0.0.1') {
    return clientIp
  }

  // 如果中间件头不可用，尝试其他标准头
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // 如果有多个IP，取第一个（最原始的客户端IP）
    return forwardedFor.split(',')[0].trim()
  }

  // 尝试获取其他可能的IP头
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // 在开发环境中，可能没有上述头信息
  return request.headers.get('host')?.split(':')[0] || '127.0.0.1'
}

export async function GET() {
  // 按时间倒序排列
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )

  return NextResponse.json({ messages: sortedMessages })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, content } = body

    if (!name || !content) {
      return NextResponse.json(
        { error: '姓名和留言内容不能为空' },
        { status: 400 }
      )
    }

    // 获取客户端IP地址
    const clientIp = getClientIp(request)

    // 获取IP地理位置信息
    const location = await getIpLocation(clientIp);

    const newMessage = {
      id: Date.now().toString(),
      name,
      content,
      timestamp: new Date().toISOString(),
      ip: clientIp,
      location
    }

    messages.unshift(newMessage)

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error('提交留言失败:', error);
    return NextResponse.json(
      { error: '提交留言失败' },
      { status: 500 }
    )
  }
} 