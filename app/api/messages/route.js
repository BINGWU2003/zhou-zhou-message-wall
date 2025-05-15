import { NextResponse } from 'next/server'

// 模拟数据库 - 在实际应用中应该使用真实数据库
let messages = [
  {
    id: '1',
    name: '小明',
    content: '周周老师，加油！你的课程一定很精彩！',
    timestamp: new Date('2023-10-10').toISOString(),
  },
  {
    id: '2',
    name: '小红',
    content: '周周老师辛苦了，祝你备考顺利！',
    timestamp: new Date('2023-10-11').toISOString(),
  },
  {
    id: '3',
    name: '老王',
    content: '周周老师，你的学生们都等着听你的精彩课程！',
    timestamp: new Date('2023-10-12').toISOString(),
  },
]

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

    const newMessage = {
      id: Date.now().toString(),
      name,
      content,
      timestamp: new Date().toISOString(),
    }

    messages.unshift(newMessage)

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '提交留言失败' },
      { status: 500 }
    )
  }
} 