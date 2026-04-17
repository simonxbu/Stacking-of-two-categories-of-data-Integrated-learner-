"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import katex from "katex";
import "katex/dist/katex.min.css";
import allStackingResults from "./all_stacking_results_combined.json";
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
  ChartBarIcon,
  Cat,
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
      { name: "Extrovert", value: 1491, percentage: "51.4%", color: "#93b5c6"},
      { name: "Introvert ", value: 1409, percentage: "48.6%", color: "#d7816a" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.9379, 
        precision: 0.9486, 
        recall: 0.9295, 
        f1: 0.9390, 
        ROC_AUC: 0.9455,
        PR_AUC: 0.9426,
        Best_Threshold: 0.62,
        MCC:0.8760,
      },
      {
        name: "Decision_tree",
        accuracy: 0.9276, 
        precision: 0.9476, 
        recall: 0.9094, 
        f1: 0.9281, 
        ROC_AUC: 0.9532, 
        PR_AUC: 0.9584,
        Best_Threshold: 0.55,
        MCC:0.8560,
      },
      {
        name: "Random_forest",
        accuracy: 0.9397,
        precision: 0.9519,
        recall: 0.9295,
        f1: 0.9406,
        ROC_AUC: 0.9717,
        PR_AUC: 0.9750,
        Best_Threshold: 0.81,
        MCC:0.8796,
      },
      {
        name: "SVM",
        accuracy: 0.9362,
        precision: 0.9516, 
        recall: 0.9228, 
        f1: 0.9370, 
        ROC_AUC: 0.9682 , 
        PR_AUC: 0.9710 ,
        Best_Threshold: 0.91,
        MCC:0.8728,
      },
      {
        name: "Xgboost",
        accuracy: 0.9397, 
        precision: 0.9519, 
        recall: 0.9295, 
        f1: 0.9406, 
        ROC_AUC: 0.9723 , 
        PR_AUC: 0.9771 ,
        Best_Threshold: 0.62,
        MCC:0.8796,
      },
      {
        name: "Lightgbm",
        accuracy: 0.9345, 
        precision: 0.9514, 
        recall: 0.9195, 
        f1: 0.9352, 
        ROC_AUC: 0.9681 , 
        PR_AUC: 0.9730 ,
        Best_Threshold: 0.72,
        MCC:0.8695,
      },
      {
        name: "Catboost",
        accuracy: 0.9379, 
        precision: 0.9517, 
        recall: 0.9262,
        f1: 0.9399, 
        ROC_AUC: 0.9718 , 
        PR_AUC: 0.9766 ,
        Best_Threshold: 0.78,
        MCC:0.8762,
      },
      {
        name: "MLP",
        accuracy: 0.9379, 
        precision: 0.9519, 
        recall: 0.9295, 
        f1: 0.9406, 
        ROC_AUC: 0.9511, 
        PR_AUC: 0.9512,
        Best_Threshold: 0.05,
        MCC:0.8796,
      },
      {
        name: "KNN",
        accuracy: 0.9414, 
        precision: 0.9552, 
        recall: 0.9295, 
        f1: 0.9422, 
        ROC_AUC: 0.9717, 
        PR_AUC: 0.9741,
        Best_Threshold: 0.83,
        MCC:0.8831,
      },
      {
        name: "Extra_trees",
        accuracy: 0.9293, 
        precision: 0.9541, 
        recall: 0.9060, 
        f1: 0.9294, 
        ROC_AUC: 0.9732, 
        PR_AUC: 0.9769,
        Best_Threshold: 0.85,
        MCC:0.8599,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.9397, 
        precision: 0.9519, 
        recall: 0.9295, 
        f1: 0.9406, 
        ROC_AUC: 0.9723, 
        PR_AUC: 0.9773,
        Best_Threshold: 0.55,
        MCC:0.8796,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.9397, 
        precision: 0.9519, 
        recall: 0.9295, 
        f1: 0.9406, 
        ROC_AUC: 0.9735, 
        PR_AUC: 0.9762,
        Best_Threshold: 0.62,
        MCC:0.8796,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.9379, 
        precision: 0.9486, 
        recall: 0.9295, 
        f1: 0.9390, 
        ROC_AUC: 0.9142, 
        PR_AUC: 0.9002,
        Best_Threshold: 0.01,
        MCC:0.8760,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.9379, 
        precision: 0.9486, 
        recall: 0.9295, 
        f1: 0.9390, 
        ROC_AUC: 0.9253, 
        PR_AUC: 0.9312,
        Best_Threshold: 0.01,
        MCC:0.8760,
      },
      {
        name: "LDA",
        accuracy: 0.9379, 
        precision: 0.9486, 
        recall: 0.9295, 
        f1: 0.9390, 
        ROC_AUC: 0.9467, 
        PR_AUC: 0.9429,
        Best_Threshold: 0.69,
        MCC:0.8760,
      },
      {
        name: "QDA",
        accuracy: 0.9397, 
        precision: 0.9519, 
        recall: 0.9295, 
        f1: 0.9406, 
        ROC_AUC: 0.9135, 
        PR_AUC: 0.8994,
        Best_Threshold: 0.09,
        MCC:0.8796,
      },
    ],
    //進階分析-雷達圖(未改)
    radar: [
      { metric: "Accuracy", base: 82, stack: 89 },
      { metric: "Precision", base: 76, stack: 85 },
      { metric: "Recall", base: 72, stack: 83 },
      { metric: "F1", base: 74, stack: 87 },
      { metric: "MCC", base: 68, stack: 84 },
    ],
    //混淆矩陣(已改)
    confusionMatrix: {
      base: {
        rank_4: {
          hgb: { cm: [[268, 14], [21, 277]] },
          gb: { cm: [[268, 14], [21, 277]] },
          k: {cm:[[268, 14], [21, 277]]},
        },
        rank_f1_top7: {
          hgb: { cm: [[268, 14], [21, 277]] },
          xgb: { cm: [[268, 14], [21, 277]] },
          gb: { cm: [[268, 14], [21, 277]] },
          k: { cm: [[268, 14], [21, 277]] },
          rf: { cm: [[267, 15], [21, 277]] },
          m: { cm: [[268, 14], [21, 277]] },
          q: { cm: [[268, 14], [21, 277]] },
        },
        rank_f1_top12: {
          hgb: { cm: [[268, 14], [21, 277]] },
          xgb: { cm: [[268, 14], [21, 277]] },
          gb: { cm: [[268, 14], [21, 277]] },
          cat: { cm: [[267, 15], [21, 277]] },
          k: { cm: [[268, 14], [21, 277]] },
          rf: { cm: [[267, 15], [21, 277]] },
          m: { cm: [[268, 14], [21, 277]] },
          l: { cm: [[267, 15], [21, 277]] },
          lr: { cm: [[267, 15], [21, 277]] },
          gnb: { cm: [[267, 15], [21, 277]] },
          bnb: { cm: [[267, 15], [21, 277]] },
          q: { cm: [[268, 14], [21, 277]] },
        },
      },

      stacking: {
        rank_4: {
          stack_odds: { cm: [[268, 14], [21, 277]] },
          stack_avg: { cm: [[268, 14], [21, 277]] },
          stack_inv_var: { cm: [[268, 14], [21, 277]] },
          stack_logistic: { cm: [[268, 14], [21, 277]] },
          stack_catboost: { cm: [[270, 12], [23, 275]] },
          stack_xgboost: { cm: [[270, 12], [21, 277]] },
        },
        rank_f1_top7: {
          stack_xgboost: { cm: [[269, 13], [22, 276]] },
          stack_logistic: { cm: [[268, 14], [21, 277]] },
          stack_inv_var: { cm: [[268, 14], [21, 277]] },
          stack_avg: { cm: [[268, 14], [21, 277]] },
          stack_catboost: { cm: [[238, 44], [20, 278]] },
          stack_odds: { cm: [[268, 14], [21, 277]] },
        },
        rank_f1_top12: {
          stack_xgboost: { cm: [[221, 61], [11, 287]] },
          stack_catboost: { cm: [[206, 76], [8, 290]] },
          stack_logistic: { cm: [[268, 14], [21, 277]] },
          stack_inv_var: { cm: [[267, 15], [21, 277]] },
          stack_avg: { cm: [[267, 15], [21, 277]] },
          stack_odds: { cm: [[267, 15], [21, 277]] },
        },
      },
    },
    //ROC Curve(應改成圖表)
    roc: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.03, tpr: 0.39 },
      { fpr: 0.08, tpr: 0.58 },
      { fpr: 0.14, tpr: 0.71 },
      { fpr: 0.22, tpr: 0.81 },
      { fpr: 0.35, tpr: 0.9 },
      { fpr: 1.0, tpr: 1.0 },
    ],
    //Precision-Recall Curve(應改成圖表)
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
      { name: "Good", value: 700, percentage: "70%", color: "#93b5c6" },
      { name: "Bad", value: 300, percentage: "30%", color: "#d7816a" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.725,
        precision: 0.8095,
        recall: 0.7083,
        f1: 0.7556,
        ROC_AUC: 0.8173,
        PR_AUC: 0.8736,
        Best_Threshold:0.54,
        MCC:0.4496,
      },
      {
        name: "Decision_tree",
        accuracy: 0.675,
        precision: 0.7619,
        recall: 0.6667,
        f1: 0.7111,
        ROC_AUC: 0.7545,
        PR_AUC: 0.8244,
        Best_Threshold:0.38,
        MCC:0.3474,
      },
      {
        name: "Random_forest",
        accuracy: 0.755,
        precision: 0.7554,
        recall: 0.875,
        f1: 0.8108,
        ROC_AUC: 0.8222,
        PR_AUC: 0.8727,
        Best_Threshold:0.46,
        MCC:0.4788,
      },
      {
        name: "SVM",
        accuracy: 0.735,
        precision: 0.8131,
        recall: 0.725,
        f1: 0.7665,
        ROC_AUC: 0.8163,
        PR_AUC: 0.8747,
        Best_Threshold:0.71,
        MCC:0.4665,
      },
      {
        name: "Xgboost",
        accuracy: 0.735,
        precision: 0.7965,
        recall: 0.75,
        f1: 0.7725,
        ROC_AUC: 0.8264,
        PR_AUC: 0.8723,
        Best_Threshold:0.69,
        MCC:0.4570,
      },
      {
        name: "Lightgbm",
        accuracy: 0.765,
        precision: 0.7874,
        recall: 0.8333,
        f1: 0.8097,
        ROC_AUC: 0.8108,
        PR_AUC: 0.8536,
        Best_Threshold:0.62,
        MCC:0.5046,
      },
      {
        name: "Catboost",
        accuracy: 0.76,
        precision: 0.7727,
        recall: 0.85,
        f1: 0.8095,
        ROC_AUC: 0.8163,
        PR_AUC: 0.8626,
        Best_Threshold:0.46,
        MCC:0.4912,
      },
      {
        name: "MLP",
        accuracy: 0.72,
        precision: 0.8137,
        recall: 0.6917,
        f1: 0.7477,
        ROC_AUC: 0.7911,
        PR_AUC: 0.8602,
        Best_Threshold:0.8,
        MCC:0.4451,
      },
      {
        name: "KNN",
        accuracy: 0.66,
        precision: 0.8095,
        recall: 0.5667,
        f1: 0.6667,
        ROC_AUC: 0.7787,
        PR_AUC: 0.8322,
        Best_Threshold:0.76,
        MCC:0.3639,
      },
      {
        name: "Extra_trees",
        accuracy: 0.765,
        precision: 0.7664,
        recall: 0.875,
        f1: 0.8171,
        ROC_AUC: 0.8098,
        PR_AUC: 0.8560,
        Best_Threshold:0.3,
        MCC:0.5010,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.725,
        precision: 0.7982,
        recall: 0.725,
        f1: 0.7598,
        ROC_AUC: 0.8173,
        PR_AUC: 0.8653,
        Best_Threshold:0.7,
        MCC:0.4427,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.7,
        precision: 0.8261,
        recall: 0.6333,
        f1: 0.7170,
        ROC_AUC: 0.7960,
        PR_AUC: 0.8427,
        Best_Threshold:0.73,
        MCC:0.4259,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.735,
        precision: 0.7769,
        recall: 0.7833,
        f1: 0.7801,
        ROC_AUC: 0.7697,
        PR_AUC: 0.8331,
        Best_Threshold:0.32,
        MCC:0.4468,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.73,
        precision: 0.7895,
        recall: 0.75,
        f1: 0.7692,
        ROC_AUC: 0.7910,
        PR_AUC: 0.8584,
        Best_Threshold:0.64,
        MCC:0.4453,
      },
      {
        name: "LDA",
        accuracy: 0.75,
        precision: 0.8017,
        recall: 0.775,
        f1: 0.7881,
        ROC_AUC: 0.8090,
        PR_AUC: 0.8583,
        Best_Threshold:0.69,
        MCC:0.4839,
      },
      {
        name: "QDA",
        accuracy: 0.69,
        precision: 0.7589,
        recall: 0.7083,
        f1: 0.7328,
        ROC_AUC: 0.7582,
        PR_AUC: 0.8416,
        Best_Threshold:0.72,
        MCC:0.3660,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 77, stack: 84 },
      { metric: "Precision", base: 73, stack: 82 },
      { metric: "Recall", base: 64, stack: 79 },
      { metric: "F1", base: 68, stack: 81 },
      { metric: "MCC", base: 62, stack: 80 },
    ],
    //混淆矩陣(未改)
    confusionMatrix: {
      base: {
        rank_4: {
          xgb: { cm: [[55, 25], [23, 97]] },
          s: { cm: [[60, 20], [33, 87]] },
          et: {cm:[[55, 25], [26, 94]]},
          hgb: {cm:[[60, 20], [41, 79]]},
        },
        rank_f1_top4: {
          rf: { cm: [[52, 28], [21, 99]] },
          cat: { cm: [[66, 14], [43, 77]] },
          lgbm: { cm: [[58, 22], [40, 80]] },
          et: { cm: [[55, 25], [26, 94]] },
        },
        rank_f1_top12: {
          xgb: { cm: [[55, 25], [23, 97]] },
          rf: { cm: [[52, 28], [21, 99]] },
          lr: { cm: [[57, 23], [27, 93]] },
          gb: { cm: [[64, 16], [38, 82]] },
          s: { cm: [[60, 20], [33, 87]] },
          cat: { cm: [[66, 14], [43, 77]] },
          lgbm: { cm: [[58, 22], [40, 80]] },
          et: { cm: [[55, 25], [26, 94]] },
          l: { cm: [[57, 23], [24, 96]] },
          m: { cm: [[56, 24], [33, 87]] },
          bnb: { cm: [[61, 19], [35, 85]] },
          gnb: { cm: [[56, 24], [29, 91]] },
        },
        rank_f1_top15: {
          xgb: { cm: [[55, 25], [23, 97]] },
          rf: { cm: [[52, 28], [21, 99]] },
          lr: { cm: [[57, 23], [27, 93]] },
          gb: { cm: [[64, 16], [38, 82]] },
          s: { cm: [[60, 20], [33, 87]] },
          cat: { cm: [[66, 14], [43, 77]] },
          lgbm: { cm: [[58, 22], [40, 80]] },
          et: { cm: [[55, 25], [26, 94]] },
          l: { cm: [[57, 23], [24, 96]] },
          hgb: { cm: [[60, 20], [41, 79]] },
          m: { cm: [[56, 24], [33, 87]] },
          bnb: { cm: [[61, 19], [35, 85]] },
          q: { cm: [[54, 26], [35, 85]] },
          gnb: { cm: [[56, 24], [29, 91]] },
          dt: { cm: [[72, 8], [63, 57]] },
        },
      },

      stacking: {
        rank_4: {
          stack_odds: { cm: [[56, 24], [29, 91]] },
          stack_logistic: { cm: [[56, 24], [25, 95]] },
          stack_avg: { cm: [[56, 24], [31, 89]] },
          stack_inv_var: { cm: [[55, 25], [27, 93]] },
          stack_xgboost: { cm: [[45, 35], [20, 100]] },
          stack_catboost: { cm: [[29, 51], [19, 101]] },
        },
        rank_f1_top4: {
          stack_inv_var: { cm: [[60, 20], [37, 83]] },
          stack_logistic: { cm: [[53, 27], [24, 96]] },
          stack_avg: { cm: [[52, 28], [24, 96]] },
          stack_odds: { cm: [[55, 25], [34, 86]] },
          stack_catboost: { cm: [[46, 34], [24, 96]] },
          stack_xgboost: { cm: [[53, 27], [25, 95]] },    
        },
        rank_f1_top12: {
          stack_inv_var: { cm: [[62, 18], [38, 82]] },
          stack_logistic: { cm: [[57, 23], [27, 93]] },
          stack_avg: { cm: [[61, 19], [39, 81]] },
          stack_odds: { cm: [[54, 26], [22, 98]] },
          stack_xgboost: { cm: [[46, 34], [23, 97]] },
          stack_catboost: { cm: [[42, 38], [20, 100]] }, 
        },
        rank_f1_top15: {
          stack_inv_var: { cm: [[55, 25], [28, 92]] },
          stack_logistic: { cm: [[59, 21], [29, 91]] },
          stack_avg: { cm: [[59, 21], [35, 85]] },
          stack_odds: { cm: [[60, 20], [36, 84]] },
          stack_catboost: { cm: [[47, 33], [23, 97]] }, 
          stack_xgboost: { cm: [[42, 38], [22, 98]] },         
        },
      },
    },
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
      { name: "Rock", value: 111, percentage: "53.4%", color: "#93b5c6" },
      { name: "Mine", value: 97, percentage: "46.6%", color: "#d7816a" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.8372,
        precision: 0.8636,
        recall: 0.8261,
        f1: 0.8444,
        ROC_AUC: 0.8326,
        PR_AUC: 0.7938,
        Best_Threshold:0.5,
        MCC:0.6746,
      },
      {
        name: "Decision_tree",
        accuracy: 0.7209,
        precision: 0.72,
        recall: 0.7826,
        f1: 0.75,
        ROC_AUC: 0.7975,
        PR_AUC: 0.8625,
        Best_Threshold:0.35,
        MCC:0.4374,
      },
      {
        name: "Random_forest",
        accuracy: 0.4651,
        precision: 0,
        recall: 0,
        f1: 0,
        ROC_AUC: 0.5,
        PR_AUC: 0.7674,
        Best_Threshold:0.54,
        MCC:0,
      },
      {
        name: "SVM",
        accuracy: 0.6744,
        precision: 0.7647,
        recall: 0.5652,
        f1: 0.65,
        ROC_AUC: 0.7717,
        PR_AUC: 0.8252,
        Best_Threshold:0.54,
        MCC:0.3726,
      },
      {
        name: "Xgboost",
        accuracy: 0.5349,
        precision: 0.5349,
        recall: 1.0,
        f1: 0.6970,
        ROC_AUC: 0.5,
        PR_AUC: 0.7674,
        Best_Threshold:0.5,
        MCC:0,
      },
      {
        name: "Lightgbm",
        accuracy: 0.5349,
        precision: 0.5349,
        recall: 1.0,
        f1: 0.6970,
        ROC_AUC: 0.5,
        PR_AUC: 0.7674,
        Best_Threshold:0.5,
        MCC:0,
      },
      {
        name: "Catboost",
        accuracy: 0.6279,
        precision: 0.7692,
        recall: 0.4348,
        f1: 0.5556,
        ROC_AUC: 0.8022,
        PR_AUC: 0.7888,
        Best_Threshold:0.4,
        MCC:0.3093,
      },
      {
        name: "MLP",
        accuracy: 0.6512,
        precision: 0.6818,
        recall: 0.6522,
        f1: 0.6667,
        ROC_AUC: 0.6543,
        PR_AUC: 0.6704,
        Best_Threshold:0.45,
        MCC:0.3015,
      },
      {
        name: "KNN",
        accuracy: 0.6279,
        precision: 0.6296,
        recall: 0.7391,
        f1: 0.68,
        ROC_AUC: 0.7261,
        PR_AUC: 0.7911,
        Best_Threshold:0.51,
        MCC:0.2468,
      },
      {
        name: "Extra_trees",
        accuracy: 0.8140,
        precision: 0.8261,
        recall: 0.8261,
        f1: 0.8261,
        ROC_AUC: 0.8761,
        PR_AUC: 0.8633,
        Best_Threshold:0.5,
        MCC:0.6261,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.8140,
        precision: 0.8,
        recall: 0.8696,
        f1: 0.8333,
        ROC_AUC: 0.8696,
        PR_AUC: 0.8556,
        Best_Threshold:0.5,
        MCC:0.6264,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.5349,
        precision: 0.5349,
        recall: 1.0,
        f1: 0.6970,
        ROC_AUC: 0.5,
        PR_AUC: 0.7674,
        Best_Threshold:0.5,
        MCC:0,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.7442,
        precision: 0.8333,
        recall: 0.6522,
        f1: 0.7317,
        ROC_AUC: 0.8043,
        PR_AUC: 0.7493,
        Best_Threshold:0.14,
        MCC:0.5077,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.6744,
        precision: 0.7143,
        recall: 0.6522,
        f1: 0.6818,
        ROC_AUC: 0.6587,
        PR_AUC: 0.6437,
        Best_Threshold:0.75,
        MCC:0.3514,
      },
      {
        name: "LDA",
        accuracy: 0.7209,
        precision: 0.6774,
        recall: 0.9130,
        f1: 0.7778,
        ROC_AUC: 0.8413,
        PR_AUC: 0.8488,
        Best_Threshold:0.15,
        MCC:0.4593,
      },
      {
        name: "QDA",
        accuracy: 0.6977,
        precision: 0.6389,
        recall: 1.0,
        f1: 0.7797,
        ROC_AUC: 0.7891,
        PR_AUC: 0.8600,
        Best_Threshold:0.11,
        MCC:0.4729,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "MCC", base: 70, stack: 82 },
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
      { name: "Benign", value: 357, percentage: "62.7%", color: "#93b5c6" },
      { name: "Mailgnant", value: 212, percentage: "37.3%", color: "#d7816a" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.9561,
        precision: 0.9367,
        recall: 1.0,
        f1: 0.9673,
        ROC_AUC: 0.9946,
        PR_AUC: 0.9971,
        Best_Threshold:0.27,
        MCC:0.9053,
      },
      {
        name: "Decision_tree",
        accuracy: 0.9211,
        precision: 0.9012,
        recall: 0.9865,
        f1: 0.9419,
        ROC_AUC: 0.9777,
        PR_AUC: 0.9894,
        Best_Threshold:0.01,
        MCC:0.8276,
      },
      {
        name: "Random_forest",
        accuracy: 0.9386,
        precision: 0.9718,
        recall: 0.9324,
        f1: 0.9517,
        ROC_AUC: 0.9919,
        PR_AUC: 0.9957,
        Best_Threshold:0.44,
        MCC:0.8689,
      },
      {
        name: "SVM",
        accuracy: 0.9561,
        precision: 0.9367,
        recall: 1.0,
        f1: 0.9673,
        ROC_AUC: 0.9949,
        PR_AUC: 0.9971,
        Best_Threshold:0.2,
        MCC:0.9053,
      },
      {
        name: "Xgboost",
        accuracy: 0.9561,
        precision: 0.9726,
        recall: 0.9595,
        f1: 0.9660,
        ROC_AUC: 0.9912,
        PR_AUC: 0.9951,
        Best_Threshold:0.45,
        MCC:0.9044,
      },
      {
        name: "Lightgbm",
        accuracy: 0.9561,
        precision: 0.9726,
        recall: 0.9595,
        f1: 0.9660,
        ROC_AUC: 0.9875,
        PR_AUC: 0.9923,
        Best_Threshold:0.51,
        MCC:0.9044,
      },
      {
        name: "Catboost",
        accuracy: 0.9561,
        precision: 0.9481,
        recall: 0.985,
        f1: 0.9669,
        ROC_AUC: 0.9922,
        PR_AUC: 0.9954,
        Best_Threshold:0.11,
        MCC:0.9036,
      },
      {
        name: "MLP",
        accuracy: 0.9561,
        precision: 0.9367,
        recall: 1.0,
        f1: 0.9673,
        ROC_AUC: 0.9963,
        PR_AUC: 0.9980,
        Best_Threshold:0.14,
        MCC:0.9053,
      },
      {
        name: "KNN",
        accuracy: 0.9211,
        precision: 0.8916,
        recall: 1.0,
        f1: 0.9427,
        ROC_AUC: 0.9883,
        PR_AUC: 0.9936,
        Best_Threshold:0.37,
        MCC:0.8312,
      },
      {
        name: "Extra_trees",
        accuracy: 0.9474,
        precision: 0.9722,
        recall: 0.9459,
        f1: 0.9589,
        ROC_AUC: 0.9943,
        PR_AUC: 0.9970,
        Best_Threshold:0.4,
        MCC:0.8864,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.9649,
        precision: 0.9487,
        recall: 1.0,
        f1: 0.9737,
        ROC_AUC: 0.9892,
        PR_AUC: 0.9933,
        Best_Threshold:0.01,
        MCC:0.9240,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.9649,
        precision: 0.9487,
        recall: 1.0,
        f1: 0.9737,
        ROC_AUC: 0.9916,
        PR_AUC: 0.9952,
        Best_Threshold:0.02,
        MCC:0.9240,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.9035,
        precision: 0.9315,
        recall: 0.9189,
        f1: 0.9252,
        ROC_AUC: 0.9821,
        PR_AUC: 0.9905,
        Best_Threshold:0.01,
        MCC:0.7895,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.9123,
        precision: 0.9571,
        recall: 0.9054,
        f1: 0.9306,
        ROC_AUC: 0.9811,
        PR_AUC: 0.9898,
        Best_Threshold:0.65,
        MCC:0.8141,
      },
      {
        name: "LDA",
        accuracy: 0.9386,
        precision: 0.9855,
        recall: 0.9189,
        f1: 0.9510,
        ROC_AUC: 0.9939,
        PR_AUC: 0.9968,
        Best_Threshold:0.92,
        MCC:0.8728,
      },
      {
        name: "QDA",
        accuracy: 0.9386,
        precision: 0.9351,
        recall: 0.9730,
        f1: 0.9536,
        ROC_AUC: 0.9696,
        PR_AUC: 0.9640,
        Best_Threshold:0.4,
        MCC:0.8643,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "MCC", base: 70, stack: 82 },
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
      { name: "Good", value: 225, percentage: "64.1%", color: "#93b5c6" },
      { name: "Bad", value: 126, percentage: "35.9%", color: "#d7816a" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.8592,
        precision: 0.86,
        recall: 0.9348,
        f1: 0.8958,
        ROC_AUC: 0.9357,
        PR_AUC: 0.9606,
        Best_Threshold:0.58,
        MCC:0.6853,
      },
      {
        name: "Decision_tree",
        accuracy: 0.8169,
        precision: 0.8235,
        recall: 0.9130,
        f1: 0.8660,
        ROC_AUC: 0.7970,
        PR_AUC: 0.8501,
        Best_Threshold:0.38,
        MCC:0.5872,
      },
      {
        name: "Random_forest",
        accuracy: 0.9014,
        precision: 0.8679,
        recall: 1.0,
        f1: 0.9293,
        ROC_AUC: 0.9722,
        PR_AUC: 0.9838,
        Best_Threshold:0.3,
        MCC:0.7905,
      },
      {
        name: "SVM",
        accuracy: 0.9718,
        precision: 0.9783,
        recall: 0.9783,
        f1: 0.9783,
        ROC_AUC: 0.9948,
        PR_AUC: 0.9971,
        Best_Threshold:0.76,
        MCC:0.9383,
      },
      {
        name: "Xgboost",
        accuracy: 0.9296,
        precision: 0.9020,
        recall: 1.0,
        f1: 0.9485,
        ROC_AUC: 0.9617,
        PR_AUC: 0.9743,
        Best_Threshold:0.35,
        MCC:0.8495,
      },
      {
        name: "Lightgbm",
        accuracy: 0.6479,
        precision: 0.6479,
        recall: 1.0,
        f1: 0.7863,
        ROC_AUC: 0.5,
        PR_AUC: 0.8239,
        Best_Threshold:0.5,
        MCC:0,
      },
      {
        name: "Catboost",
        accuracy: 0.9296,
        precision: 0.9020,
        recall: 1.0,
        f1: 0.9485,
        ROC_AUC: 0.9826,
        PR_AUC: 0.9903,
        Best_Threshold:0.24,
        MCC:0.8495,
      },
      {
        name: "MLP",
        accuracy: 0.9014,
        precision: 0.8679,
        recall: 1.0,
        f1: 0.9293,
        ROC_AUC: 0.96,
        PR_AUC: 0.9761,
        Best_Threshold:0.64,
        MCC:0.7905,
      },
      {
        name: "KNN",
        accuracy: 0.9296,
        precision: 0.9184,
        recall: 0.9783,
        f1: 0.9474,
        ROC_AUC: 0.9635,
        PR_AUC: 0.9796,
        Best_Threshold:0.76,
        MCC:0.8451,
      },
      {
        name: "Extra_trees",
        accuracy: 0.8873,
        precision: 0.9524,
        recall: 0.8696,
        f1: 0.9091,
        ROC_AUC: 0.9974,
        PR_AUC: 0.9869,
        Best_Threshold:0.68,
        MCC:0.7672,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.9014,
        precision: 0.8679,
        recall: 1.0,
        f1: 0.9293,
        ROC_AUC: 0.9713,
        PR_AUC: 0.9801,
        Best_Threshold:0.25,
        MCC:0.7905,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.8732,
        precision: 0.8364,
        recall: 1.0,
        f1: 0.9109,
        ROC_AUC: 0.9626,
        PR_AUC: 0.9769,
        Best_Threshold:0.32,
        MCC:0.7316,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.9014,
        precision: 0.8980,
        recall: 0.9565,
        f1: 0.9263,
        ROC_AUC: 0.9487,
        PR_AUC: 0.9669,
        Best_Threshold:0.91,
        MCC:0.7814,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.6901,
        precision: 0.8158,
        recall: 0.6739,
        f1: 0.7381,
        ROC_AUC: 0.8070,
        PR_AUC: 0.8750,
        Best_Threshold:0.38,
        MCC:0.3772,
      },
      {
        name: "LDA",
        accuracy: 0.8451,
        precision: 0.8070,
        recall: 1.0,
        f1: 0.8932,
        ROC_AUC: 0.9165,
        PR_AUC: 0.9368,
        Best_Threshold:0.23,
        MCC:0.6723,
      },
      { name: "QDA", 
        accuracy: 0.9437, 
        precision: 0.92, 
        recall: 1.0, 
        f1: 0.9583,
        ROC_AUC: 0.9887,
        PR_AUC: 0.9935,
        Best_Threshold:0.99, 
        MCC:0.8791,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "MCC", base: 70, stack: 82 },
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
      { name: "> 50K", value: 37155, percentage: "76.1%", color: "#93b5c6" },
      { name: "≤ 50K", value: 11687, percentage: "23.9%", color: "#d7816a" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.8407,
        precision: 0.6539,
        recall: 0.7104,
        f1: 0.6810,
        ROC_AUC: 0.9030,
        PR_AUC: 0.7579,
        Best_Threshold:0.37,
        MCC:0.5760,
      },
      {
        name: "Decision_tree",
        accuracy: 0.7456,
        precision: 0.4810,
        recall: 0.7956,
        f1: 0.5995,
        ROC_AUC: 0.8373,
        PR_AUC: 0.6181,
        Best_Threshold:0.26,
        MCC:0.4585,
      },
      {
        name: "Random_forest",
        accuracy: 0.8577,
        precision: 0.7178,
        recall: 0.6681,
        f1: 0.6921,
        ROC_AUC: 0.9128,
        PR_AUC: 0.7900,
        Best_Threshold:0.41,
        MCC:0.6004,
      },
      {
        name: "SVM",
        accuracy: 0.7061,
        precision: 0.3435,
        recall: 0.2502,
        f1: 0.2895,
        ROC_AUC: 0.5376,
        PR_AUC: 0.2897,
        Best_Threshold:0.25,
        MCC:0.1122,
      },
      {
        name: "Xgboost",
        accuracy: 0.8730,
        precision: 0.7510,
        recall: 0.7019,
        f1: 0.7256,
        ROC_AUC: 0.9278,
        PR_AUC: 0.8269,
        Best_Threshold:0.44,
        MCC:0.6437,
      },
      {
        name: "Lightgbm",
        accuracy: 0.8713,
        precision: 0.7556,
        recall: 0.6835,
        f1: 0.7177,
        ROC_AUC: 0.9280,
        PR_AUC: 0.8268,
        Best_Threshold:0.46,
        MCC:0.6360,
      },
      {
        name: "Catboost",
        accuracy: 0.8719,
        precision: 0.7713,
        recall: 0.6608,
        f1: 0.7118,
        ROC_AUC: 0.9263,
        PR_AUC: 0.8238,
        Best_Threshold:0.47,
        MCC:0.6632,
      },
      {
        name: "MLP",
        accuracy: 0.8573,
        precision: 0.6967,
        recall: 0.7151,
        f1: 0.7058,
        ROC_AUC: 0.9166,
        PR_AUC: 0.7953,
        Best_Threshold:0.37,
        MCC:0.6117,
      },
      {
        name: "KNN",
        accuracy: 0.8390,
        precision: 0.6562,
        recall: 0.6873,
        f1: 0.6714,
        ROC_AUC: 0.8992,
        PR_AUC: 0.7471,
        Best_Threshold:0.41,
        MCC:0.5651,
      },
      {
        name: "Extra_trees",
        accuracy: 0.8441,
        precision: 0.6353,
        recall: 0.7562,
        f1: 0.6905,
        ROC_AUC: 0.9029,
        PR_AUC: 0.7481,
        Best_Threshold:0.35,
        MCC:0.5857,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.8700,
        precision: 0.7636,
        recall: 0.6617,
        f1: 0.7090,
        ROC_AUC: 0.9925,
        PR_AUC: 0.8215,
        Best_Threshold:0.47,
        MCC:0.6285,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.8720,
        precision: 0.7906,
        recall: 0.6330,
        f1: 0.7031,
        ROC_AUC: 0.9269,
        PR_AUC: 0.8254,
        Best_Threshold:0.52,
        MCC:0.6291,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.6661,
        precision: 0.4108,
        recall: 0.9098,
        f1: 0.5660,
        ROC_AUC: 0.8516,
        PR_AUC: 0.7054,
        Best_Threshold:0.99,
        MCC:0.4267,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.8228,
        precision: 0.6246,
        recall: 0.6506,
        f1: 0.6373,
        ROC_AUC: 0.8784,
        PR_AUC: 0.7105,
        Best_Threshold:0.82,
        MCC:0.5204,
      },
      {
        name: "LDA",
        accuracy: 0.8207,
        precision: 0.6005,
        recall: 0.7485,
        f1: 0.6664,
        ROC_AUC: 0.8896,
        PR_AUC: 0.7727,
        Best_Threshold:0.29,
        MCC:0.5520,
      },
      {
        name: "QDA",
        accuracy: 0.7990,
        precision: 0.5597,
        recall: 0.7498,
        f1: 0.6410,
        ROC_AUC: 0.8741,
        PR_AUC: 0.6753,
        Best_Threshold:0.26,
        MCC:0.5158,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "MCC", base: 70, stack: 82 },
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
      { name: "Potable", value: 1278, percentage: "39%", color: "#93b5c6" },
      { name: "Not potable", value: 1998, percentage: "61%", color: "#d7816a" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.6037,
        precision: 0.4444,
        recall: 0.0154,
        f1: 0.0299,
        ROC_AUC: 0.4869,
        PR_AUC: 0.3962,
        Best_Threshold:0.46,
        MCC:0.0120,
      },
      {
        name: "Decision_tree",
        accuracy: 0.5625,
        precision: 0.4568,
        recall: 0.5714,
        f1: 0.5077,
        ROC_AUC: 0.5885,
        PR_AUC: 0.5231,
        Best_Threshold:0.45,
        MCC:0.1252,
      },
      {
        name: "Random_forest",
        accuracy: 0.6067,
        precision: 0.5021,
        recall: 0.4595,
        f1: 0.4798,
        ROC_AUC: 0.5986,
        PR_AUC: 0.5110,
        Best_Threshold:0.39,
        MCC:0.1651,
      },
      {
        name: "SVM",
        accuracy: 0.3948,
        precision: 0.3948,
        recall: 1.0,
        f1: 0.5661,
        ROC_AUC: 0.5,
        PR_AUC: 0.6974,
        Best_Threshold:0.5,
        MCC:0,
      },
      {
        name: "Xgboost",
        accuracy: 0.6494,
        precision: 0.6306,
        recall: 0.2703,
        f1: 0.3784,
        ROC_AUC: 0.6325,
        PR_AUC: 0.5698,
        Best_Threshold:0.45,
        MCC:0.2177,
      },
      {
        name: "Lightgbm",
        accuracy: 0.6326,
        precision: 0.5833,
        recall: 0.2432,
        f1: 0.3433,
        ROC_AUC: 0.6331,
        PR_AUC: 0.5596,
        Best_Threshold:0.44,
        MCC:0.1712,
      },
      {
        name: "Catboost",
        accuracy: 0.6418,
        precision: 0.5741,
        recall: 0.3591,
        f1: 0.4418,
        ROC_AUC: 0.6296,
        PR_AUC: 0.5680,
        Best_Threshold:0.53,
        MCC:0.2100,
      },
      {
        name: "MLP",
        accuracy: 0.6753,
        precision: 0.6075,
        recall: 0.5019,
        f1: 0.5497,
        ROC_AUC: 0.6933,
        PR_AUC: 0.6213,
        Best_Threshold:0.48,
        MCC:0.3027,
      },
      {
        name: "KNN",
        accuracy: 0.6509,
        precision: 0.7083,
        recall: 0.1969,
        f1: 0.3082,
        ROC_AUC: 0.6503,
        PR_AUC: 0.5909,
        Best_Threshold:0.43,
        MCC:0.2252,
      },
      {
        name: "Extra_trees",
        accuracy: 0.4619,
        precision: 0.4173,
        recall: 0.9151,
        f1: 0.5732,
        ROC_AUC: 0.5762,
        PR_AUC: 0.4963,
        Best_Threshold:0.38,
        MCC:0.1166,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.5259,
        precision: 0.4409,
        recall: 0.7490,
        f1: 0.5551,
        ROC_AUC: 0.5961,
        PR_AUC: 0.5024,
        Best_Threshold:0.35,
        MCC:0.1346,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.6189,
        precision: 0.5634,
        recall: 0.2162,
        f1: 0.3146,
        ROC_AUC: 0.6290,
        PR_AUC: 0.5557,
        Best_Threshold:0.47,
        MCC:0.1639,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.6189,
        precision: 0.5634,
        recall: 0.1544,
        f1: 0.2424,
        ROC_AUC: 0.5728,
        PR_AUC: 0.4901,
        Best_Threshold:0.57,
        MCC:0.1201,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.4710,
        precision: 0.4154,
        recall: 0.8340,
        f1: 0.5546,
        ROC_AUC: 0.5309,
        PR_AUC: 0.4183,
        Best_Threshold:0.34,
        MCC:0.0823,
      },
      {
        name: "LDA",
        accuracy: 0.6037,
        precision: 0.4444,
        recall: 0.0154,
        f1: 0.0299,
        ROC_AUC: 0.4869,
        PR_AUC: 0.3963,
        Best_Threshold:0.46,
        MCC:0.0120,
      },
      {
        name: "QDA",
        accuracy: 0.6753,
        precision: 0.6667,
        recall: 0.3552,
        f1: 0.4635,
        ROC_AUC: 0.6992,
        PR_AUC: 0.6239,
        Best_Threshold:0.47,
        MCC:0.2871,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "MCC", base: 70, stack: 82 },
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
      { name: "Çerçevelik", value: 1300, percentage: "52%", color: "#93b5c6" },
      { name: "Ürgüp Sivrisi", value: 1200, percentage: "48%", color: "#d7816a" },
    ],
    //實驗結果-基礎模型訓練表現(已改)
    models: [
      {
        name: "Logistic_regression",
        accuracy: 0.87,
        precision: 0.9078,
        recall: 0.8140,
        f1: 0.8584,
        ROC_AUC: 0.9316,
        PR_AUC: 0.9392,
        Best_Threshold:0.36,
        MCC:0.7427,
      },
      {
        name: "Decision_tree",
        accuracy: 0.866,
        precision: 0.8692,
        recall: 0.8512,
        f1: 0.8601,
        ROC_AUC: 0.9160,
        PR_AUC: 0.9139,
        Best_Threshold:0.13,
        MCC:0.7317,
      },
      {
        name: "Random_forest",
        accuracy: 0.888,
        precision: 0.9043,
        recall: 0.8595,
        f1: 0.8814,
        ROC_AUC: 0.9316,
        PR_AUC: 0.9355,
        Best_Threshold:0.3,
        MCC:0.7763,
      },
      {
        name: "SVM",
        accuracy: 0.434,
        precision: 0.4319,
        recall: 0.5372,
        f1: 0.4788,
        ROC_AUC: 0.4358,
        PR_AUC: 0.5949,
        Best_Threshold:0.1,
        MCC:-0.1282,
      },
      {
        name: "Xgboost",
        accuracy: 0.88,
        precision: 0.8922,
        recall: 0.8554,
        f1: 0.8734,
        ROC_AUC: 0.9335,
        PR_AUC: 0.9392,
        Best_Threshold:0.65,
        MCC:0.7601,
      },
      {
        name: "Lightgbm",
        accuracy: 0.876,
        precision: 0.875,
        recall: 0.8678,
        f1: 0.8714,
        ROC_AUC: 0.9355,
        PR_AUC: 0.9389,
        Best_Threshold:0.45,
        MCC:0.7517,
      },
      {
        name: "Catboost",
        accuracy: 0.882,
        precision: 0.9067,
        recall: 0.8430,
        f1: 0.8737,
        ROC_AUC: 0.9363,
        PR_AUC: 0.9427,
        Best_Threshold:0.56,
        MCC:0.7650,
      },
      {
        name: "MLP",
        accuracy: 0.8,
        precision: 0.8817,
        recall: 0.6777,
        f1: 0.7664,
        ROC_AUC: 0.8219,
        PR_AUC: 0.8617,
        Best_Threshold:0.58,
        MCC:0.6125,
      },
      {
        name: "KNN",
        accuracy: 0.7157,
        precision: 0.3017,
        recall: 0.4244,
        f1: 0.424,
        ROC_AUC: 0.6623,
        PR_AUC: 0.6770,
        Best_Threshold:0.56,
        MCC:0.2347,
      },
      {
        name: "Extra_trees",
        accuracy: 0.87,
        precision: 0.8583,
        recall: 0.8760,
        f1: 0.8671,
        ROC_AUC: 0.9291,
        PR_AUC: 0.9363,
        Best_Threshold:0.2,
        MCC:0.7400,
      },
      {
        name: "Gradient_boosting",
        accuracy: 0.878,
        precision: 0.8851,
        recall: 0.8595,
        f1: 0.8721,
        ROC_AUC: 0.9335,
        PR_AUC: 0.9383,
        Best_Threshold:0.47,
        MCC:0.7558,
      },
      {
        name: "Hist_gradient_boosting",
        accuracy: 0.874,
        precision: 0.8908,
        recall: 0.8430,
        f1: 0.8662,
        ROC_AUC: 0.9345,
        PR_AUC: 0.9356,
        Best_Threshold:0.5,
        MCC:0.7483,
      },
      {
        name: "Gaussian_nb",
        accuracy: 0.792,
        precision: 0.7974,
        recall: 0.7645,
        f1: 0.7806,
        ROC_AUC: 0.8652,
        PR_AUC: 0.8640,
        Best_Threshold:0.31,
        MCC:0.5835,
      },
      {
        name: "Bernoulli_nb",
        accuracy: 0.85,
        precision: 0.8615,
        recall: 0.8223,
        f1: 0.8414,
        ROC_AUC: 0.8888,
        PR_AUC: 0.8961,
        Best_Threshold:0.2,
        MCC:0.6999,
      },
      {
        name: "LDA",
        accuracy: 0.87,
        precision: 0.8865,
        recall: 0.8388,
        f1: 0.8620,
        ROC_AUC: 0.9341,
        PR_AUC: 0.9421,
        Best_Threshold:0.54,
        MCC:0.7403,
      },
      {
        name: "QDA",
        accuracy: 0.856,
        precision: 0.8935,
        recall: 0.7975,
        f1: 0.8428,
        ROC_AUC: 0.9075,
        PR_AUC: 0.9144,
        Best_Threshold:0.98,
        MCC:0.7147,
      },
    ],
    radar: [
      { metric: "Accuracy", base: 83, stack: 88 },
      { metric: "Precision", base: 81, stack: 87 },
      { metric: "Recall", base: 80, stack: 86 },
      { metric: "F1", base: 81, stack: 87 },
      { metric: "MCC", base: 70, stack: 82 },
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
  },
};

