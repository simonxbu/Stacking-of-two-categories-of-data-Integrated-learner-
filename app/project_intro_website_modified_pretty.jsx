"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import katex from "katex";
import "katex/dist/katex.min.css";
//import DatasetSwitcher from "./DatasetSwitcher";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
//import { processSteps, datasetMeta, Legend_order, allDatasets } from "@/data";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import {
  BookOpen,
  BrainCircuit,
  Database,
  FileBarChart2,
  Home,
  Layers3,
  Route,
  Sigma,
  Target,
  ChevronRight,
  CheckCircle2,
  Workflow,
  FlaskConical,
  Microscope,
  Sparkles,
  ArrowRight,
  Binary,
  BarChart3,
  ExternalLink,
} from "lucide-react";

//頁面連結按鈕(icon是旁邊的小圖案)
const pageItems = [
  { id: "home", label: "首頁", icon: Home },
  { id: "data", label: "數據與流程", icon: Route },
  { id: "method", label: "核心方法論", icon: BrainCircuit },
  { id: "research", label: "研究流程", icon: FileBarChart2 },
  { id: "summary", label: "總結", icon: Target },
  { id: "literature", label: "文獻脈絡", icon: BookOpen },
];

//Extrovert VS. Introvert Behavior
const datasetMeta = {
  personality: {
    key: "personality",
    label: "Extrovert VS. Introvert Behavior",
    subtitle:
      "透過行為特徵與人格相關指標，判斷該人為外向(Extrovert)或內向(Introvert)",
    size: "2,900",
    features: "7",
    classData: [
      { name: "Extrovert", value: 1491, percentage: "51.4%" },
      { name: "Introvert ", value: 1409, percentage: "48.6%" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.938,
        precision: 0.949,
        recall: 0.93,
        f1: 0.939,
      },
      {
        name: "Decision_tree",
        accuracy: 0.928,
        precision: 0.948,
        recall: 0.909,
        f1: 0.928,
      },
      {
        name: "Random_forest",
        accuracy: 0.94,
        precision: 0.952,
        recall: 0.93,
        f1: 0.941,
      },
      {
        name: "SVM",
        accuracy: 0.936,
        precision: 0.952,
        recall: 0.923,
        f1: 0.937,
      },
      {
        name: "Xgboost",
        accuracy: 0.94,
        precision: 0.951,
        recall: 0.93,
        f1: 0.941,
      },
      {
        name: "Lightgbm",
        accuracy: 0.934,
        precision: 0.952,
        recall: 0.919,
        f1: 0.935,
      },
      {
        name: "Catboost",
        accuracy: 0.938,
        precision: 0.952,
        recall: 0.926,
        f1: 0.939,
      },
      {
        name: "MLP",
        accuracy: 0.94,
        precision: 0.955,
        recall: 0.93,
        f1: 0.941,
      },
      {
        name: "KNN",
        accuracy: 0.941,
        precision: 0.954,
        recall: 0.93,
        f1: 0.942,
      },
      {
        name: "Extra_trees",
        accuracy: 0.929,
        precision: 0.952,
        recall: 0.906,
        f1: 0.929,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.94,
        precision: 0.952,
        recall: 0.93,
        f1: 0.941,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.94,
        precision: 0.949,
        recall: 0.93,
        f1: 0.941,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.938,
        precision: 0.949,
        recall: 0.93,
        f1: 0.939,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.938,
        precision: 0.949,
        recall: 0.93,
        f1: 0.939,
      },
      {
        name: "LDA",
        accuracy: 0.938,
        precision: 0.949,
        recall: 0.93,
        f1: 0.939,
      },
      {
        name: "QDA",
        accuracy: 0.94,
        precision: 0.952,
        recall: 0.93,
        f1: 0.941,
      },
    ],
    //進階分析-雷達圖(未改)
    radar: [
      { metric: "Accuracy", base: 82, stack: 89 },
      { metric: "Precision", base: 76, stack: 85 },
      { metric: "Recall", base: 72, stack: 83 },
      { metric: "F1", base: 74, stack: 87 },
      { metric: "Stability", base: 68, stack: 84 },
    ],
    //混淆矩陣(未改)
    confusion: [
      { actual: "Negative", predictedNegative: 7132, predictedPositive: 182 },
      { actual: "Positive", predictedNegative: 336, predictedPositive: 588 },
    ],
    //ROC Curve(未改)
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.03, tpr: 0.39 },
      { fpr: 0.08, tpr: 0.58 },
      { fpr: 0.14, tpr: 0.71 },
      { fpr: 0.22, tpr: 0.81 },
      { fpr: 0.35, tpr: 0.9 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    //Precision-Recall Curve(未改)
    pr: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.18, precision: 0.86 },
      { recall: 0.38, precision: 0.79 },
      { recall: 0.56, precision: 0.73 },
      { recall: 0.71, precision: 0.68 },
      { recall: 0.88, precision: 0.59 },
      { recall: 1.0, precision: 0.47 },
    ],
    //OOF Prediction 視覺化(未改)
    oof: [
      { fold: "Fold 1", base: 0.611, stack: 0.658 },
      { fold: "Fold 2", base: 0.624, stack: 0.671 },
      { fold: "Fold 3", base: 0.602, stack: 0.646 },
      { fold: "Fold 4", base: 0.618, stack: 0.664 },
      { fold: "Fold 5", base: 0.609, stack: 0.653 },
    ],
    //數據與流程-目前資料集下方文字說明(未改)
    note: "類別不平衡明顯，適合觀察 stacking 是否能同時改善 recall 與整體 F1 表現。",
    auc: 0.889,
    ap: 0.741,
  },

  //German Credit
  german: {
    key: "german",
    label: "German Credit",
    subtitle:
      "根據客戶的個人與財務相關資料，判斷其信用風險是良好(Good)還是不良(Bad)",
    size: "1,000",
    features: "20",
    classData: [
      { name: "Good", value: 700, percentage: "70%" },
      { name: "Bad", value: 300, percentage: "30%" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.725,
        precision: 0.81,
        recall: 0.708,
        f1: 0.756,
      },
      {
        name: "Decision_tree",
        accuracy: 0.675,
        precision: 0.765,
        recall: 0.667,
        f1: 0.711,
      },
      {
        name: "Random_forest",
        accuracy: 0.755,
        precision: 0.755,
        recall: 0.875,
        f1: 0.811,
      },
      {
        name: "SVM",
        accuracy: 0.735,
        precision: 0.813,
        recall: 0.725,
        f1: 0.767,
      },
      {
        name: "Xgboost",
        accuracy: 0.735,
        precision: 0.796,
        recall: 0.75,
        f1: 0.773,
      },
      {
        name: "Lightgbm",
        accuracy: 0.765,
        precision: 0.787,
        recall: 0.833,
        f1: 0.81,
      },
      {
        name: "Catboost",
        accuracy: 0.76,
        precision: 0.773,
        recall: 0.85,
        f1: 0.81,
      },
      {
        name: "MLP",
        accuracy: 0.72,
        precision: 0.814,
        recall: 0.692,
        f1: 0.748,
      },
      {
        name: "KNN",
        accuracy: 0.66,
        precision: 0.81,
        recall: 0.567,
        f1: 0.667,
      },
      {
        name: "Extra_trees",
        accuracy: 0.765,
        precision: 0.766,
        recall: 0.875,
        f1: 0.817,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.725,
        precision: 0.798,
        recall: 0.725,
        f1: 0.76,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.7,
        precision: 0.826,
        recall: 0.633,
        f1: 0.717,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.735,
        precision: 0.777,
        recall: 0.783,
        f1: 0.78,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.73,
        precision: 0.789,
        recall: 0.75,
        f1: 0.769,
      },
      {
        name: "LDA",
        accuracy: 0.75,
        precision: 0.802,
        recall: 0.775,
        f1: 0.788,
      },
      {
        name: "QDA",
        accuracy: 0.69,
        precision: 0.759,
        recall: 0.708,
        f1: 0.733,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 77, stack: 84 },
      { metric: "Precision", base: 73, stack: 82 },
      { metric: "Recall", base: 64, stack: 79 },
      { metric: "F1", base: 68, stack: 81 },
      { metric: "Stability", base: 62, stack: 80 },
    ],
    confusion: [
      { actual: "Good", predictedNegative: 126, predictedPositive: 24 },
      { actual: "Bad", predictedNegative: 31, predictedPositive: 69 },
    ],
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.05, tpr: 0.31 },
      { fpr: 0.12, tpr: 0.49 },
      { fpr: 0.21, tpr: 0.65 },
      { fpr: 0.31, tpr: 0.77 },
      { fpr: 0.44, tpr: 0.87 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    pr: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.18, precision: 0.82 },
      { recall: 0.36, precision: 0.77 },
      { recall: 0.55, precision: 0.71 },
      { recall: 0.72, precision: 0.64 },
      { recall: 0.91, precision: 0.52 },
      { recall: 1.0, precision: 0.41 },
    ],
    oof: [
      { fold: "Fold 1", base: 0.641, stack: 0.689 },
      { fold: "Fold 2", base: 0.652, stack: 0.701 },
      { fold: "Fold 3", base: 0.628, stack: 0.676 },
      { fold: "Fold 4", base: 0.636, stack: 0.691 },
      { fold: "Fold 5", base: 0.645, stack: 0.698 },
    ],
    note: "低樣本且含混合欄位，適合展示模型過度擬合風險與整合模型的穩定化效果。",
    auc: 0.842,
    ap: 0.693,
  },

  //Sonar, Mines VS. Rocks
  sonar: {
    key: "sonar",
    label: "Sonar, Mines VS. Rocks",
    subtitle:
      "根據聲納在不同角度與條件下所接收到的反射訊號，判斷目標物是圓柱形岩石(Rock)還是金屬圓柱體(Mine)",
    size: "208",
    features: "60",
    classData: [
      { name: "Rock", value: 111, percentage: "53.4%" },
      { name: "Mine", value: 97, percentage: "46.6%" },
    ],
    //實驗結果-基礎模型訓練表現(未改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.725,
        precision: 0.81,
        recall: 0.708,
        f1: 0.756,
      },
      {
        name: "Decision_tree",
        accuracy: 0.675,
        precision: 0.765,
        recall: 0.667,
        f1: 0.711,
      },
      {
        name: "Random_forest",
        accuracy: 0.755,
        precision: 0.755,
        recall: 0.875,
        f1: 0.811,
      },
      {
        name: "SVM",
        accuracy: 0.735,
        precision: 0.813,
        recall: 0.725,
        f1: 0.767,
      },
      {
        name: "Xgboost",
        accuracy: 0.735,
        precision: 0.796,
        recall: 0.75,
        f1: 0.773,
      },
      {
        name: "Lightgbm",
        accuracy: 0.765,
        precision: 0.787,
        recall: 0.833,
        f1: 0.81,
      },
      {
        name: "Catboost",
        accuracy: 0.76,
        precision: 0.773,
        recall: 0.85,
        f1: 0.81,
      },
      {
        name: "MLP",
        accuracy: 0.72,
        precision: 0.814,
        recall: 0.692,
        f1: 0.748,
      },
      {
        name: "KNN",
        accuracy: 0.66,
        precision: 0.81,
        recall: 0.567,
        f1: 0.667,
      },
      {
        name: "Extra_trees",
        accuracy: 0.765,
        precision: 0.766,
        recall: 0.875,
        f1: 0.817,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.725,
        precision: 0.798,
        recall: 0.725,
        f1: 0.76,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.7,
        precision: 0.826,
        recall: 0.633,
        f1: 0.717,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.735,
        precision: 0.777,
        recall: 0.783,
        f1: 0.78,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.73,
        precision: 0.789,
        recall: 0.75,
        f1: 0.769,
      },
      {
        name: "LDA",
        accuracy: 0.75,
        precision: 0.802,
        recall: 0.775,
        f1: 0.788,
      },
      {
        name: "QDA",
        accuracy: 0.69,
        precision: 0.759,
        recall: 0.708,
        f1: 0.733,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "Stability", base: 70, stack: 82 },
    ],
    confusion: [
      { actual: "Rock", predictedNegative: 22, predictedPositive: 5 },
      { actual: "Mine", predictedNegative: 4, predictedPositive: 21 },
    ],
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.04, tpr: 0.48 },
      { fpr: 0.08, tpr: 0.66 },
      { fpr: 0.13, tpr: 0.79 },
      { fpr: 0.19, tpr: 0.88 },
      { fpr: 0.28, tpr: 0.94 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    pr: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.19, precision: 0.92 },
      { recall: 0.38, precision: 0.89 },
      { recall: 0.58, precision: 0.86 },
      { recall: 0.76, precision: 0.81 },
      { recall: 0.91, precision: 0.74 },
      { recall: 1.0, precision: 0.66 },
    ],
    oof: [
      { fold: "Fold 1", base: 0.812, stack: 0.862 },
      { fold: "Fold 2", base: 0.825, stack: 0.871 },
      { fold: "Fold 3", base: 0.803, stack: 0.854 },
      { fold: "Fold 4", base: 0.817, stack: 0.866 },
      { fold: "Fold 5", base: 0.809, stack: 0.858 },
    ],
    note: "高維低樣本設定對泛化能力要求更高，很適合展示 stacking 在小型資料集下的價值。",
    auc: 0.903,
    ap: 0.861,
  },

  //Breast Cancer Wisconsin Dataset
  cancer: {
    key: "cancer",
    label: "Breast Cancer Wisconsin Dataset",
    subtitle:
      "透過腫瘤細胞的檢查特徵，判斷腫瘤是良性(Benign)還是惡性(Malignant)",
    size: "569",
    features: "30",
    classData: [
      { name: "Benign", value: 357, percentage: "62.7%" },
      { name: "Mailgnant", value: 212, percentage: "37.3%" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.956,
        precision: 0.937,
        recall: 1.0,
        f1: 0.967,
      },
      {
        name: "Decision_tree",
        accuracy: 0.921,
        precision: 0.901,
        recall: 0.986,
        f1: 0.942,
      },
      {
        name: "Random_forest",
        accuracy: 0.939,
        precision: 0.972,
        recall: 0.932,
        f1: 0.952,
      },
      {
        name: "SVM",
        accuracy: 0.956,
        precision: 0.937,
        recall: 1.0,
        f1: 0.967,
      },
      {
        name: "Xgboost",
        accuracy: 0.956,
        precision: 0.973,
        recall: 0.959,
        f1: 0.966,
      },
      {
        name: "Lightgbm",
        accuracy: 0.956,
        precision: 0.973,
        recall: 0.959,
        f1: 0.966,
      },
      {
        name: "Catboost",
        accuracy: 0.956,
        precision: 0.948,
        recall: 0.986,
        f1: 0.967,
      },
      {
        name: "MLP",
        accuracy: 0.956,
        precision: 0.937,
        recall: 1.0,
        f1: 0.967,
      },
      {
        name: "KNN",
        accuracy: 0.921,
        precision: 0.892,
        recall: 1.0,
        f1: 0.943,
      },
      {
        name: "Extra_trees",
        accuracy: 0.947,
        precision: 0.972,
        recall: 0.946,
        f1: 0.959,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.965,
        precision: 0.949,
        recall: 1.0,
        f1: 0.974,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.965,
        precision: 0.949,
        recall: 1.0,
        f1: 0.974,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.904,
        precision: 0.932,
        recall: 0.919,
        f1: 0.925,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.912,
        precision: 0.957,
        recall: 0.905,
        f1: 0.931,
      },
      {
        name: "LDA",
        accuracy: 0.939,
        precision: 0.986,
        recall: 0.919,
        f1: 0.951,
      },
      {
        name: "QDA",
        accuracy: 0.939,
        precision: 0.935,
        recall: 0.973,
        f1: 0.954,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "Stability", base: 70, stack: 82 },
    ],
    confusion: [
      { actual: "Rock", predictedNegative: 22, predictedPositive: 5 },
      { actual: "Mine", predictedNegative: 4, predictedPositive: 21 },
    ],
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.04, tpr: 0.48 },
      { fpr: 0.08, tpr: 0.66 },
      { fpr: 0.13, tpr: 0.79 },
      { fpr: 0.19, tpr: 0.88 },
      { fpr: 0.28, tpr: 0.94 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    pr: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.19, precision: 0.92 },
      { recall: 0.38, precision: 0.89 },
      { recall: 0.58, precision: 0.86 },
      { recall: 0.76, precision: 0.81 },
      { recall: 0.91, precision: 0.74 },
      { recall: 1.0, precision: 0.66 },
    ],
    oof: [
      { fold: "Fold 1", base: 0.812, stack: 0.862 },
      { fold: "Fold 2", base: 0.825, stack: 0.871 },
      { fold: "Fold 3", base: 0.803, stack: 0.854 },
      { fold: "Fold 4", base: 0.817, stack: 0.866 },
      { fold: "Fold 5", base: 0.809, stack: 0.858 },
    ],
    note: "高維低樣本設定對泛化能力要求更高，很適合展示 stacking 在小型資料集下的價值。",
    auc: 0.903,
    ap: 0.861,
  },

  //Ionosphere
  I: {
    key: "I",
    label: "Ionosphere",
    subtitle:
      "透過雷達回波訊號特徵，判斷電離層回波的品質。Good表示回波顯示電離層中自由電子結構，而Bad表示回波無結構、訊號直接穿過電離層",
    size: "351",
    features: "34",
    classData: [
      { name: "Good", value: 225, percentage: "64.1%" },
      { name: "Bad", value: 126, percentage: "35.9%" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.859,
        precision: 0.86,
        recall: 0.935,
        f1: 0.896,
      },
      {
        name: "Decision_tree",
        accuracy: 0.817,
        precision: 0.824,
        recall: 0.913,
        f1: 0.866,
      },
      {
        name: "Random_forest",
        accuracy: 0.901,
        precision: 0.868,
        recall: 1.0,
        f1: 0.929,
      },
      {
        name: "SVM",
        accuracy: 0.972,
        precision: 0.978,
        recall: 0.978,
        f1: 0.978,
      },
      {
        name: "Xgboost",
        accuracy: 0.93,
        precision: 0.902,
        recall: 1.0,
        f1: 0.948,
      },
      {
        name: "Lightgbm",
        accuracy: 0.648,
        precision: 0.648,
        recall: 1.0,
        f1: 0.786,
      },
      {
        name: "Catboost",
        accuracy: 0.93,
        precision: 0.902,
        recall: 1.0,
        f1: 0.948,
      },
      {
        name: "MLP",
        accuracy: 0.901,
        precision: 0.868,
        recall: 1.0,
        f1: 0.929,
      },
      {
        name: "KNN",
        accuracy: 0.93,
        precision: 0.918,
        recall: 0.978,
        f1: 0.947,
      },
      {
        name: "Extra_trees",
        accuracy: 0.887,
        precision: 0.952,
        recall: 0.87,
        f1: 0.909,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.901,
        precision: 0.868,
        recall: 1.0,
        f1: 0.929,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.836,
        precision: 0.836,
        recall: 1.0,
        f1: 0.911,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.901,
        precision: 0.898,
        recall: 0.957,
        f1: 0.926,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.69,
        precision: 0.816,
        recall: 0.674,
        f1: 0.738,
      },
      {
        name: "LDA",
        accuracy: 0.845,
        precision: 0.807,
        recall: 1.0,
        f1: 0.893,
      },
      { name: "QDA", accuracy: 0.944, precision: 0.92, recall: 1.0, f1: 0.958 },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "Stability", base: 70, stack: 82 },
    ],
    confusion: [
      { actual: "Rock", predictedNegative: 22, predictedPositive: 5 },
      { actual: "Mine", predictedNegative: 4, predictedPositive: 21 },
    ],
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.04, tpr: 0.48 },
      { fpr: 0.08, tpr: 0.66 },
      { fpr: 0.13, tpr: 0.79 },
      { fpr: 0.19, tpr: 0.88 },
      { fpr: 0.28, tpr: 0.94 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    pr: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.19, precision: 0.92 },
      { recall: 0.38, precision: 0.89 },
      { recall: 0.58, precision: 0.86 },
      { recall: 0.76, precision: 0.81 },
      { recall: 0.91, precision: 0.74 },
      { recall: 1.0, precision: 0.66 },
    ],
    oof: [
      { fold: "Fold 1", base: 0.812, stack: 0.862 },
      { fold: "Fold 2", base: 0.825, stack: 0.871 },
      { fold: "Fold 3", base: 0.803, stack: 0.854 },
      { fold: "Fold 4", base: 0.817, stack: 0.866 },
      { fold: "Fold 5", base: 0.809, stack: 0.858 },
    ],
    note: "高維低樣本設定對泛化能力要求更高，很適合展示 stacking 在小型資料集下的價值。",
    auc: 0.903,
    ap: 0.861,
  },

  //Adult Income Dataset
  Income: {
    key: "Income",
    label: "Adult Income Dataset",
    subtitle:
      "根據個人的人口統計與職業特徵，判斷其年收入是否超過 50,000 美元/年",
    size: "48,842",
    features: "14",
    classData: [
      { name: "> 50K", value: 37155, percentage: "76.1%" },
      { name: "≤ 50K", value: 11687, percentage: "23.9%" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.841,
        precision: 0.654,
        recall: 0.71,
        f1: 0.681,
      },
      {
        name: "Decision_tree",
        accuracy: 0.746,
        precision: 0.481,
        recall: 0.796,
        f1: 0.6,
      },
      {
        name: "Random_forest",
        accuracy: 0.858,
        precision: 0.718,
        recall: 0.668,
        f1: 0.692,
      },
      {
        name: "SVM",
        accuracy: 0.706,
        precision: 0.344,
        recall: 0.25,
        f1: 0.29,
      },
      {
        name: "Xgboost",
        accuracy: 0.873,
        precision: 0.751,
        recall: 0.702,
        f1: 0.726,
      },
      {
        name: "Lightgbm",
        accuracy: 0.871,
        precision: 0.756,
        recall: 0.683,
        f1: 0.718,
      },
      {
        name: "Catboost",
        accuracy: 0.872,
        precision: 0.771,
        recall: 0.661,
        f1: 0.712,
      },
      {
        name: "MLP",
        accuracy: 0.857,
        precision: 0.697,
        recall: 0.715,
        f1: 0.706,
      },
      {
        name: "KNN",
        accuracy: 0.839,
        precision: 0.656,
        recall: 0.687,
        f1: 0.671,
      },
      {
        name: "Extra_trees",
        accuracy: 0.838,
        precision: 0.635,
        recall: 0.756,
        f1: 0.69,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.87,
        precision: 0.764,
        recall: 0.662,
        f1: 0.709,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.872,
        precision: 0.791,
        recall: 0.633,
        f1: 0.703,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.666,
        precision: 0.411,
        recall: 0.91,
        f1: 0.566,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.823,
        precision: 0.625,
        recall: 0.651,
        f1: 0.637,
      },
      {
        name: "LDA",
        accuracy: 0.821,
        precision: 0.601,
        recall: 0.749,
        f1: 0.666,
      },
      {
        name: "QDA",
        accuracy: 0.799,
        precision: 0.56,
        recall: 0.75,
        f1: 0.641,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "Stability", base: 70, stack: 82 },
    ],
    confusion: [
      { actual: "Rock", predictedNegative: 22, predictedPositive: 5 },
      { actual: "Mine", predictedNegative: 4, predictedPositive: 21 },
    ],
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.04, tpr: 0.48 },
      { fpr: 0.08, tpr: 0.66 },
      { fpr: 0.13, tpr: 0.79 },
      { fpr: 0.19, tpr: 0.88 },
      { fpr: 0.28, tpr: 0.94 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    pr: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.19, precision: 0.92 },
      { recall: 0.38, precision: 0.89 },
      { recall: 0.58, precision: 0.86 },
      { recall: 0.76, precision: 0.81 },
      { recall: 0.91, precision: 0.74 },
      { recall: 1.0, precision: 0.66 },
    ],
    oof: [
      { fold: "Fold 1", base: 0.812, stack: 0.862 },
      { fold: "Fold 2", base: 0.825, stack: 0.871 },
      { fold: "Fold 3", base: 0.803, stack: 0.854 },
      { fold: "Fold 4", base: 0.817, stack: 0.866 },
      { fold: "Fold 5", base: 0.809, stack: 0.858 },
    ],
    note: "高維低樣本設定對泛化能力要求更高，很適合展示 stacking 在小型資料集下的價值。",
    auc: 0.903,
    ap: 0.861,
  },

  //Water Quality
  water: {
    key: "water",
    label: "Water Quality",
    subtitle:
      "透過水的物理化學特徵，判斷水是否可飲用(Potable)或不可飲用(Not potable)",
    size: "3,276",
    features: "10",
    classData: [
      { name: "Potable", value: 1278, percentage: "39%" },
      { name: "Not potable", value: 1998, percentage: "61%" },
    ],
    //實驗結果-基礎模型訓練表現(未改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.841,
        precision: 0.654,
        recall: 0.71,
        f1: 0.681,
      },
      {
        name: "Decision_tree",
        accuracy: 0.746,
        precision: 0.481,
        recall: 0.796,
        f1: 0.6,
      },
      {
        name: "Random_forest",
        accuracy: 0.858,
        precision: 0.718,
        recall: 0.668,
        f1: 0.692,
      },
      {
        name: "SVM",
        accuracy: 0.706,
        precision: 0.344,
        recall: 0.25,
        f1: 0.29,
      },
      {
        name: "Xgboost",
        accuracy: 0.873,
        precision: 0.751,
        recall: 0.702,
        f1: 0.726,
      },
      {
        name: "Lightgbm",
        accuracy: 0.871,
        precision: 0.756,
        recall: 0.683,
        f1: 0.718,
      },
      {
        name: "Catboost",
        accuracy: 0.872,
        precision: 0.771,
        recall: 0.661,
        f1: 0.712,
      },
      {
        name: "MLP",
        accuracy: 0.857,
        precision: 0.697,
        recall: 0.715,
        f1: 0.706,
      },
      {
        name: "KNN",
        accuracy: 0.839,
        precision: 0.656,
        recall: 0.687,
        f1: 0.671,
      },
      {
        name: "Extra_trees",
        accuracy: 0.838,
        precision: 0.635,
        recall: 0.756,
        f1: 0.69,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.87,
        precision: 0.764,
        recall: 0.662,
        f1: 0.709,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.872,
        precision: 0.791,
        recall: 0.633,
        f1: 0.703,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.666,
        precision: 0.411,
        recall: 0.91,
        f1: 0.566,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.823,
        precision: 0.625,
        recall: 0.651,
        f1: 0.637,
      },
      {
        name: "LDA",
        accuracy: 0.821,
        precision: 0.601,
        recall: 0.749,
        f1: 0.666,
      },
      {
        name: "QDA",
        accuracy: 0.799,
        precision: 0.56,
        recall: 0.75,
        f1: 0.641,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "Stability", base: 70, stack: 82 },
    ],
    confusion: [
      { actual: "Rock", predictedNegative: 22, predictedPositive: 5 },
      { actual: "Mine", predictedNegative: 4, predictedPositive: 21 },
    ],
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.04, tpr: 0.48 },
      { fpr: 0.08, tpr: 0.66 },
      { fpr: 0.13, tpr: 0.79 },
      { fpr: 0.19, tpr: 0.88 },
      { fpr: 0.28, tpr: 0.94 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    pr: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.19, precision: 0.92 },
      { recall: 0.38, precision: 0.89 },
      { recall: 0.58, precision: 0.86 },
      { recall: 0.76, precision: 0.81 },
      { recall: 0.91, precision: 0.74 },
      { recall: 1.0, precision: 0.66 },
    ],
    oof: [
      { fold: "Fold 1", base: 0.812, stack: 0.862 },
      { fold: "Fold 2", base: 0.825, stack: 0.871 },
      { fold: "Fold 3", base: 0.803, stack: 0.854 },
      { fold: "Fold 4", base: 0.817, stack: 0.866 },
      { fold: "Fold 5", base: 0.809, stack: 0.858 },
    ],
    note: "高維低樣本設定對泛化能力要求更高，很適合展示 stacking 在小型資料集下的價值。",
    auc: 0.903,
    ap: 0.861,
  },

  //Pumpkin Seeds Dataset
  pumpkin: {
    key: "pumpkin",
    label: "Pumpkin Seeds Dataset",
    subtitle:
      "根據南瓜子的型態與物理特徵，判斷南瓜子品種為Çerçevelik或Ürgüp Sivrisi",
    size: "2,500",
    features: "12",
    classData: [
      { name: "Çerçevelik", value: 1300, percentage: "52%" },
      { name: "Ürgüp Sivrisi", value: 1200, percentage: "48%" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.87,
        precision: 0.908,
        recall: 0.814,
        f1: 0.858,
      },
      {
        name: "Decision_tree",
        accuracy: 0.866,
        precision: 0.869,
        recall: 0.851,
        f1: 0.86,
      },
      {
        name: "Random_forest",
        accuracy: 0.888,
        precision: 0.904,
        recall: 0.86,
        f1: 0.881,
      },
      {
        name: "SVM",
        accuracy: 0.434,
        precision: 0.432,
        recall: 0.537,
        f1: 0.479,
      },
      {
        name: "Xgboost",
        accuracy: 0.88,
        precision: 0.892,
        recall: 0.855,
        f1: 0.873,
      },
      {
        name: "Lightgbm",
        accuracy: 0.876,
        precision: 0.875,
        recall: 0.868,
        f1: 0.871,
      },
      {
        name: "Catboost",
        accuracy: 0.882,
        precision: 0.907,
        recall: 0.843,
        f1: 0.874,
      },
      {
        name: "MLP",
        accuracy: 0.8,
        precision: 0.882,
        recall: 0.678,
        f1: 0.766,
      },
      {
        name: "KNN",
        accuracy: 0.604,
        precision: 0.716,
        recall: 0.302,
        f1: 0.424,
      },
      {
        name: "Extra_trees",
        accuracy: 0.87,
        precision: 0.858,
        recall: 0.876,
        f1: 0.867,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.878,
        precision: 0.885,
        recall: 0.86,
        f1: 0.872,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.874,
        precision: 0.891,
        recall: 0.843,
        f1: 0.866,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.792,
        precision: 0.797,
        recall: 0.764,
        f1: 0.781,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.85,
        precision: 0.861,
        recall: 0.822,
        f1: 0.841,
      },
      {
        name: "LDA",
        accuracy: 0.87,
        precision: 0.886,
        recall: 0.839,
        f1: 0.862,
      },
      {
        name: "QDA",
        accuracy: 0.856,
        precision: 0.894,
        recall: 0.798,
        f1: 0.843,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "Stability", base: 70, stack: 82 },
    ],
    confusion: [
      { actual: "Rock", predictedNegative: 22, predictedPositive: 5 },
      { actual: "Mine", predictedNegative: 4, predictedPositive: 21 },
    ],
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.04, tpr: 0.48 },
      { fpr: 0.08, tpr: 0.66 },
      { fpr: 0.13, tpr: 0.79 },
      { fpr: 0.19, tpr: 0.88 },
      { fpr: 0.28, tpr: 0.94 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    pr: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.19, precision: 0.92 },
      { recall: 0.38, precision: 0.89 },
      { recall: 0.58, precision: 0.86 },
      { recall: 0.76, precision: 0.81 },
      { recall: 0.91, precision: 0.74 },
      { recall: 1.0, precision: 0.66 },
    ],
    oof: [
      { fold: "Fold 1", base: 0.812, stack: 0.862 },
      { fold: "Fold 2", base: 0.825, stack: 0.871 },
      { fold: "Fold 3", base: 0.803, stack: 0.854 },
      { fold: "Fold 4", base: 0.817, stack: 0.866 },
      { fold: "Fold 5", base: 0.809, stack: 0.858 },
    ],
    note: "高維低樣本設定對泛化能力要求更高，很適合展示 stacking 在小型資料集下的價值。",
    auc: 0.903,
    ap: 0.861,
  },
};

