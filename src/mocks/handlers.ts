import { http, HttpResponse } from 'msw';

// APIエンドポイントのモックを定義
export const handlers = [
  // フローデータの取得
  http.get('/api/flows/:id', ({ params }) => {
    if (params.id === 'test-flow') {
      return HttpResponse.json({
        id: 'test-flow',
        name: 'テストフロー',
        organization: {
          job: {
            name: 'テストジョブ',
            element: 'fire',
          },
          characters: [
            {
              name: 'テストキャラ1',
              element: 'fire',
            },
            {
              name: 'テストキャラ2',
              element: 'fire',
            },
          ],
          weapons: [
            {
              name: 'テスト武器',
              element: 'fire',
            },
          ],
          summons: [
            {
              name: 'テスト召喚石',
              element: 'fire',
            },
          ],
        },
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),
];