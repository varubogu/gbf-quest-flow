import { http, HttpResponse } from 'msw';

// APIエンドポイントのモックを定義
export const handlers = [
  // 例: フローデータの取得
  http.get('/api/flows/:id', () => {
    return HttpResponse.json({
      id: '1',
      name: 'テストフロー',
      // 必要なレスポンスデータを追加
    });
  }),
];