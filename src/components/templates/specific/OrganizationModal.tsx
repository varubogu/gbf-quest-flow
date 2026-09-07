import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WeaponPanel } from '../../organisms/specific/weapon/index';
import { SummonPanel } from '../../organisms/specific/SummonPanel';
import { JobPanel } from '../../organisms/specific/JobPanel';
import { CharacterPanel } from '../../organisms/specific/charactor/index';
import { SkillTotalPanel } from '../../organisms/specific/skills/SkillTotalPanel';
import { VideoPanel } from '../../organisms/specific/VideoPanel';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { useTranslation } from 'react-i18next';
import type { FlowStore, EditModeStore } from '@/types/flowStore.types';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('job');
  const flowData = useFlowStore((state: FlowStore) => state.flowData);
  const isEditMode = useEditModeStore((state: EditModeStore) => state.isEditMode);

  if (!flowData) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogBackdrop />
      <DialogPanel
        id="organization-modal"
        role="dialog"
        aria-labelledby="organization-modal-title"
        className="w-full max-w-6xl h-[90dvh] flex flex-col"
      >
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="h-full flex flex-col min-h-0"
        >
          <div className="flex-none p-3 sm:p-4 border-b bg-card pr-12">
            <h2 id="organization-modal-title" className="sr-only">
              {t('organization')}
            </h2>
            <TabsList>
              <TabsTrigger value="job">{t('jobAndCharacters')}</TabsTrigger>
              <TabsTrigger value="weapons">{t('weapons')}</TabsTrigger>
              <TabsTrigger value="summons">{t('summons')}</TabsTrigger>
              <TabsTrigger value="video">{t('video')}</TabsTrigger>
              <TabsTrigger value="skills">{t('skillTotals')}</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 min-h-0">
            <TabsContent value="job">
              <div className="p-3 sm:p-4">
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">{t('jobCharacterTitle')}</h3>
                  <JobPanel isEditing={isEditMode} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">{t('characters')}</h3>
                  <CharacterPanel isEditing={isEditMode} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="weapons">
              <div className="p-3 sm:p-4">
                <WeaponPanel isEditing={isEditMode} />
              </div>
            </TabsContent>
            <TabsContent value="summons">
              <div className="p-3 sm:p-4">
                <SummonPanel isEditing={isEditMode} />
              </div>
            </TabsContent>
            <TabsContent value="video">
              <div className="p-3 sm:p-4">
                <VideoPanel isEditing={isEditMode} />
              </div>
            </TabsContent>
            <TabsContent value="skills">
              <div id="skill-total-tab-panel" className="p-3 sm:p-4">
                <div id="skill-total-panel-content">
                  <SkillTotalPanel isEditing={isEditMode} />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        <DialogClose className="absolute top-2 right-2" label={t('close') as string} />
      </DialogPanel>
    </Dialog>
  );
};