// 核心方法論 - 基礎模型池
const baseModels = [
  {
    id:"lr",
    name: "Logistic Regression",
    short:"線性分類",
    desc: "假設數據服從伯努利分佈，通過極大化似然函數的方法，運用梯度下降來求解參數，來達到將數據二分類的目的。",
  },
  {
    id:"dt",
    name: "Decision Tree",
    short: "樹狀分類",
    desc: "透過所有特徵與對應的值將資料切分，來找出最適合的分枝並繼續往下拓展，可解釋性高，但較容易產生過擬合。",
  },
  {
    id:"rf",
    name: "Random Forest",
    short: "集成樹",
    desc: "由多棵決策樹組成，使用 Bagging 加上隨機特徵採樣的方法所產生出來的整體學習演算法，讓結果較不容易過擬合，並使得預測能力更提升。"
  },
  {
    id:"s",
    name: "SVM",
    short: "間隔分類",
    desc: "透過找出一條分隔線使所有在邊界上的點離得越遠越好，使模型抵抗雜訊的能力更佳。",
  },
  {
    id:"xg",
    name: "XGBoost",
    short: "梯度提升",
    desc: "基於 Gradient Boosting 的強化模型，結合特徵隨機採樣、標準化與一、二階導數最佳化，具備高預測能力與良好泛化表現。",
  },
  {
    id:"lgbm",
    name: "LightGBM",
    short: "高效提升",
    desc: "以決策樹為基礎的高效梯度提升模型，具備訓練快速、低記憶體消耗與良好準確度，適合大規模資料分析。",
  },
  {
    id:"cat",
    name: "CatBoost",
    short: "類別增強",
    desc: "基於 Gradient Boosting Tree 的梯度提升樹模型框架，能自動處理類別特徵與缺失值，並支援多種資料型態與 CPU/GPU 運算，兼具高效能與良好泛化能力。",
  },
  {
    id:"m",
    name: "MLP",
    short: "神經網路",
    desc: "多層感知器透過前向與反向傳播學習非線性高維資料，適合複雜分類模式辨識。",
  },
  {
    id:"k",
    name: "KNN",
    short: "鄰近分類",
    desc: "採多數決標準，依據樣本鄰近距離進行分類，概念直觀，但對資料尺度較敏感。",
  },
  {
    id:"et",
    name: "Extra Trees",
    short: "集成樹",
    desc: "與隨機森林類似，但隨機選擇切割點，可提升訓練速度、穩定性與泛化能力。",
  },
  {
    id:"gb",
    name: "Gradient Boosting",
    short: "逐步提升",
    desc: "透過迭代方式逐步修正前一模型的預測誤差，進而建立具良好預測能力的強分類器",
  },
  {
    id:"hgb",
    name: "HistGradientBoosting",
    short: "直方提升",
    desc: "基於梯度提升決策樹，透過直方圖分箱加速訓練，能高效處理大規模與高維稀疏資料。",
  },
  {
    id:"gnb",
    name: "Gaussian NB",
    short: "機率分類",
    desc: "假設特徵相互獨立且服從高斯分布，具訓練快速、簡單高效與適合作為基準模型的特性。",
  },
  {
    id:"bnb",
    name: "Bernoulli NB",
    short: "二元機率",
    desc: "假設特徵相互獨立且服從伯努利分布，具簡單高效且適合二元特徵分類的特性。",
  },
  {
    id:"l",
    name: "LDA",
    short: "線性判別",
    desc: "透過線性投影最大化類別間差異並最小化類別內差異，兼具降維與分類能力。",
  },
  {
    id:"q",
    name: "QDA",
    short: "二次判別",
    desc: "為 LDA 的延伸，透過各類別獨立協方差矩陣建立非線性決策邊界，適合較複雜分布資料。",
  },
];

