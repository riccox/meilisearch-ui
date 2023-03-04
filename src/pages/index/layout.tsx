import { Header } from '@/src/components/Header';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { ActionIcon, Badge, Button, Modal, Tooltip } from '@mantine/core';
import { useIndexes } from '@/src/hooks/useIndexes';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Index } from 'meilisearch';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { IconAbacus, IconAdjustments, IconAlertTriangle, IconSquarePlus } from '@tabler/icons-react';
import qs from 'qs';

import ReactECharts from 'echarts-for-react'; // Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core'; // Import charts, all with Chart suffix
import { BarChart } from 'echarts/charts'; // import components, all suffixed with Component
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'; // Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers'; // Register the required components
import _ from 'lodash';
// Register the required components
echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

function IndexesLayout() {
  const navigate = useNavigate();
  const client = useMeiliClient();
  const stats = useInstanceStats(client);
  const [indexes, indexesQuery] = useIndexes(client);
  const [searchParams] = useSearchParams();
  const [isFieldDistributionDetailModalOpen, setIsFieldDistributionDetailModalOpen] = useState(false);
  const [fieldDistributionDetailChartIndex, setFieldDistributionDetailChartIndex] = useState<Index>(indexes[0]);

  const onClickIndex = useCallback(
    (index: Index, to: string) => {
      to && navigate(to + `?${qs.stringify({ index: index.uid })}`);
    },
    [navigate]
  );

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
        text: 'Field Distribution',
        subtext: 'Go to official docs about Field Distribution',
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
  }, [fieldDistributionDetailChartIndex, stats?.indexes]);

  const indexList = useMemo(() => {
    if (indexes && indexes.length > 0) {
      return indexes.map((index) => {
        const uid = index.uid;
        const indexStat = stats?.indexes[index.uid];
        return (
          <div
            key={index.uid}
            className={`cursor-pointer p-3 rounded-xl grid grid-cols-4 gap-y-2
           bg-brand-1 hover:bg-opacity-40 bg-opacity-20 
           ${searchParams.get('index') === uid ? 'ring ring-brand-4' : ''}`}
            onClick={() => {
              onClickIndex(index, '/index');
            }}
          >
            <p className={`col-span-4 text-xl font-bold`}>{uid}</p>
            <div className={`col-span-4 flex justify-end gap-x-2 items-center`}>
              <span className={`mr-auto badge outline primary`}>Count: {indexStat?.numberOfDocuments ?? 0}</span>

              <Tooltip label="Field Distribution">
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
              </Tooltip>
              <Tooltip label="Settings">
                <ActionIcon
                  variant="light"
                  color={'brand'}
                  onClick={
                    ((e) => {
                      e.stopPropagation();
                      onClickIndex(index, '/index/settings');
                    }) as MouseEventHandler<HTMLButtonElement>
                  }
                >
                  <IconAdjustments size={24} />
                </ActionIcon>
              </Tooltip>
              {indexStat?.isIndexing && (
                <Tooltip
                  position={'bottom-start'}
                  label="This index is indexing documents, setting & search results may be incorrect now!"
                >
                  <Badge size="lg" variant="filled">
                    <div className={`flex flex-nowrap`}>
                      <IconAlertTriangle />
                      <div>indexing...</div>
                    </div>
                  </Badge>
                </Tooltip>
              )}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className={`flex-1 flex justify-center items-center`}>
          <Button radius={'xl'} size={'xl'} component={Link} to="/index/create">
            Create Index
          </Button>
        </div>
      );
    }
  }, [indexes, onClickFieldDistribution, onClickIndex, searchParams, stats?.indexes]);

  return useMemo(
    () => (
      <div className="bg-mount full-page items-stretch p-5 gap-3">
        <Header client={client} />
        <div className={`flex-1 flex gap-3 overflow-hidden`}>
          <div
            className={`flex-1 bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
          >
            <div className={`flex justify-between items-center`}>
              <div className={`font-extrabold text-3xl`}>🦄 Indexes</div>
              <ActionIcon className={``} variant={'light'} component={Link} to="/index/create">
                <IconSquarePlus size={64} />
              </ActionIcon>
            </div>
            <div
              className={`flex-1
        flex flex-col justify-start items-stretch
        rounded-3xl gap-y-2 overflow-scroll p-1`}
            >
              {indexList}
            </div>
          </div>
          <div className={`flex-[3] bg-background-light rounded-3xl overflow-hidden`}>
            <Outlet context={{ refreshIndexes: () => indexesQuery.refetch() }} />
          </div>
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
    [client, fieldDistributionChartOpt, indexList, indexesQuery, isFieldDistributionDetailModalOpen]
  );
}

export default IndexesLayout;
