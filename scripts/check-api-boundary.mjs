import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const projectRoot = process.cwd();
const sourceRoot = join(projectRoot, "src");
const apiRoot = join(sourceRoot, "api");
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const databaseCallPattern = /\.(?:from|rpc)\s*\(/g;

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectSourceFiles(path) : [path];
    }),
  );

  return files.flat();
}

const violations = [];
const files = await collectSourceFiles(sourceRoot);

for (const file of files) {
  if (!sourceExtensions.has(extname(file)) || file.startsWith(apiRoot)) continue;

  const source = await readFile(file, "utf8");
  const lines = source.split("\n");

  lines.forEach((line, index) => {
    if (databaseCallPattern.test(line)) {
      violations.push(`${relative(projectRoot, file)}:${index + 1}`);
    }
    databaseCallPattern.lastIndex = 0;
  });
}

if (violations.length > 0) {
  console.error(
    `Direct Supabase database calls must live in src/api:\n${violations.join("\n")}`,
  );
  process.exitCode = 1;
}