//資料集下方的欄位(目前想改成資料集介紹)
const allDatasets = [
  "Adult Income Dataset",
  "Bank Marketing Dataset",
  "Extrovert vs. Introvert Behavior Data",
  "Banknote Authentication Dataset",
  "German Credit Dataset",
  "Breast Cancer Wisconsin Dataset",
  "Ionosphere Dataset",
  "Sonar Dataset",
];

//核心方法論-基礎模型池
const baseModels = [
  "Logistic Regression",
  "Decision Tree",
  "Random Forest",
  "SVM",
  "XGBoost",
  "LightGBM",
  "CatBoost",
  "MLP",
  "KNN",
  "Extra Trees",
  "Gradient Boosting",
  "HistGradientBoosting",
  "Gaussian NB",
  "Bernoulli NB",
  "LDA",
  "QDA",
];

//核心方法論-所有方法(Stacking)概述
const stackingMethods = [
  {
    title: "Logistic Regression Stacking",
    desc: "將各基礎模型的預測機率組成次層特徵矩陣，再用 LR 學習整合權重。",
  },
  {
    title: "XGBoost Stacking",
    desc: "利用 boosting 建模非線性組合關係，適合處理複雜模型互補性。",
  },
  {
    title: "CatBoost Stacking",
    desc: "透過 ordered boosting 降低過度擬合風險，對中小型資料表現穩定。",
  },
  {
    title: "Voting / Odds / Inverse Variance",
    desc: "從機率層級直接整合，兼具可解釋性與實作彈性。",
  },
];

