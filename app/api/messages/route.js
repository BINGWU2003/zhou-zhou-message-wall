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

/**
 * 删除留言
 */
export async function DELETE(request) {
  try {
    // 从URL获取要删除的留言ID
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    // 验证ID是否存在
    if (!id) {
      return NextResponse.json(
        { error: '未提供留言ID' },
        { status: 400 }
      )
    }

    // 查找并删除留言
    const deletedMessage = await prisma.message.delete({
      where: {
        id: id,
      },
    })

    // 如果没有找到对应ID的留言，delete操作会抛出异常
    // 所以如果执行到这一步，说明删除成功
    return NextResponse.json(
      { message: '留言删除成功', id: deletedMessage.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除留言失败:', error)

    // 处理留言不存在的情况
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: '留言不存在' },
        { status: 404 }
      )
    }

    // 数据库连接错误特殊处理
    if (error.code === 'P1001' || error.code === 'P1002') {
      return NextResponse.json(
        { error: '数据库连接失败，请联系管理员' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: '删除留言失败，请稍后重试' },
      { status: 500 }
    )
  }
} 