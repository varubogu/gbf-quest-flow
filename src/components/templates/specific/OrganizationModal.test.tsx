import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrganizationModal } from '@/components/templates/specific/OrganizationModal';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import type { Flow } from '@/types/models';
import type { JSX } from 'react';
import type { EditModeStore, FlowStore } from '@/types/flowStore.types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        jobAndCharacters: 'ジョブ・キャラ',
        weapons: '武器',
        summons: '召喚石',
        video: '動画',
        skillTotals: 'スキル合計',
        job: 'ジョブ',
        characters: 'キャラクター',
      };
      return translations[key] || key;
    },
  }),
}));

// Dialog のモック
vi.mock('@/components/ui/dialog', async () => {
  const React = await import('react');
  const CloseContext = React.createContext<() => void>(() => undefined);

  function Dialog(props: {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
  }): JSX.Element | null {
    const { children, open, onClose } = props;
    if (!open) return null;
    return (
      <CloseContext.Provider value={onClose}>
        <div data-testid="dialog">{children}</div>
      </CloseContext.Provider>
    );
  }
  function DialogBackdrop(): JSX.Element {
    return <div data-testid="dialog-backdrop" />;
  }
  function DialogPanel(props: {
    children: React.ReactNode;
    className?: string;
    id?: string;
    role?: string;
    'aria-labelledby'?: string;
  }): JSX.Element {
    return (
      <div
        data-testid="dialog-panel"
        className={props.className}
        id={props.id}
        role={props.role}
        aria-labelledby={props['aria-labelledby']}
      >
        {props.children}
      </div>
    );
  }
  function DialogTitle(props: {
    children: React.ReactNode;
    className?: string;
    id?: string;
  }): JSX.Element {
    return (
      <h2 data-testid="dialog-title" className={props.className} id={props.id}>
        {props.children}
      </h2>
    );
  }
  function DialogClose(props: { label: string; className?: string }): JSX.Element {
    const onClose = React.useContext(CloseContext);
    return (
      <button aria-label={props.label} className={props.className} onClick={onClose}>
        ✕
      </button>
    );
  }
  return { Dialog, DialogBackdrop, DialogPanel, DialogTitle, DialogClose };
});

// 子コンポーネントのモック
vi.mock('@/components/ui/tabs', () => {
  function Tabs(props: { children: React.ReactNode; className?: string }): JSX.Element {
    return <div className={props.className}>{props.children}</div>;
  }
  function TabsList(props: { children: React.ReactNode }): JSX.Element {
    return <div data-testid="tab-list">{props.children}</div>;
  }
  function TabsTrigger(props: { children: React.ReactNode }): JSX.Element {
    return <button data-testid="tab">{props.children}</button>;
  }
  function TabsContent(props: { children: React.ReactNode }): JSX.Element {
    return <div data-testid="tab-panel">{props.children}</div>;
  }
  return { Tabs, TabsList, TabsTrigger, TabsContent };
});

vi.mock('@/components/organisms/specific/JobPanel', () => ({
  JobPanel: ({ isEditing }: { isEditing: boolean }): JSX.Element => (
    <div data-testid="job-panel">JobPanel (isEditing: {isEditing ? 'true' : 'false'})</div>
  ),
}));

vi.mock('@/components/organisms/specific/charactor/index', () => ({
  CharacterPanel: ({ isEditing }: { isEditing: boolean }): JSX.Element => (
    <div data-testid="character-panel">
      CharacterPanel (isEditing: {isEditing ? 'true' : 'false'})
    </div>
  ),
}));

vi.mock('@/components/organisms/specific/weapon/WeaponPanel', () => ({
  WeaponPanel: ({ isEditing }: { isEditing: boolean }): JSX.Element => (
    <div data-testid="weapon-panel">WeaponPanel (isEditing: {isEditing ? 'true' : 'false'})</div>
  ),
}));