//將每個基礎模型加上各自type
const baseModelsWithType = baseModels.map(model => {
  if (["lr"].includes(model.id)) return { ...model, type: "線性模型" };
  if (["dt", "rf", "et"].includes(model.id)) return { ...model, type: "樹狀與集成模型" };
  if (["xg", "lgbm", "cat", "gb", "hgb"].includes(model.id)) return { ...model, type: "Boosting 模型" };
  if (["k"].includes(model.id)) return { ...model, type: "距離與鄰近模型" };
  if (["s", "m"].includes(model.id)) return { ...model, type: "核方法與神經網路" };
  if (["gnb", "bnb"].includes(model.id)) return { ...model, type: "機率式分類模型" };
  if (["l","q"].includes(model.id)) return { ...model, type: "判別分析模型" };
  return model;
});

// 依 type 分組
const groupedModels = baseModelsWithType.reduce((acc, model) => {
  if (!acc[model.type]) acc[model.type] = [];
  acc[model.type].push(model);
  return acc;
}, {});

//核心方法論-所有方法(Stacking)概述
const stackingMethods = [
  {
    title: "Logistic Regression Stacking",
    desc: "將基礎模型的機率當作特徵，再訓練 LR 學習整合權重。",
  },
  {
    title: "XGBoost Stacking",
    desc: "利用 Boosting 學習更複雜的模型組合方式，提高堆疊效能。",
  },
  {
    title: "CatBoost Stacking",
    desc: "透過 Ordered Boosting 降低過度擬合風險，特別適合中小型資料集的堆疊。",
  },
  {
    title: "投票法 Voting",
    desc: "平均加權方法屬於 Soft Voting，其作法為對所有基礎模型輸出的預測機率給予相同權重，取其平均作為最終預測結果。",
  },
  {
    title: "勝算加權 Odds Weighting",
    desc: "以模型表現（F1）轉換成勝算作為權重，讓強模型的影響力更大。",
  },
  {
    title: "逆變異加權 Inverse Variance Weighting",
    desc: "將變異數作為權重，提升堆疊的效能。",
  },
];