//數據與流程-訓練流程圖
const processSteps = [
  {
    id: "dataset",
    short: "資料蒐集",
    title: "二分類多元資料集建立",
    desc: "蒐集不同領域的公開資料集，確保研究比較涵蓋多種資料條件與情境。",
    panelTitle: "資料蒐集程序",
    panelDesc: "透過公開平台蒐集不同領域資料集，建立多資料情境研究基礎。",
    panelText:
      "本研究主要透過 Kaggle 與 UCI Machine Learning Repository 蒐集公開資料集，涵蓋人格特質、醫療診斷、金融行為與訊號辨識等不同情境，以提升研究比較的多樣性與代表性。",
    links: [
      {
        name: "Extrovert vs. Introvert Behavior",
        source: "Kaggle",
        link: "https://www.kaggle.com/datasets/rakeshkapilavai/extrovert-vs-introvert-behavior-data",
      },
      {
        name: "German Credit",
        source: "UCI",
        link: "https://www.archive.ics.uci.edu/dataset/2/adult",
      },
      {
        name: "Sonar, Mines VS. Rocks",
        source: "UCI",
        link: "https://archive.ics.uci.edu/dataset/151/connectionist+bench+sonar+mines+vs+rocks",
      },
      {
        name: "Breast Cancer Wisconsin",
        source: "Kaggle",
        link: "https://www.kaggle.com/datasets/uciml/breast-cancer-wisconsin-data",
      },
      {
        name: "Ionosphere",
        source: "UCI",
        link: "https://archive.ics.uci.edu/dataset/52/ionosphere",
      },
      {
        name: "Adult Income Dataset",
        source: "UCI",
        link: "https://www.archive.ics.uci.edu/dataset/2/adult",
      },
      {
        name: "Water Quality",
        source: "Kaggle",
        link: "https://www.kaggle.com/datasets/adityakadiwal/water-potability",
      },
      {
        name: "Pumpkin Seeds Dataset",
        source: "Kaggle",
        link: "https://www.kaggle.com/datasets/muratkokludataset/pumpkin-seeds-dataset",
      },
    ],
  },
  {
    id: "preprocessing",
    short: "前處理",
    title: "資料清理與特徵轉換",
    desc: "進行缺失值檢查、編碼、標準化與必要的分布修正，建立一致的訓練輸入。",
    panelTitle: "資料前處理程序",
    panelDesc: "依資料特性彈性套用處理步驟",
    panelItems: [
      "遺失值檢查與處理",
      "欄位名稱與格式轉換",
      "目標變數 0/1 編碼",
      "類別變數獨熱編碼",
      "數值變數標準化",
      "偏態檢定與 Box-Cox / Yeo-Johnson",
      "部分資料集進行 PCA 降維",
      "切割訓練集與測試集(8：2)",
    ],
  },
  {
    id: "training",
    short: "訓練",
    title: "基礎模型個別訓練與評估",
    desc: "以多種機器學習分類器獨立訓練，取得指標、機率輸出與誤差表現。",
    panelTitle: "模型訓練與評估程序",
    panelDesc:
      "以一致流程訓練具多元特性的基礎分類模型，觀察其在不同資料集上的表現差異與穩定性，作為後續整合依據。",
    modelGroups: [
      {
        category: "線性模型",
        models: ["Logistic Regression"],
      },
      {
        category: "樹狀與集成模型",
        models: ["Decision Tree", "Random Forest", "Extra Trees"],
      },
      {
        category: "Boosting 模型",
        models: [
          "Gradient Boosting",
          "HistGradientBoosting",
          "XGBoost",
          "LightGBM",
          "CatBoost",
        ],
      },
      {
        category: "距離與鄰近模型",
        models: ["KNN"],
      },
      {
        category: "核方法與神經網路",
        models: ["SVM", "MLP"],
      },
      {
        category: "機率式分類模型",
        models: ["Gaussian NB", "Bernoulli NB"],
      },
      {
        category: "判別分析模型",
        models: ["LDA", "QDA"],
      },
    ],
  },
  {
    id: "filtering",
    short: "篩選",
    title: "模型排序與篩選策略",
    desc: "依 F1 或 Accuracy 排序，排除陡降區段模型，降低弱模型干擾。",
    panelTitle: "模型排序與篩選程序",
    panelDesc:
      "透過模型排序曲線辨識效能陡降區段，刪除表現明顯落後的弱模型，保留較具穩定性與代表性的候選模型。",
    image: "/陡坡圖.png",
    imageAlt: "模型排序與陡降區段示意圖",
  },
  {
    id: "integration",
    short: "整合",
    title: "Stacking 與加權融合",
    desc: "將基礎模型輸出作為 meta 特徵或機率加權來源，建立最終整合模型。",
    panelTitle: "模型整合程序",
    panelDesc: "透過多模型融合提升最終分類表現",
    methods: [
      "Logistic Regression Stacking",
      "XGBoost Stacking",
      "CatBoost Stacking",
      "Voting（投票法）",
      "Odds Weighting（勝算加權）",
      "Inverse Variance Weighting（逆變異加權）",
    ],
  },
  {
    id: "analysis",
    short: "分析",
    title: "結果詮釋與比較分析",
    desc: "從單一模型、整合模型與跨資料集層面觀察研究發現與應用價值。",
    panelTitle: "結果分析與研究詮釋",
    panelDesc: "從模型表現與跨資料集差異整理研究發現",
  },
];

