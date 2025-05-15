import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

/**
 * 获取所有留言
 */
export async function GET() {
  try {
    // 从数据库获取留言，按时间倒序排列
    const messages = await prisma.message.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      // 为了安全起见，限制返回的结果数量
      take: 100,
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('获取留言失败:', error)
    return NextResponse.json(
      { error: '获取留言失败，请稍后重试' },
      { status: 500 }
    )
  }
}

/**
 * 创建新留言
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, content, ipInfo } = body

    // 验证必填字段
    if (!name || !content) {
      return NextResponse.json(
        { error: '姓名和留言内容不能为空' },
        { status: 400 }
      )
    }

    // 验证字段长度
    if (name.length > 50) {
      return NextResponse.json(
        { error: '姓名长度不能超过50个字符' },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: '留言内容不能超过500个字符' },
        { status: 400 }
      )
    }

    // 准备IP信息数据
    const ipData = ipInfo || {}

    // 在数据库中创建新留言
    const newMessage = await prisma.message.create({
      data: {
        name: name.trim(),
        content: content.trim(),
        // IP信息
        ip: ipData.ip || null,
        country: ipData.country || null,
        region: ipData.region || null,
        city: ipData.city || null,
        // timestamp会自动通过@default(now())设置
      },
    })

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error('提交留言失败:', error)

    // 数据库连接错误特殊处理
    if (error.code === 'P1001' || error.code === 'P1002') {
      return NextResponse.json(
        { error: '数据库连接失败，请联系管理员' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: '提交留言失败，请稍后重试' },
      { status: 500 }
    )
  }
} 