//數據與流程-整體流程
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
    panelText:
      "我們藉由以下16種不同的基礎模型進行訓練，目的是優化堆疊模型之強健性並降低預測偏誤。",
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
    desc: "將弱模型篩選並排除，以降低其對堆疊模型整體表現的干擾。",
    panelTitle: "模型排序與篩選程序",
    panelDesc:
      "透過排序剔除弱模型，並結合多指標篩選代表性模型，以提升堆疊模型的穩定性與整體效能。",
    methods: [
    {
      title: "方法一：F1 排序篩選法",
      desc: "依基礎模型結果中的 F1 分數由高至低排序，透過陡坡圖辨識陡降區段，排除表現明顯下降之模型，以降低弱模型對堆疊結果的干擾。",
    },
    {
      title: "方法二：四值取法",
      desc: "分別選取在 Precision、Recall、PR-AUC 與 ROC-AUC 指標下表現最佳之模型納入堆疊，以保留不同評估面向下具代表性的模型，提升整體預測能力。",
    },
  ],
  },
  {
    id: "integration",
    short: "整合",
    title: "Stacking 與加權融合",
    desc: "將篩選出來的基礎模型輸出作為 meta 特徵或機率加權來源，建立最終整合模型。",
    panelTitle: "模型整合程序",
    panelDesc: "透過多模型融合提升最終分類表現",
    panelText:
      "我們採用以下六種方法進行模型堆疊，以降低模型波動並提升整體分類表現，並期望所提出的勝算堆疊方法能展現更佳效能。",
    stackingMethods: [
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
    desc: "從單一模型、堆疊整合模型與跨資料集層面觀察研究發現與應用價值。",
    panelTitle: "結果分析與研究詮釋",
    panelDesc: "從模型表現與跨資料集差異整理研究發現",
  },
];