vi.mock('@/components/organisms/specific/summon/SummonPanel', () => ({
  SummonPanel: ({ isEditing }: { isEditing: boolean }): JSX.Element => (
    <div data-testid="summon-panel">SummonPanel (isEditing: {isEditing ? 'true' : 'false'})</div>
  ),
}));

vi.mock('@/components/organisms/specific/skills/SkillTotalPanel', () => ({
  SkillTotalPanel: ({ isEditing }: { isEditing: boolean }): JSX.Element => (
    <div data-testid="skill-total-panel">
      SkillTotalPanel (isEditing: {isEditing ? 'true' : 'false'})
    </div>
  ),
}));

vi.mock('@/core/stores/flowStore');
vi.mock('@/core/stores/editModeStore');

describe('OrganizationModal', () => {
  // テスト用のモックデータ
  const mockFlowData: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2023-01-01',
    note: 'テストノート',
    movie: 'https://example.com/video',
    organization: {
      job: {
        name: 'テストジョブ',
        note: 'テストジョブの説明',
        equipment: { name: 'テスト装備', note: 'テスト装備の説明' },
        abilities: [],
      },
      member: { front: [], back: [] },
      weapon: {
        main: { name: '', note: '', additionalSkill: '' },
        other: [],
        additional: [],
      },
      weaponEffects: { taRate: '', hp: '', defense: '' },
      summon: {
        main: { name: '', note: '' },
        friend: { name: '', note: '' },
        other: [],
        sub: [],
      },
      totalEffects: { taRate: '', hp: '', defense: '' },
    },
    always: '',
    flow: [],
  };

  const mockUpdateFlowData = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // useFlowStoreのモック
    (useFlowStore as unknown as Mock).mockImplementation(
      (selector: (_state: FlowStore) => Partial<FlowStore>) => {
        const state = {
          flowData: mockFlowData,
          updateFlowData: mockUpdateFlowData,
        } as Partial<FlowStore>;
        return selector(state as FlowStore);
      }
    );

    // useEditModeStoreのモック
    (useEditModeStore as unknown as Mock).mockImplementation(
      (selector: (_state: EditModeStore) => Partial<EditModeStore>) => {
        return selector({ isEditMode: false } as EditModeStore);
      }
    );
  });

  it('モーダルが表示されること', () => {
    render(<OrganizationModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-panel')).toBeInTheDocument();
  });

  it('モーダルが閉じられていること', () => {
    render(<OrganizationModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('タブが表示されること', () => {
    render(<OrganizationModal isOpen={true} onClose={mockOnClose} />);

    // タブリストが表示されていることを確認
    expect(screen.getByTestId('tab-list')).toBeInTheDocument();

    // 各タブが表示されていることを確認
    const tabs = screen.getAllByTestId('tab');
    expect(tabs).toHaveLength(5);
    expect(tabs[0]).toHaveTextContent('ジョブ・キャラ');
    expect(tabs[1]).toHaveTextContent('武器');
    expect(tabs[2]).toHaveTextContent('召喚石');
    expect(tabs[3]).toHaveTextContent('動画');
    expect(tabs[4]).toHaveTextContent('スキル合計');
  });

  it('閉じるボタンをクリックするとonClose関数が呼ばれること', () => {
    render(<OrganizationModal isOpen={true} onClose={mockOnClose} />);

    // 閉じるボタンをクリック
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    // onClose関数が呼ばれたことを確認
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('flowDataがnullの場合、nullを返すこと', () => {
    // flowDataをnullに設定
    (useFlowStore as unknown as Mock).mockImplementation(
      (selector: (_state: FlowStore) => Partial<FlowStore>) => {
        const state = { flowData: null, updateFlowData: mockUpdateFlowData } as Partial<FlowStore>;
        return selector(state as FlowStore);
      }
    );

    const { container } = render(<OrganizationModal isOpen={true} onClose={mockOnClose} />);

    // 何も表示されないことを確認
    expect(container.firstChild).toBeNull();
  });
});
