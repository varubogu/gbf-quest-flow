import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const nodeProcess = globalThis.process;

/**
 * Cloudflare Pages は bun.lock を検出せず npm で入れたあと、
 * ダッシュボードのビルドコマンドが空、または bun 未インストールのことがある。
 * CF_PAGES のときだけ本番ビルドを補完する。
 */
function runPagesBuild() {
  if (nodeProcess.env.CF_PAGES !== '1') {
    return;
  }

  if (existsSync('dist/index.html')) {
    return;
  }

  const result = spawnSync('npm', ['run', 'build'], {
    stdio: 'inherit',
    env: nodeProcess.env,
  });
  nodeProcess.exit(result.status ?? 1);
}

runPagesBuild();
