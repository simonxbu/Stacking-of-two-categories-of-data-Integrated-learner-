"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";
import {
  ChevronDown,
  Filter,
  Gauge,
  Layers3,
  Medal,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import oddsOverview from "@/data/dashboard/odds_overview.json";
import oddsVsBase from "@/data/dashboard/odds_vs_base.json";
import oddsVsStackers from "@/data/dashboard/odds_vs_stackers.json";
import calibration from "@/data/dashboard/calibration.json";
import nestedCv from "@/data/dashboard/nested_cv.json";
import failureCases from "@/data/dashboard/failure_cases.json";
import weightConcentration from "@/data/dashboard/weight_concentration.json";
import chartAssets from "@/data/dashboard/chart_assets.json";

type StrategyType = "all" | "4-rank" | "F1-rank";
type MetricKey = "ROC_AUC" | "PR_AUC" | "F1" | "MCC" | "LogLoss" | "Brier";

type DashboardProps = {
  datasetKey?: string;
};

const DATASET_KEY_MAP: Record<string, string> = {
  personality: "behavior",
  behavior: "behavior",
  adult: "adult",
  cancer: "cancer",
  german: "german",
  ionosphere: "ionosphere",
  pumpkin: "pumpkin",
  water: "water",
};

const DATASET_LABEL_MAP: Record<string, string> = {
  behavior: "Extrovert vs Introvert Behavior",
  adult: "Adult Income",
  cancer: "Breast Cancer",
  german: "German Credit",
  ionosphere: "Ionosphere",
  pumpkin: "Pumpkin Seeds",
  water: "Water Potability",
};

const metricMeta: Record<MetricKey, { label: string; better: "high" | "low" }> = {
  ROC_AUC: { label: "ROC-AUC", better: "high" },
  PR_AUC: { label: "PR-AUC", better: "high" },
  F1: { label: "F1", better: "high" },
  MCC: { label: "MCC", better: "high" },
  LogLoss: { label: "LogLoss", better: "low" },
  Brier: { label: "Brier", better: "low" },
};

function fmt(value: unknown, digits = 3) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

function toDatasetName(datasetKey?: string) {
  return DATASET_KEY_MAP[datasetKey || "behavior"] || "behavior";
}

function compactStrategyLabel(strategy: string) {
  return strategy.replace("stack", " stack");
}

export default function StackingResultsDashboard({ datasetKey = "behavior" }: DashboardProps) {
  const dataset = toDatasetName(datasetKey);
  const [strategyType, setStrategyType] = useState<StrategyType>("all");
  const [selectedF1K, setSelectedF1K] = useState<string>("all");
  const [metric, setMetric] = useState<MetricKey>("ROC_AUC");

  const datasetRows = useMemo(() => {
    return (oddsOverview as any[]).filter((row) => row.Dataset === dataset);
  }, [dataset]);

  const availableF1Ks = useMemo(() => {
    const ks = datasetRows
      .filter((row) => row.Strategy_Type === "F1-rank")
      .map((row) => Number(row.K))
      .filter((v) => Number.isFinite(v));
    return Array.from(new Set(ks)).sort((a, b) => a - b);
  }, [datasetRows]);

  const filteredOverview = useMemo(() => {
    let rows = [...datasetRows];

    if (strategyType !== "all") {
      rows = rows.filter((row) => row.Strategy_Type === strategyType);
    }

    if (strategyType === "F1-rank" && selectedF1K !== "all") {
      rows = rows.filter((row) => String(row.K) === String(selectedF1K));
    }

    return rows.sort((a, b) => Number(a.K ?? 0) - Number(b.K ?? 0));
  }, [datasetRows, strategyType, selectedF1K]);

  const selectedStrategies = useMemo(() => filteredOverview.map((row) => row.Strategy), [filteredOverview]);

  const deltaRows = useMemo(() => {
    return (oddsVsBase as any[])
      .filter((row) => row.Dataset === dataset && selectedStrategies.includes(row.Strategy))
      .map((row) => ({
        strategy: compactStrategyLabel(row.Strategy),
        Delta_ROC_AUC: row.Delta_ROC_AUC,
        Delta_PR_AUC: row.Delta_PR_AUC,
        Delta_F1: row.Delta_F1,
        Delta_MCC: row.Delta_MCC,
        Delta_LogLoss: row.Delta_LogLoss,
        Delta_Brier: row.Delta_Brier,
      }));
  }, [dataset, selectedStrategies]);

  const headToHeadRows = useMemo(() => {
    const rows = (oddsVsStackers as any[]).filter(
      (row) => row.Dataset === dataset && selectedStrategies.includes(row.Strategy)
    );

    const grouped = new Map<string, any>();
    rows.forEach((row) => {
      const key = row.Compared_Model;
      const prev = grouped.get(key) || {
        model: key,
        ROC_AUC: [],
        PR_AUC: [],
        F1: [],
        MCC: [],
        LogLoss: [],
        Brier: [],
      };
      prev.ROC_AUC.push(Number(row.Odds_Better_ROC_AUC));
      prev.PR_AUC.push(Number(row.Odds_Better_PR_AUC));
      prev.F1.push(Number(row.Odds_Better_F1));
      prev.MCC.push(Number(row.Odds_Better_MCC));
      prev.LogLoss.push(Number(row.Odds_Better_LogLoss));
      prev.Brier.push(Number(row.Odds_Better_Brier));
      grouped.set(key, prev);
    });

    return Array.from(grouped.values())
      .map((row) => ({
        model: row.model,
        ROC_AUC: row.ROC_AUC.reduce((a: number, b: number) => a + b, 0) / row.ROC_AUC.length,
        PR_AUC: row.PR_AUC.reduce((a: number, b: number) => a + b, 0) / row.PR_AUC.length,
        F1: row.F1.reduce((a: number, b: number) => a + b, 0) / row.F1.length,
        MCC: row.MCC.reduce((a: number, b: number) => a + b, 0) / row.MCC.length,
        LogLoss: row.LogLoss.reduce((a: number, b: number) => a + b, 0) / row.LogLoss.length,
        Brier: row.Brier.reduce((a: number, b: number) => a + b, 0) / row.Brier.length,
      }))
      .filter((row) => row.model !== "stack_odds");
  }, [dataset, selectedStrategies]);

  const selectedCalibration = useMemo(() => {
    return (calibration as any[]).filter(
      (row) => row.Dataset === dataset && selectedStrategies.includes(row.Strategy)
    );
  }, [dataset, selectedStrategies]);

  const selectedNested = useMemo(() => {
    return (nestedCv as any[]).filter(
      (row) => row.Dataset === dataset && selectedStrategies.includes(row.Strategy)
    );
  }, [dataset, selectedStrategies]);

  const selectedFailure = useMemo(() => {
    return (failureCases as any[]).filter(
      (row) => row.Dataset === dataset && selectedStrategies.includes(row.Strategy)
    );
  }, [dataset, selectedStrategies]);

  const selectedWeights = useMemo(() => {
    return (weightConcentration as any[]).filter(
      (row) => row.Dataset === dataset && selectedStrategies.includes(row.Strategy)
    );
  }, [dataset, selectedStrategies]);

  const bestRow = useMemo(() => {
    if (filteredOverview.length === 0) return null;
    const copy = [...filteredOverview];
    const better = metricMeta[metric].better;
    copy.sort((a, b) => {
      const av = Number(a[metric]);
      const bv = Number(b[metric]);
      return better === "high" ? bv - av : av - bv;
    });
    return copy[0];
  }, [filteredOverview, metric]);

  const radarData = useMemo(() => {
    if (!bestRow) return [];
    return [
      { metric: "ROC_AUC", value: Number(bestRow.ROC_AUC) },
      { metric: "PR_AUC", value: Number(bestRow.PR_AUC) },
      { metric: "F1", value: Number(bestRow.F1) },
      { metric: "MCC", value: Number(bestRow.MCC) },
      { metric: "1-LogLoss", value: Math.max(0, 1 - Number(bestRow.LogLoss)) },
      { metric: "1-Brier", value: Math.max(0, 1 - Number(bestRow.Brier)) },
    ];
  }, [bestRow]);

  const staticPlots = (chartAssets as any).static_plots ?? [];

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
            <Layers3 className="h-5 w-5 text-[#93b5c6]" /> 堆疊模型結果比較儀表板
          </CardTitle>
          <CardDescription className="leading-7 text-slate-600">
            依資料集切換堆疊結果，並支援模型篩選方法切換；若選擇 F1 排序，可再指定進入 stacking 的模型數量 K。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-[#93b5c6] px-3 py-1 text-white hover:bg-[#93b5c6]">
              {DATASET_LABEL_MAP[dataset] || dataset}
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Dataset: {dataset}
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              策略數: {filteredOverview.length}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Filter className="h-4 w-4" /> 模型篩選方法
            </div>
            <Button
              variant={strategyType === "all" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setStrategyType("all");
                setSelectedF1K("all");
              }}
            >
              全部
            </Button>
            <Button
              variant={strategyType === "4-rank" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setStrategyType("4-rank");
                setSelectedF1K("all");
              }}
            >
              4-rank
            </Button>
            <Button
              variant={strategyType === "F1-rank" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setStrategyType("F1-rank")}
            >
              F1-rank
            </Button>

            {strategyType === "F1-rank" && (
              <div className="relative ml-2 inline-flex items-center">
                <select
                  value={selectedF1K}
                  onChange={(e) => setSelectedF1K(e.target.value)}
                  className="appearance-none rounded-full border border-slate-200 bg-white px-4 py-2 pr-10 text-sm text-slate-700 shadow-sm outline-none"
                >
                  <option value="all">全部 K</option>
                  {availableF1Ks.map((k) => (
                    <option key={k} value={String(k)}>
                      Top {k}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(metricMeta) as MetricKey[]).map((key) => (
              <Button
                key={key}
                variant={metric === key ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setMetric(key)}
              >
                {metricMeta[key].label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="最佳策略"
          value={bestRow ? compactStrategyLabel(bestRow.Strategy) : "-"}
          desc={`${metricMeta[metric].label} 最佳`}
          icon={<Medal className="h-4 w-4 text-[#d7816a]" />}
        />
        <KpiCard
          title="最佳數值"
          value={bestRow ? fmt(bestRow[metric]) : "-"}
          desc={metricMeta[metric].label}
          icon={<TrendingUp className="h-4 w-4 text-[#93b5c6]" />}
        />
        <KpiCard
          title="平均 selected rate"
          value={
            selectedNested.length > 0
              ? fmt(selectedNested.reduce((s, r) => s + Number(r.odds_selected_rate || 0), 0) / selectedNested.length)
              : "-"
          }
          desc="Nested CV odds 被選中比例"
          icon={<Gauge className="h-4 w-4 text-[#93b5c6]" />}
        />
        <KpiCard
          title="失效案例數"
          value={String(selectedFailure.filter((row) => Number(row.Odds_Failure_Flag) === 1).length)}
          desc="目前篩選條件下"
          icon={<ShieldAlert className="h-4 w-4 text-[#d7816a]" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>stack_odds 在不同策略下的表現</CardTitle>
            <CardDescription>資料集固定後，可切換排序方法與 F1 Top-K 觀察差異。</CardDescription>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Strategy" tickFormatter={compactStrategyLabel} angle={-20} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: any) => fmt(value)} />
                <Bar dataKey={metric} radius={[10, 10, 0, 0]}>
                  {filteredOverview.map((row, idx) => (
                    <Cell key={`${row.Strategy}-${idx}`} fill={row.Strategy_Type === "4-rank" ? "#93b5c6" : "#d7816a"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>最佳策略六指標輪廓</CardTitle>
            <CardDescription>以當前指標最佳的 odds 策略作為摘要視圖。</CardDescription>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 1]} />
                <Radar dataKey="value" stroke="#93b5c6" fill="#93b5c6" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>相對最佳 Base Model 的變化</CardTitle>
            <CardDescription>正值代表 stack_odds 在該指標上優於最佳 base；LogLoss / Brier 為原始 delta。</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deltaRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" angle={-18} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value: any) => fmt(value)} />
                <Bar dataKey={`Delta_${metric}`} fill="#d7816a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Odds 與其他堆疊法比較</CardTitle>
            <CardDescription>以目前篩選條件下的平均差值表示；正值越大代表 odds 越有利。</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={headToHeadRows} layout="vertical" margin={{ left: 20, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="model" width={110} />
                <Tooltip formatter={(value: any) => fmt(value)} />
                <Bar dataKey={metric} fill="#93b5c6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <MiniTableCard
          title="Calibration"
          description="機率品質與校準"
          rows={selectedCalibration.map((row) => ({
            strategy: compactStrategyLabel(row.Strategy),
            ece: fmt(row.ECE),
            slope: fmt(row.CalibrationSlope),
            intercept: fmt(row.CalibrationIntercept),
          }))}
          columns={[
            { key: "strategy", label: "策略" },
            { key: "ece", label: "ECE" },
            { key: "slope", label: "Slope" },
            { key: "intercept", label: "Intercept" },
          ]}
        />

        <MiniTableCard
          title="Weight Concentration"
          description="odds 權重是否過度集中"
          rows={selectedWeights.map((row) => ({
            strategy: compactStrategyLabel(row.Strategy),
            k: String(row.K),
            top: row.top_feature,
            hhi: fmt(row.weight_hhi),
          }))}
          columns={[
            { key: "strategy", label: "策略" },
            { key: "k", label: "K" },
            { key: "top", label: "Top model" },
            { key: "hhi", label: "HHI" },
          ]}
        />

        <MiniTableCard
          title="Failure Cases"
          description="當前資料集下的風險訊號"
          rows={selectedFailure.map((row) => ({
            strategy: compactStrategyLabel(row.Strategy),
            flag: Number(row.Odds_Failure_Flag) === 1 ? "Yes" : "No",
            logloss: fmt(row.LogLoss),
            mcc: fmt(row.MCC),
          }))}
          columns={[
            { key: "strategy", label: "策略" },
            { key: "flag", label: "Failure" },
            { key: "logloss", label: "LogLoss" },
            { key: "mcc", label: "MCC" },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Nested CV 穩定性</CardTitle>
            <CardDescription>不同策略在 outer folds 中，odds 被選為較佳方案的比例。</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedNested}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Strategy" tickFormatter={compactStrategyLabel} angle={-18} textAnchor="end" height={70} />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={(value: any) => fmt(value)} />
                <Bar dataKey="odds_selected_rate" fill="#d7816a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>可搭配展示的靜態分析圖</CardTitle>
            <CardDescription>若你想保留 Python 預先輸出的圖，也可以在總結頁一起展示。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {staticPlots.slice(0, 4).map((plot: any) => (
              <div key={plot.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <div className="font-medium text-slate-800">{plot.title}</div>
                <div className="mt-1 break-all text-xs text-slate-500">{plot.src}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  desc,
  icon,
}: {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">{title}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-1 text-xs text-slate-500">{desc}</div>
          </div>
          <div className="rounded-2xl bg-[#f5efe4] p-2">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniTableCard({
  title,
  description,
  rows,
  columns,
}: {
  title: string;
  description: string;
  rows: Array<Record<string, string>>;
  columns: Array<{ key: string; label: string }>;
}) {
  return (
    <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                {columns.map((col) => (
                  <th key={col.key} className="px-2 py-2 font-medium">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-2 py-2 text-slate-700">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
