# SuggestTextInput コンポーネント

サジェスト機能付きのテキスト入力コンポーネントです。ユーザーが入力中に候補を表示し、選択できるようにします。

## 基本的な使い方

```tsx
import { SuggestTextInput, SuggestItem } from '@/components/molecules/common/SuggestTextInput';

// サジェスト候補を取得する関数
const handleSuggest = async (query: string): Promise<SuggestItem[]> => {
  // 例: APIから候補を取得する場合
  // const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
  // return await response.json();

  // または、ローカルでフィルタリングする場合
  const items: SuggestItem[] = [
    { id: '1', label: '東京' },
    { id: '2', label: '大阪' },
    { id: '3', label: '名古屋' },
    { id: '4', label: '福岡' },
    { id: '5', label: '札幌' },
  ];

  return items.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );
};

// コンポーネントの使用例
const MyComponent = () => {
  const [value, setValue] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<SuggestItem | null>(null);

  return (
    <div>
      <SuggestTextInput
        placeholder="都市名を入力"
        onSuggest={handleSuggest}
        onChange={(value) => setValue(value)}
        onSelect={(item) => setSelectedItem(item)}
      />

      {selectedItem && (
        <div>
          選択された項目: {selectedItem.label} (ID: {selectedItem.id})
        </div>
      )}
    </div>
  );
};
```

## Props

| プロパティ名 | 型 | 必須 | デフォルト値 | 説明 |
|------------|-----|------|------------|------|
| onSuggest | `(query: string) => Promise<SuggestItem[]> \| SuggestItem[]` | ✓ | - | 入力された文字列に基づいてサジェスト候補を取得する関数 |
| onChange | `(value: string) => void` | - | - | 入力値が変更された時に呼ばれるコールバック |
| onSelect | `(item: SuggestItem) => void` | - | - | サジェスト候補が選択された時に呼ばれるコールバック |
| maxSuggestions | `number` | - | 5 | 表示するサジェスト候補の最大数 |
| debounceMs | `number` | - | 300 | サジェスト取得のデバウンス時間（ミリ秒） |

その他、`TextInput`コンポーネントのプロパティ（`error`、`errorMessage`、`rightElement`など）も使用できます。

## SuggestItem インターフェース

```tsx
interface SuggestItem {
  id: string;   // サジェストアイテムの一意のID
  label: string; // サジェストアイテムの表示名
}
```

## 機能

- 入力中にサジェスト候補を表示
- キーボード操作（上下矢印キー、Enter、Escape）でのサジェスト選択
- マウスでのサジェスト選択
- デバウンス機能による過剰なAPI呼び出しの防止
- 最大表示数の制限
- エラー表示機能（TextInputの機能を継承）