const baseTrainingSteps = [
  {
    id: "base-split",
    short: "切分",
    title: "資料切分與前處理管線建立",
    desc: "將資料切分為訓練集與測試集，並依資料型態建立對應前處理流程。",
    panelTitle: "基礎模型訓練：資料切分與前處理",
    panelDesc: "先建立一致的輸入條件，再進行模型訓練。",
    panelItems: [
      "切割訓練集與測試集（8:2）",
      "數值欄位標準化與分布修正",
      "類別欄位編碼與格式轉換",
      "必要時進行 PCA 或特徵轉換",
    ],
  },
  {
    id: "base-train",
    short: "建模",
    title: "多個基礎模型獨立訓練",
    desc: "對 16 種基礎分類器分別訓練，保留預測結果與機率輸出。",
    panelTitle: "基礎模型訓練：多模型並行建模",
    panelDesc: "建立具有多樣性的基礎模型池。",
    modelGroups: [
      {
        category: "線性 / 判別",
        models: ["Logistic Regression", "LDA", "QDA"],
      },
      {
        category: "樹與集成",
        models: ["Decision Tree", "Random Forest", "Extra Trees"],
      },
      {
        category: "Boosting",
        models: [
          "Gradient Boosting",
          "HistGradientBoosting",
          "XGBoost",
          "LightGBM",
          "CatBoost",
        ],
      },
      {
        category: "其他",
        models: ["SVM", "MLP", "KNN", "Gaussian NB", "Bernoulli NB"],
      },
    ],
  },
  {
    id: "base-eval",
    short: "評估",
    title: "基礎模型結果彙整與排序",
    desc: "使用 Accuracy、Precision、Recall 與 F1 比較模型表現，作為後續篩選依據。",
    panelTitle: "基礎模型訓練：評估與排序",
    panelDesc: "先看單模表現，再決定哪些模型進入下一階段。",
    panelItems: [
      "統計 Accuracy / Precision / Recall / F1",
      "比較模型在不同資料集上的差異",
      "觀察弱模型與穩定模型的分界",
      "作為 stacking 候選模型輸入",
    ],
  },
];

