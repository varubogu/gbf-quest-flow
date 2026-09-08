import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

/**
 * Cloudflare Pages は bun.lock を検出せず npm で入れたあと、
 * ダッシュボードのビルドコマンドが空、または bun 未インストールのことがある。
 * CF_PAGES のときだけ本番ビルドを補完する。
 */
function runPagesBuild() {
  if (process.env.CF_PAGES !== '1') {
    return;
  }

  if (existsSync('dist/index.html')) {
    return;
  }

  const result = spawnSync('npm', ['run', 'build'], {
    stdio: 'inherit',
    env: process.env,
  });
  process.exit(result.status ?? 1);
}

runPagesBuild();
