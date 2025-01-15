import { Instance, useAppStore } from '@/store';
import { useTranslation } from 'react-i18next';
import { IconFileExport, IconFileImport } from '@tabler/icons-react';

export const ExportImportInstances = () => {

    const { t } = useTranslation('dashboard');
    const instances = useAppStore((state) => state.instances);
    const addInstance = useAppStore((state) => state.addInstance);

    const onClickExportInstances = () => {
        if (instances.length > 0) {
            const jsonString = JSON.stringify(instances, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `export-meilisearch-ui.json`;

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result;
                if (content) {
                    const parsed = JSON.parse(content as string);

                    if (isValidInstanceArray(parsed)) {
                        parsed.forEach(ins => {
                            const _ins = { ...ins, id: 0 };
                            addInstance(ins);
                        });
                    }
                }
            } catch (err: any) {
            }
            finally {
                event.target.value = "";
            }
        };

        reader.readAsText(file);
    }

    const isValidInstanceArray = (data: any): data is Instance[] => {
        if (!Array.isArray(data)) return false;

        return data.every(
            (item) =>
                typeof item.id === "number" &&
                typeof item.name === "string" &&
                typeof item.host === "string" &&
                (item.apiKey === undefined || typeof item.apiKey === "string") &&
                (item.updatedTime === undefined || !isNaN(new Date(item.updatedTime).getTime()))
        );
    }

    return (
        <div className='flex items-center gap-4'>
            <div onClick={onClickExportInstances} className={`flex items-center gap-1 hover:cursor-pointer hover:bg-white text-black border inline-block px-4 py-2 rounded-lg bg-gray-200 ${!(instances.length > 0) ? '!opacity-30 !cursor-no-drop' : ''}`}> <IconFileExport /> <span>{t('export')}</span></div>
            <label htmlFor="import-instances">
                <div className="flex items-center gap-1 hover:cursor-pointer hover:bg-white text-black border inline-block px-4 py-2 rounded-lg bg-gray-200"> <IconFileImport /> <span>{t('import')}</span></div>
            </label>

            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} id="import-instances" />
        </div>
    );
}