const stackingFlowSteps = [
  {
    id: "stack-select",
    short: "篩選",
    title: "候選基礎模型篩選",
    desc: "依排序結果排除明顯落後模型，降低弱模型干擾。",
    panelTitle: "堆疊流程：候選模型篩選",
    panelDesc: "只保留較具代表性與穩定性的模型進入整合。",
    panelItems: [
      "依 F1 或 Accuracy 排序",
      "觀察陡降區段並排除弱模型",
      "保留具互補性的候選模型",
    ],
  },
  {
    id: "stack-oof",
    short: "生成",
    title: "建立 OOF 次層特徵",
    desc: "以交叉驗證取得 base models 的 OOF prediction，形成 meta features。",
    panelTitle: "堆疊流程：建立次層輸入",
    panelDesc: "避免資料洩漏，讓次層學習器看到更可靠的輸入。",
    panelItems: [
      "以 K-fold 取得每個 base model 的 OOF prediction",
      "將各模型機率輸出組成次層特徵矩陣",
      "同步保留測試集預測供最終整合使用",
    ],
  },
  {
    id: "stack-meta",
    short: "整合",
    title: "訓練 stacking 與加權融合模型",
    desc: "使用 meta learner 與多種機率加權方法，建立最終預測。",
    panelTitle: "堆疊流程：meta learner 與融合",
    panelDesc: "比較不同整合策略的表現差異。",
    panelItems: [
      "Logistic Regression / XGBoost / CatBoost Stacking",
      "Voting、Odds Weighting、Inverse Variance Weighting",
      "比較整合前後的穩定性與預測品質",
    ],
  },
];

//文獻脈絡-基礎脈絡、研究定位、重要性、差異化貢獻
const litCards = [
  {
    title: "Ensemble Learning 基礎脈絡",
    desc: "從 bagging、boosting 到 stacking，說明集成學習如何提升泛化能力與穩定性。",
  },
  {
    title: "Stacking 的研究定位",
    desc: "stacking 不只是平均投票，而是利用次層學習器學習不同模型間的互補資訊。",
  },
  {
    title: "模型篩選的重要性",
    desc: "弱模型過多時可能稀釋整合優勢，因此模型篩選策略是核心研究變項之一。",
  },
  {
    title: "本研究的差異化貢獻",
    desc: "同時比較多資料集、多基礎模型、多元學習器與多種加權方式，形成完整實驗框架。",
  },
];

//動畫設定
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

//數學公式渲染函數
function renderKatex(math, displayMode = false) {
  try {
    return katex.renderToString(math, {
      throwOnError: false,
      displayMode,
      strict: false,
    });
  } catch {
    return math;
  }
}

function MathInline({ math }) {
  return (
    <span dangerouslySetInnerHTML={{ __html: renderKatex(math, false) }} />
  );
}

