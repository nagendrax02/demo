interface IMetricDetail {
  id: string;
  name: string;
  value: string | number;
}

interface IMetric {
  isLoading: boolean;
  data: IMetricDetail[];
}

export type { IMetricDetail, IMetric };
