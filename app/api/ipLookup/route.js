import { NextResponse } from 'next/server'

// 配置为动态路由，必须添加这个导出，否则会尝试静态生成
export const dynamic = 'force-dynamic'

/**
 * 查询地理位置信息
 * 接收前端传递的经纬度参数，使用高德地图API进行逆地理编码
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const longitude = searchParams.get('longitude')
    const latitude = searchParams.get('latitude')
    // 获取客户端IP地址（作为备用）
    const forwardedIp = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    let ip = forwardedIp || realIp || '未知'

    // 如果包含逗号，说明是代理链，取逗号后面的第一个IP（通常是客户端真实IP）
    if (ip.includes(',')) {
      ip = ip.split(',')[1].trim()
    }

    // 如果没有经纬度参数，直接返回IP信息（没有地理位置）
    if (!longitude || !latitude) {
      return NextResponse.json({
        ip,
        country: '未知',
        region: '',
        city: '',
      })
    }

    // 使用高德地图API进行逆地理编码
    const apiKey = 'c142d6684599db54cbf8dd0fbc8f74e7'
    const location = `${longitude},${latitude}`
    const apiUrl = `https://restapi.amap.com/v3/geocode/regeo?key=${apiKey}&location=${location}&radius=1000&extensions=all&output=json`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`Failed to fetch location info: ${response.status}`)
    }

    // 解析响应数据
    const data = await response.json()
    // 如果查询失败则提前返回
    if (data.status !== '1') {
      console.error('高德地图API返回错误:', data.info)
      return NextResponse.json({
        ip,
        country: '中国',
        region: '',
        city: '',
      })
    }

    const addressComponent = data.regeocode?.addressComponent

    // 返回所需的地理位置信息，只保留国家、省、市和IP
    return NextResponse.json({
      ip,
      country: addressComponent?.country || '中国',
      region: addressComponent?.province || '',
      city: addressComponent?.city || '',
    })
  } catch (error) {
    console.error('获取地理位置信息失败:', error)
    return NextResponse.json(
      {
        error: '获取地理位置信息失败',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '未知',
        country: '未知',
        region: '',
        city: '',
      },
      { status: 500 }
    )
  }
}