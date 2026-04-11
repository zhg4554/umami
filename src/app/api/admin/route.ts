import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


// 这行代码不需要执行，只要它存在，Vercel 的 NFT 分析器就会强制将该文件包含进运行环境
const _trace_trap = path.join(process.cwd(), '/prod-ca-2021.crt');


export const dynamic = 'force-dynamic'; // 禁用缓存，实时探测

export async function GET() {
  const root = process.cwd(); 
  let results: string[] = [];

  const finder = (dir: string) => {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.resolve(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        finder(fullPath);
      } else if (file.endsWith('.crt')) {
        results.push(fullPath);
      }
    }
  };

  try {
    finder(root);
    return NextResponse.json({
      cwd: root,
      absolute_paths: results,
      tip: "请将上面的路径直接填入 DATABASE_URL 的 sslcert 参数中"
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