//數據與流程-基礎模型訓練流程
const baseTrainingSteps = [
  {
    id: "base-split",
    short: "切分",
    title: "資料切分與前處理管線建立",
    desc: "將資料切分為訓練集與測試集，並依資料型態建立對應前處理流程。",
    panelTitle: "基礎模型訓練：資料切分與前處理",
    panelDesc: "先建立一致的輸入條件，再進行模型訓練。",
    panelItems: [
      "切割訓練集與測試集（8:2），再將訓練集切成訓練集與驗證集(8:2)",
      "數值欄位標準化與分布修正",
      "類別欄位編碼與格式轉換",
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

//數據與流程-堆疊流程
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
              <div className="font-semibold text-slate-900 md:text-2xl">
                兩分類資料堆疊整合學習器
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
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
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
              兩分類資料堆疊整合學習器
              <span className="block text-[#d7816a]">
                Two-Classification Data Stack Integrated Learner
              </span>
            </h1>           
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-3xl">
              指導教授:李名鏞
            </p>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-1xl">
              專題組員:許博翔、顏畯榤、張妍婷、柯廷翰、陳宗揚、葉芷儀、韋葶妤、倪佩榆
            </p>          
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
            <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <Microscope className="h-5 w-5 text-[#93b5c6]" /> 摘要
                </CardTitle>
                <CardDescription className="text-slate-600">
                  研究核心概念與整體方向
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
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
                  單一模型在不同資料集上的穩定性有限，因此希望透過堆疊整合學習降低模型波動，提升分類表現。我們提出了勝算加權方法以及逆變異數加權方法，透過直接且解釋性高的加權方式來提升
                  兩分類資料的分類準確度。
                </CardContent>
              </Card>
              <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">研究目的</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-slate-600">
                  本研究旨在針對二元分類問題，提出一種「基於勝算的堆疊演算法」（Odds-Based Stacking Algorithm）。
                  該方法透過計算k個基礎模型之預測勝算（Odds）及其比例關係，將其轉化為堆疊過程中的加權依據，進而建構具備統計解釋性的水平堆疊（Horizontal Stacking）機制。
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
                ? "bg-[#93b5c6] text-white" //被選中
                : "bg-[#efe8dc] text-slate-500" //未選中
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
              className={`flex h-10 shrink-0  aspect-square items-center justify-center rounded-full transition-all ${
                activeStep === step.id
                  ? "bg-[#93b5c6] text-white"
                  : "bg-[#efe8dc] text-slate-500"
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
                      {step.panelText &&
                        !["模型排序與篩選策略", "結果分析與研究詮釋"].includes(step.panelTitle) && (
                          <p className="text-sm leading-relaxed text-slate-600 bg-[#ddedaa]/35 p-4 rounded-2xl border border-[#93b5c6]/12">
                            {step.panelText}
                          </p>
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
                      {step.stackingMethods && (
                        <div className="space-y-3">
                          <h3 className="text-base font-semibold text-slate-900">
                            Stacking 方法
                          </h3>

                          <div className="flex flex-wrap gap-2">
                            {step.stackingMethods.map((method, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-md bg-[#f7f3ec]  text-slate-700 text-sm border border-[#93b5c6]/20"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {step.methods && (
                        <div className="space-y-8">
                          {step.methods.map((method, idx) => (
                            <div key={idx} className="space-y-4">
                              {/* 方法標題 */}
                              <h3 className="text-base font-semibold text-slate-900">
                                {method.title}
                              </h3>
                              {/* 方法說明 */}
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {method.desc}
                              </p>
                            </div>
                          ))}
                        </div>
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
                        !step.links && 
                        !["模型排序與篩選程序", "結果分析與研究詮釋"].includes(step.panelTitle) && (
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

//核心方法論頁面
function MethodPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="核心方法論"
        title="Stacking 概述、LaTeX 公式與元學習器策略"
        description="這個區塊以論文展示頁的方式呈現方法：先說明概念，再用 LaTeX 公式表達，最後補上模型選擇邏輯。"
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader><CardTitle>基礎模型池</CardTitle><CardDescription>納入多樣化基礎分類器，提升堆疊整合時的模型異質性與泛化能力</CardDescription></CardHeader>
          <CardContent className="space-y-10 max-h-[360px] overflow-y-auto pr-2">
            {Object.entries(groupedModels).map(([type, models]) => (
              <section key={type}>
                {/* 區塊標題 */}
                <h3 className="text-lg font-bold text-slate-800 mb-4">{type}</h3>
                {/* 模型列表 */}
                <div className="space-y-6">
                  {models.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-[22px] border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-semibold text-slate-800">{m.name}</h4>
                          <p className="mt-1 text-xs font-medium tracking-wide text-slate-500"></p>
                        </div>
                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">{m.short}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>模型篩選策略</CardTitle>
            <CardDescription>本研究透過兩種模型篩選方法，挑選表現較佳之基礎模型，並將其納入後續堆疊模型建構。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-6 text-slate-600 max-h-[360px] overflow-y-auto pr-2">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-slate-800">
                方法一：F1 排序篩選法
              </h3>
              <p>
                依據基礎模型的 F1 進行由高到低排序，並觀察分數下降幅度。
                當下降幅度出現明顯轉折時，將該區段之後的模型排除，不納入堆疊學習。
              </p>
              <img
                src="/陡坡圖.png"
                alt="F1篩選法示意圖"
                className="rounded-xl border border-slate-200 shadow-sm"
              />
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-800">
                  方法二：四值取法
                </h3>
                <p>
                  分別選取基礎模型中四項指標表現最佳者：
                  Precision、Recall、PR-AUC 及 ROC-AUC，
                  作為堆疊模型的輸入基礎模型集合。
                </p>
                <img
                  src="/4rank.png"
                  alt="四值篩選法示意圖"
                  className="rounded-xl border border-slate-200 shadow-sm"
                />
              </div>
            </div>     
          </CardContent>
        </Card>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader><CardTitle className="text-xl">所有方法（Stacking）概述</CardTitle></CardHeader>
          <CardContent className="grid gap-3 max-h-[360px] overflow-y-auto pr-2">
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
      </div>      
    </section>
  );
}

const stackingModels = [
  { id: "stack_odds", name: " Odds Weighting Stacking" },
  { id: "stack_avg", name: "Average Stacking" },
  { id: "stack_inv_var", name: "Inverse Variance Weighting Stacking" },
  { id: "stack_logistic", name: "Logistic Regression Stacking" },
  { id: "stack_catboost", name: "CatBoost Stacking" },
  { id: "stack_xgboost", name: "XGBoost Stacking" },
];


function ConfusionMatrixCard({ title, result, rows }) {
  if (!result) {
    return (
      <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
            找不到對應的混淆矩陣資料
          </div>
        </CardContent>
      </Card>
    );
  }

  const cells = [
    { label: "TN", value: result.TN, highlight: true },
    { label: "FP", value: result.FP, highlight: false },
    { label: "FN", value: result.FN, highlight: false },
    { label: "TP", value: result.TP, highlight: true },
  ];

  return (
    <Card className="rounded-[32px] border border-white/70 bg-white/85 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-start gap-3">
          <div>
            <h3 className="text-[32px] font-bold tracking-tight text-slate-900">
              混淆矩陣比較
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {title} ｜ {result.Model} ｜ {result.Strategy}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {cells.map((cell) => (
            <div
              key={cell.label}
              className={`rounded-[26px] px-6 py-7 ${
                cell.highlight
                  ? "bg-[#9bb6c7] text-white"
                  : "bg-[#e9edf2] text-slate-900"
              }`}
            >
              <div
                className={`text-[16px] ${
                  cell.highlight ? "text-white/85" : "text-slate-600"
                }`}
              >
                {cell.label}
              </div>
              <div className="mt-3 text-[48px] font-bold leading-none tracking-tight tabular-nums">
                {cell.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

//研究流程頁面
function ResearchPage() {
  const [datasetKey, setDatasetKey] = useState("personality");
  const [modelType, setModelType] = useState("base");
  const [metric, setMetric] = useState("f1rank7");
  const [selectedModel, setSelectedModel] = useState(null);

  const current = datasetMeta?.[datasetKey] || {};
  
  const datasetNameMap = {
  personality: "behavior",
  german: "german",
  sonar: "sonar",
  cancer: "cancer",
  I: "ionosphere",
  Income: "adult",
  water: "water",
  pumpkin: "pumpkin",
  };

  const jsonDatasetName = datasetNameMap[datasetKey];

  const datasetResults = useMemo(() => {
   return allStackingResults.filter((row) => row.Dataset === jsonDatasetName);
  }, [jsonDatasetName]);

  const bestBaseResult = useMemo(() => {
    return datasetResults
      .filter((row) => row.Type === "base")
      .sort((a, b) => (b.F1 - a.F1) || (b.MCC - a.MCC))[0] || null;
  }, [datasetResults]);

  const bestStackResult = useMemo(() => {
    return datasetResults
      .filter((row) => row.Type === "stack")
      .sort((a, b) => (b.F1 - a.F1) || (b.MCC - a.MCC))[0] || null;
  }, [datasetResults]);

  const toConfusionRows = (result) => {
    if (!result) return [];
    return [
      {
        actual: "Negative",
        predictedNegative: result.TN,
        predictedPositive: result.FP,
      },
      {
        actual: "Positive",
        predictedNegative: result.FN,
        predictedPositive: result.TP,
      },
    ];
  };

  const bestBaseConfusionRows = useMemo(
    () => toConfusionRows(bestBaseResult),
    [bestBaseResult]
  );

  const bestStackConfusionRows = useMemo(
    () => toConfusionRows(bestStackResult),
    [bestStackResult]
  );
  
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

  
  
  const metrics = Object.keys(
    current.confusionMatrix?.[modelType] || {}
  );

  // model list
  const modelOptions = Object.keys(
    current?.confusionMatrix?.[modelType]?.[metric] || {}
  );

  // auto select first model
  useEffect(() => {
    if (modelOptions.length > 0) {
      setSelectedModel(modelOptions[0]);
    }else {
      setSelectedModel(null);
    }
  }, [modelOptions]);

  const cm = current.confusionMatrix?.[modelType]?.[metric]?.[selectedModel]?.cm;

  const confusionCells = useMemo(() => {
    if (!cm) return [];

    const [[TN, FP], [FN, TP]] = cm;

    return [
      { label: "TN", value: TN },
      { label: "FP", value: FP },
      { label: "FN", value: FN },
      { label: "TP", value: TP },
    ];
  }, [cm]);

  const lineData = useMemo(() => {
  return [...current.models].sort((a, b) => b.f1 - a.f1);
  }, [datasetKey]);
  const lineData2 = useMemo(() => {
  return [...current.models].sort((a, b) => b.precision - a.precision);
  }, [datasetKey]);

  console.log("modelOptions =", modelOptions);
  console.log("metric =", metric);
  console.log("modelType =", modelType);
  console.log("current =", current);

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
        <Card className="rounded-[24px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="h-5 w-5 text-[#93b5c6]" />
              資料集介紹
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
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
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
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
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length || !payload[0]?.payload) {
                        return null;
                      }

                      const data = payload[0].payload;

                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          }}
                        > 
                          <p
                            style={{
                              margin: 0,
                              color: data.color,
                              fontSize: "14px",
                              fontWeight: "500",//字體的粗度(越往上越粗)
                            }}
                          >
                            {data.name}{"： "}{data.value}{" ("}{data.percentage}{")"}
                          </p>
                        </div>
                      );
                    }}
                  />
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
                    <th className="px-4 py-3 font-medium">ROC_AUC</th>
                    <th className="px-4 py-3 font-medium">PR_AUC</th>
                    <th className="px-5 py-3 font-medium">MCC</th>
                    <th className="px-4 py-3 font-medium">Best_Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-600">
                  {current.models.map((row) => (
                    <tr key={row.name}> 
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.name}
                      </td>
                      <td className="px-5 py-3">{row.accuracy.toFixed(4)}</td>
                      <td className="px-5 py-3">{row.precision.toFixed(4)}</td>
                      <td className="px-5 py-3">{row.recall.toFixed(4)}</td>
                      <td className="px-4 py-3 font-semibold text-[#d7816a]">
                        {row.f1.toFixed(4)}
                      </td>
                      <td className="px-5 py-3">{row.ROC_AUC.toFixed(4)}</td>
                      <td className="px-5 py-3">{row.PR_AUC.toFixed(4)}</td>
                      <td className="px-6 py-3">{row.MCC.toFixed(4)}</td>
                      <td className="px-6 py-3">{row.Best_Threshold.toFixed(2)}</td>
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
                {/*"F1的顏色：text-[#d7816a]"*/ }
                <div className="text-slate-600">
                  F1 = {bestModel?.f1.toFixed(4)}
                </div>
                <div className="text-slate-600">
                  ROC AUC = {bestModel?.ROC_AUC?.toFixed(4)}
                </div>
                <div className="text-slate-600">
                  PR AUC = {bestModel?.PR_AUC?.toFixed(4)}
                </div>
              </div>
              <div className="rounded-2xl bg-[#f5efe4] p-4 shadow-sm">
                <div className="text-slate-500">最差表現</div>
                <div className="mt-1 text-xl font-bold text-slate-900">
                  {worstModel?.name}
                </div>
                <div className="text-slate-600">
                  F1 = {worstModel?.f1.toFixed(4)}
                </div>
                <div className="text-slate-600">
                  ROC AUC = {worstModel?.ROC_AUC?.toFixed(4)}
                </div>
                <div className="text-slate-600">
                  PR AUC = {worstModel?.PR_AUC?.toFixed(4)}
              </div>
            </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 leading-7">
              基礎模型結果會隨資料集切換同步更新，可直接拿來對照下方堆疊模型分析是否真的帶來穩定提升。
            </div>
          </CardContent>
        </Card>
      </div>

      {/*模型 F1 比較圖*/}
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

        {/*Precision / Recall 對比圖*/ }
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Precision / Recall 對比圖</CardTitle>
            <CardDescription>
              觀察不同模型在預測率與召回率上的取捨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto py-4">
              <div className="min-w-[1200px] px-6">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={lineData2}
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
                      dataKey="precision"
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
      {/*混淆矩陣*/ }
      <div className="flex gap-3 mt-4">
        {["base", "stacking"].map((type) => (
          <button
            key={type}
            onClick={() => setModelType(type)}
            className={`px-4 py-2 rounded-xl border
              ${modelType === type ? "bg-black text-white" : "bg-white text-gray-600"}
            `}
          >
            {type === "base" ? "Base Model" : "Stacking Model"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {modelOptions.map((id) => (
          <button
            key={id}
            onClick={() => setSelectedModel(id)}
            className={`px-3 py-1 rounded-lg border text-sm
              ${selectedModel === id ? "bg-blue-500 text-white" : "bg-white"}
            `}
          >
            {id}
          </button>
        ))}
      </div>

<div className="mt-6 grid gap-6 lg:grid-cols-2">
  <ConfusionMatrixCard
    title="最佳基礎模型混淆矩陣"
    result={bestBaseResult}
    rows={bestBaseConfusionRows}
  />

  <ConfusionMatrixCard
    title="最佳堆疊模型混淆矩陣"
    result={bestStackResult}
    rows={bestStackConfusionRows}
  />
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
        <div>兩分類資料堆疊整合學習器</div>
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
