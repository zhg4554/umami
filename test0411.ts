// pages/api/test0411.ts
import fs from 'fs';
import path from 'path';

export default function handler(req: any, res: any) {
  const root = process.cwd(); 
  let results: string[] = [];

  // 递归查找所有 .crt 文件
  const finder = (dir: string) => {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.resolve(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !fullPath.includes('node_modules')) {
        finder(fullPath);
      } else if (file.endsWith('.crt')) {
        results.push(fullPath);
      }
    }
  };

  try {
    finder(root);
    res.status(200).json({
      cwd: root,
      absolute_paths: results,
      message: results.length === 0 ? "未找到证书，请确认 Resources 页面是否有该文件" : "请将下方路径填入 sslcert 参数"
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
