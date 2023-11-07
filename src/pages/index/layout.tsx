import { Header } from '@/src/components/Header';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { ActionIcon, Badge, Button, Modal } from '@mantine/core';
import { useIndexes } from '@/src/hooks/useIndexes';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Index } from 'meilisearch';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import {
  IconAbacus,
  IconAdjustments,
  IconAlertTriangle,
  IconFileImport,
  IconSquareRoundedPlusFilled,
} from '@tabler/icons-react';

import ReactECharts from 'echarts-for-react'; // Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core'; // Import charts, all with Chart suffix
import { BarChart } from 'echarts/charts'; // import components, all suffixed with Component
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'; // Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers'; // Register the required components
import _ from 'lodash';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
// Register the required components
echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

export default function IndexesLayout() {
  const { t } = useTranslation('document');
  const currentInstance = useCurrentInstance();
  const navigate = useNavigate();
  const client = useMeiliClient();
  const stats = useInstanceStats(client);
  const [indexes, indexesQuery] = useIndexes(client);
  const [searchParams] = useSearchParams();
  const [isFieldDistributionDetailModalOpen, setIsFieldDistributionDetailModalOpen] = useState(false);
  const [fieldDistributionDetailChartIndex, setFieldDistributionDetailChartIndex] = useState<Index>(indexes[0]);

  const onClickFieldDistribution = useCallback((index: Index) => {
    if (index) {
      setIsFieldDistributionDetailModalOpen(true);
      setFieldDistributionDetailChartIndex(index);
    }
  }, []);

  const fieldDistributionChartOpt = useMemo(() => {
    const source = _.toPairs(stats?.indexes[fieldDistributionDetailChartIndex?.uid]?.fieldDistribution);
    console.debug('fieldDistributionChartOpt', stats?.indexes, fieldDistributionDetailChartIndex?.uid, source);
    const largest = source.sort((a, b) => b[1] - a[1])[0] ?? 0;
    return {
      title: {
        show: true,
        text: t('fieldDistribution.label'),
        subtext: t('fieldDistribution.subtitle'),
        sublink: 'https://docs.meilisearch.com/reference/api/stats.html#stats-object',
      },
      tooltip: {
        show: true,
        type: 'axis',
      },
      dataset: [
        {
          dimensions: ['Field', 'Count'],
          source,
        },
        {
          transform: {
            type: 'sort',
            config: { dimension: 'Count', order: 'asc' },
          },
        },
      ],
      // make label show full width text
      grid: { containLabel: true },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: largest[1] + 100,
        },
        {
          start: 0,
          end: largest[1] + 100,
        },
      ],
      yAxis: {
        type: 'category',
        axisLabel: {
          color: '#909090',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        z: 10,
      },
      xAxis: {
        position: 'top',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999',
        },
      },
      series: [
        {
          type: 'bar',
          datasetIndex: 1,
          showBackground: false,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#ffb1d8' },
              { offset: 0.5, color: '#ff7fbd' },
              { offset: 1, color: '#ffb1d8' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: '#ffb1d8' },
                { offset: 0.7, color: '#ff4da2' },
                { offset: 1, color: '#fe1e87' },
              ]),
            },
          },
        },
      ],
      animationDuration: 0,
      animationDurationUpdate: 700,
      animationEasing: 'quarticInOut',
      animationEasingUpdate: 'quarticInOut',
    };
  }, [fieldDistributionDetailChartIndex, stats?.indexes, t]);

  const indexList = useMemo(() => {
    if (indexes && indexes.length > 0) {
      return indexes.map((index) => {
        const uid = index.uid;
        const indexStat = stats?.indexes[index.uid];
        return (
          <div
            key={index.uid}
            className={clsx(
              `group cursor-pointer p-3 rounded-md grid grid-cols-4 gap-y-2
           bg-brand-1 hover:bg-opacity-40 bg-opacity-20`,
              searchParams.get('index') === uid && 'ring ring-brand-4'
            )}
            onClick={() => {
              navigate(`/instance/${currentInstance.id}/index/${index.uid}`);
            }}
          >
            <div className="flex gap-5">
              <span className={`text-lg font-bold whitespace-nowrap`}>{uid}</span>
              {indexStat?.isIndexing && (
                <span className={'tooltip bw bottom'} data-tooltip={t('indexing_tip')}>
                  <Badge size="md" variant="filled">
                    <div className={`flex gap-2 flex-nowrap`}>
                      <IconAlertTriangle size={16} />
                      <div>{t('indexing')}...</div>
                    </div>
                  </Badge>
                </span>
              )}
            </div>
            <div className={`col-span-4 flex justify-end gap-x-2 items-center`}>
              <span className={`mr-auto badge outline sm primary`}>
                {t('count')}: {indexStat?.numberOfDocuments ?? 0}
              </span>

              {/* Add docs */}
              <span
                data-tooltip={t('add_documents')}
                className="tooltip bw top group-hover:visible invisible"
                tabIndex={0}
              >
                <ActionIcon
                  variant="light"
                  color={'brand'}
                  onClick={
                    ((e) => {
                      e.stopPropagation();
                      navigate(`/instance/${currentInstance.id}/index/${index.uid}/upload`);
                    }) as MouseEventHandler<HTMLButtonElement>
                  }
                >
                  <IconFileImport size={24} />
                </ActionIcon>
              </span>

              <span
                data-tooltip={t('fieldDistribution.label')}
                className="tooltip bw left group-hover:visible invisible"
              >
                <ActionIcon
                  variant="light"
                  color={'brand'}
                  onClick={
                    ((e) => {
                      e.stopPropagation();
                      onClickFieldDistribution(index);
                    }) as MouseEventHandler<HTMLButtonElement>
                  }
                >
                  <IconAbacus size={24} />
                </ActionIcon>
              </span>

              <span data-tooltip={t('settings')} className="tooltip bw left group-hover:visible invisible">
                <ActionIcon
                  variant="light"
                  color={'brand'}
                  onClick={
                    ((e) => {
                      e.stopPropagation();
                      navigate(`/instance/${currentInstance.id}/index/${index.uid}/settings`);
                    }) as MouseEventHandler<HTMLButtonElement>
                  }
                >
                  <IconAdjustments size={24} />
                </ActionIcon>
              </span>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className={`flex-1 flex justify-center items-center`}>
          <Button radius={'sm'} size={'xl'} component={Link} to={`/instance/${currentInstance.id}/index/create`}>
            {t('instance:create_index.label')}
          </Button>
        </div>
      );
    }
  }, [currentInstance.id, indexes, navigate, onClickFieldDistribution, searchParams, t, stats?.indexes]);

  return useMemo(
    () => (
      <div className="bg-mount full-page p-4 gap-2 !grid grid-cols-4 grid-rows-[repeat(10,_minmax(0,_1fr))]">
        <Header className="col-span-full" client={client} />
        <div
          className={`col-span-1 row-[span_9_/_span_9] bg-background-light flex flex-col items-stretch p-6 rounded-md gap-y-2 overflow-hidden`}
        >
          <div className={`flex justify-between items-center flex-wrap gap-2`}>
            <div className={`font-extrabold text-xl`}>🗂️ {t('indexes')}</div>

            <ActionIcon variant={'transparent'} component={Link} to={`/instance/${currentInstance.id}/index/create`}>
              <IconSquareRoundedPlusFilled size={64} />
            </ActionIcon>
          </div>
          <div
            className={clsx('flex-1 p-1 flex flex-col items-stretch gap-y-2 ', 'overflow-x-hidden overflow-y-scroll')}
          >
            {indexList}
          </div>
        </div>
        <div className={`col-span-3 row-[span_9_/_span_9] bg-background-light rounded-md overflow-hidden`}>
          <Outlet context={{ refreshIndexes: () => indexesQuery.refetch() }} />
        </div>
        <Modal
          opened={isFieldDistributionDetailModalOpen}
          onClose={() => setIsFieldDistributionDetailModalOpen(false)}
          centered
          lockScroll
          radius="lg"
          shadow="xl"
          padding="xl"
          withCloseButton={false}
        >
          <ReactECharts className={``} option={fieldDistributionChartOpt} notMerge={true} lazyUpdate={true} />
        </Modal>
      </div>
    ),
    [
      client,
      currentInstance.id,
      fieldDistributionChartOpt,
      indexList,
      indexesQuery,
      t,
      isFieldDistributionDetailModalOpen,
    ]
  );
}