function MathBlock({ math }) {
  return <div dangerouslySetInnerHTML={{ __html: renderKatex(math, true) }} />;
}
function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-3">
      <div className="text-sm font-semibold tracking-[0.2em] uppercase text-[#93b5c6]">
        {eyebrow}
      </div>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="leading-8 text-slate-600">
        {description}
      </p>
    </div>
  );
}
//卡片方式展示數學公式
function FormulaCard({ title, formula, description }) {
  return (
    <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 overflow-x-auto">
          <MathBlock math={formula} />
        </div>
        <p className="text-sm leading-7 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

//切換不同資料集的按鈕
function DatasetSwitcher({ datasetKey, setDatasetKey }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(datasetMeta).map((d) => (
        <button
          key={d.key}
          onClick={() => setDatasetKey(d.key)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            datasetKey === d.key
              ? "bg-[#93b5c6] text-white shadow-sm"
              : "bg-[#f5efe4] text-slate-700 hover:bg-[#ddedaa]/70"
          }`}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
//頁面頂部導航列
function NavBar({ currentPage, setCurrentPage }) {
  return (
    <div className="sticky top-0 z-40 border-b border-[#93b5c6]/20 bg-[#f7f3ec]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#93b5c6] text-white shadow-sm">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Research Showcase</div>
              <div className="font-semibold text-slate-900">
                二分類資料堆疊整合學習器
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 flex-wrap justify-end">
            {pageItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[#93b5c6] text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

//首頁
function HomePage({ setCurrentPage }) {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-[#f0cf65]/18 via-[#f7f3ec] to-[#93b5c6]/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,181,198,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(215,129,106,0.14),transparent_26%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="space-y-6"
          >
            <Badge className="rounded-full bg-[#ddedaa] text-[#d7816a] hover:bg-[#ddedaa]">
              <Sparkles className="mr-2 h-4 w-4" />
              論文展示等級專題網站
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
              二分類資料堆疊整合學習器
              <span className="block text-[#d7816a]">
                Research Demo Website
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              本網站以分頁式研究展示頁的方式整合研究摘要、研究動機、研究目的、資料處理流程、核心方法、LaTeX
              公式、模型比較圖、 資料集切換視覺化、混淆矩陣、ROC / PR 曲線、OOF
              prediction 與文獻脈絡。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-2xl bg-[#93b5c6] text-white hover:bg-[#7fa7b8]"
                onClick={() => setCurrentPage("method")}
              >
                查看核心方法 <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => setCurrentPage("research")}
              >
                前往研究流程
              </Button>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {[
                { label: "驗證資料集", value: "8" },
                { label: "基礎模型", value: "16" },
                { label: "分析圖表", value: "8+" },
              ].map((item) => (
                <Card
                  key={item.label}
                  className="rounded-3xl border-0 shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="text-3xl font-bold text-slate-900">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {item.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="grid gap-4"
          >
            <Card className="rounded-[28px] border-0 bg-slate-900 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Microscope className="h-5 w-5 text-[#ddedaa]" /> 摘要
                </CardTitle>
                <CardDescription className="text-slate-300">
                  研究核心概念與整體方向
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-slate-200">
                <p>
                  本研究比較多種二元分類基礎模型，並透過不同的 stacking
                  與機率加權整合方式，檢驗是否能在多資料集任務中提升分類準確度、穩定性與泛化能力。
                </p>
                <p>
                  研究流程涵蓋資料前處理、模型訓練、模型篩選、次層整合與結果解釋，並藉由互動式網站將方法與結果以更具可讀性的形式呈現。
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">研究動機</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-slate-600">
                  單一模型在不同資料集上的穩定性有限，因此希望透過堆疊整合學習降低模型波動，提升表現一致性。
                </CardContent>
              </Card>
              <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">研究目的</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-slate-600">
                  建立一套可比較、可視覺化、可解釋的二元分類 stacking
                  研究框架，分析不同整合策略的優勢與限制。
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

//圓餅圖下方圖例
const Legend_order = {
  personality: ["Extrovert", "Introvert"],
  german: ["Good", "Bad"],
  sonar: ["Rock", "Mine"],
  cancer: ["Benign", "Mailgnant"],
  I: ["Good", "Bad"],
  Income: ["> 50K", "≤ 50K"],
  water: ["Potable", "Not potable"],
  pumpkin: ["Çerçevelik", "Ürgüp Sivrisi"],
};

// ✅ 只保留這一個 FlowDiagram 定義，刪除原本那兩個
function FlowDiagram({ steps, activeStep, onStepClick }) {
  return (
    <div className="grid gap-4 w-full">
      {steps.map((step, idx) => (
        <div
          key={step.id || step.title}
          // 這裡確保點擊可以切換右側內容
          onClick={() => onStepClick(step.id)}
          className={`group relative cursor-pointer rounded-3xl border p-5 pl-16 transition-all duration-300 shadow-sm ${
            activeStep === step.id
              ? "border-[#93b5c6] bg-[#ddedaa]/35 ring-1 ring-[#93b5c6]"
              : "border-slate-200 bg-white hover:border-[#93b5c6]/60"
          }`}
        >
          {/* 左側步驟編號 */}
          <div
            className={`absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-semibold transition-colors ${
              activeStep === step.id
                ? "bg-[#93b5c6] text-white"
                : "bg-[#efe8dc] text-slate-500"
            }`}
          >
            {idx + 1}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#93b5c6] font-bold">
                {step.short}
              </div>
              <div className="mt-1 font-bold text-slate-900">{step.title}</div>
              {/* 如果你希望左側也顯示簡短描述，可以保留這行 */}
              <div className="mt-2 text-sm leading-6 text-slate-500">
                {step.desc}
              </div>
            </div>

            {/* 右側箭頭指示器 */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                activeStep === step.id
                  ? "bg-[#93b5c6] text-white"
                  : "bg-slate-100 text-slate-300 group-hover:text-[#d7816a]"
              }`}
            >
              <ArrowRight
                className={`h-4 w-4 transition-transform ${activeStep === step.id ? "translate-x-0" : "-translate-x-1"}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

//數據與流程
function DataPage() {
  const [datasetKey, setDatasetKey] = useState("personality");
  const flowGroups = useMemo(
    () => [
      { id: "overall", label: "整體流程", steps: processSteps },
      { id: "base", label: "基礎模型訓練流程", steps: baseTrainingSteps },
      { id: "stack", label: "堆疊流程", steps: stackingFlowSteps },
    ],
    [],
  );
  const [activeFlow, setActiveFlow] = useState("overall");
  const activeSteps =
    flowGroups.find((group) => group.id === activeFlow)?.steps ?? processSteps;
  const [activeStep, setActiveStep] = useState(activeSteps[0]?.id ?? "dataset");

  React.useEffect(() => {
    setActiveStep(activeSteps[0]?.id ?? "dataset");
  }, [activeFlow]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="數據與流程"
        title="研究流程與建模步驟視覺化"
        description="本頁聚焦研究執行脈絡，將整體流程、基礎模型訓練流程與堆疊流程拆成三種視圖，讓讀者更清楚掌握方法設計。"
      />
      <div className="mt-10 space-y-6">
        <Card className="overflow-hidden rounded-[32px] border border-white/60 bg-white/75 shadow-[0_18px_50px_rgba(147,181,198,0.16)] backdrop-blur-sm">
          <CardHeader className="space-y-4 border-b border-[#93b5c6]/15 bg-[linear-gradient(135deg,rgba(221,237,170,0.26),rgba(240,207,101,0.18),rgba(147,181,198,0.12))]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Workflow className="h-5 w-5 text-[#93b5c6]" />
                  研究流程視圖
                </CardTitle>
                <CardDescription>
                  可切換整體流程、基礎模型訓練流程與堆疊流程
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {flowGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setActiveFlow(group.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeFlow === group.id ? "bg-[#93b5c6] text-white shadow-sm" : "bg-[#f5efe4] text-slate-700 hover:bg-[#ddedaa]/70"}`}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[28px] border border-[#93b5c6]/18 bg-white/55 p-6 backdrop-blur-sm">
              <div className="mb-4 text-sm font-medium text-slate-500">
                點擊流程步驟查看細節
              </div>
              <FlowDiagram
                steps={activeSteps}
                activeStep={activeStep}
                onStepClick={(id) => setActiveStep(id)}
              />
            </div>
            <Card className="rounded-[28px] border border-[#93b5c6]/20 bg-white/85 shadow-none overflow-hidden backdrop-blur-sm">
              {activeSteps
                .filter((step) => step.id === activeStep)
                .map((step) => (
                  <div
                    key={step.id}
                    className="animate-in fade-in slide-in-from-right-4 duration-300"
                  >
                    <CardHeader className="bg-[#ddedaa]/18 border-b border-[#93b5c6]/12">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#93b5c6] text-white text-sm font-bold">
                          {activeSteps.findIndex((s) => s.id === step.id) + 1}
                        </span>
                        <div>
                          <CardTitle className="text-xl text-slate-900">
                            {step.panelTitle}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {step.panelDesc}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {step.panelItems && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {step.panelItems.map((item) => (
                            <div
                              key={item}
                              className="flex items-start gap-3 rounded-2xl bg-[#f7f3ec] p-4 text-sm text-slate-700 border border-[#93b5c6]/10"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#93b5c6] flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.modelGroups && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {step.modelGroups.map((group) => (
                            <div
                              key={group.category}
                              className="rounded-2xl border border-slate-100 p-4"
                            >
                              <div className="text-xs font-bold text-[#93b5c6] uppercase mb-2">
                                {group.category}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {group.models.map((m) => (
                                  <span
                                    key={m}
                                    className="px-2 py-1 bg-white/90 border border-[#93b5c6]/20 rounded-md text-xs"
                                  >
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.image && (
                        <div className="rounded-2xl overflow-hidden border border-slate-200">
                          <img
                            src={step.image}
                            alt={step.imageAlt}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}

                      {step.panelText && (
                        <p className="text-sm leading-relaxed text-slate-600 bg-[#ddedaa]/35 p-4 rounded-2xl border border-[#93b5c6]/12">
                          {step.panelText}
                        </p>
                      )}

                      {step.links && (
                        <div className="grid gap-3">
                          {step.links.map((item) => (
                            <a
                              key={item.name}
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 transition hover:border-[#93b5c6]/70 hover:bg-[#ddedaa]/40"
                            >
                              <div>
                                <div className="font-medium text-slate-900">
                                  {item.name}
                                </div>
                                <div className="text-slate-500">
                                  來源：{item.source}
                                </div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-[#93b5c6]" />
                            </a>
                          ))}
                        </div>
                      )}

                      {!step.panelItems &&
                        !step.modelGroups &&
                        !step.image &&
                        !step.panelText &&
                        !step.links && (
                          <div className="rounded-2xl bg-[#f5efe4] p-4 text-sm leading-7 text-slate-600">
                            {step.desc}
                          </div>
                        )}
                    </CardContent>
                  </div>
                ))}
            </Card>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

//研究流程頁面
//實驗結果頁面
function MethodPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="核心方法論"
        title="Stacking 概述、LaTeX 公式與元學習器策略"
        description="這個區塊以論文展示頁的方式呈現方法：先說明概念，再用 LaTeX 公式表達，最後補上模型選擇邏輯。"
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader><CardTitle className="text-xl">所有方法（Stacking）概述</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {stackingMethods.map((m) => (
              <div key={m.title} className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                <div className="font-medium text-slate-900">{m.title}</div>
                <div className="mt-1 text-sm leading-7 text-slate-600">{m.desc}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Sigma className="h-5 w-5 text-[#93b5c6]" />公式定義總覽</CardTitle>
            <CardDescription>以 KaTeX 渲染數學公式，讓網站更接近論文展示形式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 overflow-x-auto"><MathBlock math={"Z(x)=\\left[p_1(x),p_2(x),\\dots,p_k(x)\\right]"} /></div>
            <p>其中 <MathInline math={"p_i(x)"} /> 表示第 <MathInline math={"i"} /> 個基礎模型對樣本 <MathInline math={"x"} /> 的預測機率。</p>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 overflow-x-auto"><MathBlock math={"\\hat{y}=\\sigma\\left(w^T Z(x)+b\\right)"} /></div>
            <p>這可視為 logistic stacking 的核心形式，用來學習不同基礎模型輸出的整合權重。</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <FormulaCard title="平均加權" formula={"E(x)=\\sum_{i=1}^{k} w_i\\,p_i(x),\\qquad \\sum_i w_i=1"} description="將各模型預測機率依權重加總，形成最終整合分數。" />
        <FormulaCard title="勝算加權 Odds Weighting" formula={"\\mathrm{odds}_i=\\frac{p_i}{1-p_i},\\qquad w_i=\\frac{\\mathrm{odds}_i}{\\sum_j \\mathrm{odds}_j}"} description="先將機率轉為勝算，再依相對強度配置整合權重。" />
        <FormulaCard title="Inverse Variance Weighting" formula={"w_i=\\frac{1/\\sigma_i^2}{\\sum_j 1/\\sigma_j^2}"} description="對波動較大的模型給予較低權重，提升整合結果穩定性。" />
        <FormulaCard title="模型篩選觀點" formula={"\\mathcal{M}^*=\\{m_i\\mid \\Delta \\mathrm{score}_i \\text{ not in steep-drop zone}\\}"} description="依表現陡降區間篩除弱模型，避免整合時引入過多噪音。" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader><CardTitle>元學習器選擇策略</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
            <p>先依基礎模型的 F1 分數或準確率排序，再觀察分數下降斜率，將陡降區段中的低品質模型排除後再進入 stacking。</p>
            <p>這種策略可降低弱模型對整合結果的干擾，讓 meta learner 更聚焦於高品質模型輸出的互補資訊。</p>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader><CardTitle>基礎模型池</CardTitle><CardDescription>以 badge 呈現模型庫，提升資訊密度與視覺辨識度</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {baseModels.map((m) => (<Badge key={m} variant="secondary" className="rounded-full px-3 py-1 text-slate-700">{m}</Badge>))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ResearchPage() {
  const [datasetKey, setDatasetKey] = useState("personality");
  const current = datasetMeta[datasetKey];
  const lineData = useMemo(() => current.models, [current]);

  const { bestModel, worstModel } = useMemo(() => {
    if (!current?.models?.length) return { bestModel: null, worstModel: null };
    let best = current.models[0];
    let worst = current.models[0];
    current.models.forEach((m) => {
      if (m.f1 > best.f1) best = m;
      if (m.f1 < worst.f1) worst = m;
    });
    return { bestModel: best, worstModel: worst };
  }, [current.models]);

  const confusionCells = [
    { label: "TN", value: current.confusion[0].predictedNegative },
    { label: "FP", value: current.confusion[0].predictedPositive },
    { label: "FN", value: current.confusion[1].predictedNegative },
    { label: "TP", value: current.confusion[1].predictedPositive },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="研究流程"
        title="資料介紹、基礎模型結果與堆疊模型分析"
        description="本頁整合原本的實驗結果與進階分析，並把資料集介紹一併移入，切換資料集時，下方所有結果會同步切換。"
      />

      <div className="mt-8">
        <DatasetSwitcher
          datasetKey={datasetKey}
          setDatasetKey={setDatasetKey}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="h-5 w-5 text-[#93b5c6]" />
              資料集介紹
            </CardTitle>
            <CardDescription>
              研究流程頁最上方先說明目前資料集背景與分布
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm text-[#93b5c6] font-medium">
                目前資料集
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {current.label}
              </div>
              <div className="mt-1 text-slate-500">{current.subtitle}</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/90 p-4">
                  <div className="text-sm text-slate-500">資料筆數</div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">
                    {current.size}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/90 p-4">
                  <div className="text-sm text-slate-500">特徵數</div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">
                    {current.features}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {current.note}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-slate-500 text-sm">ROC AUC</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">
                  {current.auc.toFixed(3)}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-slate-500 text-sm">PR AUC / AP</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">
                  {current.ap.toFixed(3)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>目標變數分布</CardTitle>
            <CardDescription>隨資料集切換同步更新</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={current.classData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={55}
                    paddingAngle={2}
                  >
                    <Cell fill="#93b5c6" />
                    <Cell fill="#d7816a" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3"
                  style={{ backgroundColor: "#93b5c6" }}
                />
                <span className="text-slate-700">
                  {current.classData[0]?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3"
                  style={{ backgroundColor: "#d7816a" }}
                />
                <span className="text-slate-700">
                  {current.classData[1]?.name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>基礎模型訓練表現</CardTitle>
            <CardDescription>{current.label} 的基礎模型結果</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-80 rounded-2xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Model</th>
                    <th className="px-4 py-3 font-medium">Accuracy</th>
                    <th className="px-4 py-3 font-medium">Precision</th>
                    <th className="px-4 py-3 font-medium">Recall</th>
                    <th className="px-4 py-3 font-medium">F1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-600">
                  {current.models.map((row) => (
                    <tr key={row.name}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.name}
                      </td>
                      <td className="px-4 py-3">{row.accuracy.toFixed(3)}</td>
                      <td className="px-4 py-3">{row.precision.toFixed(3)}</td>
                      <td className="px-4 py-3">{row.recall.toFixed(3)}</td>
                      <td className="px-4 py-3 font-semibold text-[#d7816a]">
                        {row.f1.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>基礎模型摘要</CardTitle>
            <CardDescription>快速掌握目前資料集的關鍵觀察</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f5efe4] p-4 shadow-sm">
                <div className="text-slate-500">最佳模型</div>
                <div className="mt-1 text-xl font-bold text-slate-900">
                  {bestModel?.name}
                </div>
                <div className="text-[#d7816a]">
                  F1 = {bestModel?.f1.toFixed(3)}
                </div>
              </div>
              <div className="rounded-2xl bg-[#f5efe4] p-4 shadow-sm">
                <div className="text-slate-500">最低表現</div>
                <div className="mt-1 text-xl font-bold text-slate-900">
                  {worstModel?.name}
                </div>
                <div className="text-rose-600">
                  F1 = {worstModel?.f1.toFixed(3)}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 leading-7">
              基礎模型結果會隨資料集切換同步更新，可直接拿來對照下方堆疊模型分析是否真的帶來穩定提升。
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>模型 F1 比較圖</CardTitle>
            <CardDescription>
              比較各基礎模型在目前資料集上的排序趨勢
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-20}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis domain={[0.4, 1]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="f1"
                    stroke="#93b5c6"
                    strokeWidth={3}
                    dot={{ r: 4 , fill: "#d7816a", stroke: "#93b5c6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Accuracy / Recall 對比圖</CardTitle>
            <CardDescription>
              觀察不同模型在準確率與召回率上的取捨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto py-4">
              <div className="min-w-[1200px] px-6">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={lineData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-20}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis domain={[0.4, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="accuracy"
                      fill="#93b5c6"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="recall"
                      fill="#d7816a"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <SectionTitle
          eyebrow="堆疊模型結果"
          title="進階分析與整合模型表現"
          description="以下內容整合原本進階分析頁的圖表，並與上方基礎模型結果放在同一個資料集上下文中。"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Binary className="h-5 w-5 text-[#93b5c6]" />
              混淆矩陣
            </CardTitle>
            <CardDescription>
              用四格卡片快速判讀 TP / TN / FP / FN
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {confusionCells.map((cell, idx) => (
                <div
                  key={cell.label}
                  className={`rounded-3xl p-6 ${idx === 0 || idx === 3 ? "bg-[#93b5c6] text-white" : "bg-slate-100 text-slate-900"}`}
                >
                  <div className="text-sm opacity-80">{cell.label}</div>
                  <div className="mt-2 text-3xl font-bold">{cell.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Actual</th>
                    <th className="px-4 py-3 text-left">Predicted Negative</th>
                    <th className="px-4 py-3 text-left">Predicted Positive</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-slate-700">
                  {current.confusion.map((row) => (
                    <tr key={row.actual} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium">{row.actual}</td>
                      <td className="px-4 py-3">{row.predictedNegative}</td>
                      <td className="px-4 py-3">{row.predictedPositive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FlaskConical className="h-5 w-5 text-[#93b5c6]" />
              單一模型 vs Stacking 雷達圖
            </CardTitle>
            <CardDescription>
              用視覺化方式展示整合模型在多面向指標上的優勢
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={current.radar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Best Base Model"
                    dataKey="base"
                    stroke="#93b5c6"
                    fill="#93b5c6"
                    fillOpacity={0.25}
                  />
                  <Radar
                    name="Stacking Model"
                    dataKey="stack"
                    stroke="#d7816a"
                    fill="#d7816a"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>ROC Curve</CardTitle>
            <CardDescription>
              以 FPR 與 TPR 描述分類器的區辨能力
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={current.roc}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="fpr" domain={[0, 1]} />
                  <YAxis type="number" dataKey="tpr" domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tpr"
                    name="ROC"
                    stroke="#93b5c6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#f0cf65", stroke: "#93b5c6", strokeWidth: 2  }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Precision-Recall Curve</CardTitle>
            <CardDescription>
              在不平衡資料下更能反映正類預測品質
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={current.pr}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="recall" domain={[0, 1]} />
                  <YAxis type="number" dataKey="precision" domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="precision"
                    name="PR"
                    stroke="#d7816a"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#f0cf65", stroke: "#d7816a", strokeWidth: 2  }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>OOF Prediction 視覺化</CardTitle>
            <CardDescription>
              比較每個 fold 的最佳單模與 stacking 表現
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={current.oof}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fold" />
                  <YAxis domain={[0.5, 0.95]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="base"
                    name="Best Base"
                    fill="#93b5c6"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="stack"
                    name="Stacking"
                    fill="#d7816a"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>分析發現</CardTitle>
            <CardDescription>搭配堆疊模型結果的口頭說明重點</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
            <div className="rounded-2xl bg-[#f5efe4] p-4 shadow-sm">
              混淆矩陣可幫助辨識模型錯誤型態，特別是 false positive 與 false
              negative 的實際代價差異。
            </div>
            <div className="rounded-2xl bg-[#f5efe4] p-4 shadow-sm">
              ROC 適合看整體區辨能力，PR
              曲線則更適合不平衡資料情境下的正類預測品質評估。
            </div>
            <div className="rounded-2xl bg-[#f5efe4] p-4 shadow-sm">
              OOF 視覺化能說明 stacking 是否在各 fold
              上穩定優於單一模型，而不是只在單次切分下偶然提升。
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

//總結頁面
function SummaryPage() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="總結"
          title="研究結果、關鍵發現圖解與未來方向"
          description="以更精煉的方式收束整份網站內容，讓讀者在離開前仍保有清楚的研究印象。"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[28px] border border-[#93b5c6]/20 bg-white/82 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
            <CardHeader className="border-b border-[#93b5c6]/12 bg-[#ddedaa]/18">
              <CardTitle className="text-slate-900">研究結果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-700">
              <p>
                <span className="font-semibold text-[#d7816a]">stacking</span>{" "}
                整合學習提供了比單一模型更具潛力的預測架構，尤其適合多資料集、模型表現差異明顯的情境。
              </p>
              <p>
                模型篩選與{" "}
                <span className="font-semibold text-[#93b5c6]">
                  meta learner
                </span>{" "}
                選擇是最關鍵的兩個設計點，會直接影響最終整合品質與模型穩定性。
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-[#93b5c6]/20 bg-white/82 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
            <CardHeader className="border-b border-[#93b5c6]/12 bg-[#f0cf65]/14">
              <CardTitle className="text-slate-900">研究價值圖解</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-700">
              <div className="rounded-2xl border border-[#93b5c6]/12 bg-[#f7f3ec] p-5">
                <div className="font-semibold text-[#d7816a]">1. 多模型互補</div>
                <div className="mt-2 text-slate-600">
                  不同基礎模型擅長不同資料模式，stacking 能夠整合這些互補訊號。
                </div>
              </div>

              <div className="rounded-2xl border border-[#93b5c6]/12 bg-[#f7f3ec] p-5">
                <div className="font-semibold text-[#93b5c6]">2. 提升穩定性</div>
                <div className="mt-2 text-slate-600">
                  整合模型不只追求最佳分數，也能降低單一模型波動與資料依賴性。
                </div>
              </div>

              <div className="rounded-2xl border border-[#93b5c6]/12 bg-[#f7f3ec] p-5">
                <div className="font-semibold text-[#d7816a]">3. 強化可展示性</div>
                <div className="mt-2 text-slate-600">
                  研究方法、流程與結果透過網站視覺化後，更適合專題發表與口頭報告。
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {[
            {
              text: "擴充更多資料集並驗證泛化能力",
              tone: "bg-[#ddedaa]/30 border-[#ddedaa]/60 text-slate-800",
            },
            {
              text: "加入機率校正、OOF 分析與混淆矩陣展示",
              tone: "bg-[#f0cf65]/22 border-[#f0cf65]/55 text-slate-800",
            },
            {
              text: "建立更完整的互動式實驗儀表板與部署頁面",
              tone: "bg-[#93b5c6]/20 border-[#93b5c6]/45 text-slate-800",
            },
          ].map((item) => (
            <Card
              key={item.text}
              className={`rounded-[28px] border shadow-[0_12px_30px_rgba(147,181,198,0.08)] ${item.tone}`}
            >
              <CardContent className="p-6 text-sm leading-7 font-medium">
                {item.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

//文獻脈絡頁面
function LiteraturePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="文獻脈絡回顧"
        title="文獻概述、研究定位與相關方法介紹"
        description="此區塊預留給你補上正式文獻內容，建議依照『問題背景 → 相關研究 → 本研究定位』的順序編排。"
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>文獻回顧概述</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
            <p>
              可先整理二元分類、集成學習、stacking、voting 與 weighted
              ensembling 的發展脈絡，說明為何單一分類器常受資料特性限制。
            </p>
            <p>
              接著帶入本研究重點：不只比較 meta
              learner，也比較基礎模型篩選與不同加權策略對最終結果的影響。
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>相關研究方法及介紹</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Bagging / Boosting / Stacking 差異比較",
              "Soft Voting 與 Weighted Voting 概念",
              "Meta learner 在分類整合中的角色",
              "模型穩定性、泛化能力與過度擬合討論",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-[#f5efe4] p-4 text-sm text-slate-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {litCards.map((item) => (
          <Card key={item.title} className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-600">
              {item.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Footer({ currentPage, setCurrentPage }) {
  return (
    <footer className="border-t border-[#93b5c6]/15 bg-[#efe8dc]/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>兩分類資料堆疊整合學習器｜Research Showcase Website</div>
        <div className="flex flex-wrap gap-2">
          {pageItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`rounded-full px-3 py-1.5 ${currentPage === item.id ? "bg-[#93b5c6] text-white" : "hover:text-slate-900"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

function PageContainer({ currentPage, setCurrentPage }) {
  if (currentPage === "home")
    return <HomePage setCurrentPage={setCurrentPage} />;
  if (currentPage === "data") return <DataPage />;
  if (currentPage === "method") return <MethodPage />;
  if (currentPage === "research") return <ResearchPage />;
  if (currentPage === "summary") return <SummaryPage />;
  return <LiteraturePage />;
}

export default function ProjectIntroWebsite() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-slate-900">
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          <PageContainer
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </motion.div>
      </AnimatePresence>
      <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </main>
  );
}
