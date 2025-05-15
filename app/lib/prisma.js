import { PrismaClient } from '@prisma/client'

// 创建全局PrismaClient实例以避免热重载导致的连接过多
// 参考: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

// 数据库连接配置
const databaseUrl = "mysql://root:HUJIACHENG520hjc@sh-cynosdbmysql-grp-dak355dq.sql.tencentcdb.com:28365/message_wall"

const globalForPrisma = global

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma 