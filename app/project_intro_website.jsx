"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
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
  ZAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  ScatterChart,
  Scatter,
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

// Clean dataset metadata and base model results.
// 已移除 radar、confusionMatrix/confusion、roc、pr、oof 等占位資料。
const toModel = ([name, accuracy, precision, recall, f1, ROC_AUC, PR_AUC, Best_Threshold, MCC]) => ({
  name,
  accuracy,
  precision,
  recall,
  f1,
  ROC_AUC,
  PR_AUC,
  Best_Threshold,
  MCC,
});

const datasetMeta = {
  personality: {
    key: "personality",
    label: "Extrovert VS. Introvert Behavior",
    subtitle: "透過行為特徵與人格相關指標，判斷該人為外向(Extrovert)或內向(Introvert)",
    size: "2,900",
    features: "7",
    classData: [
      { name: "Extrovert", value: 1491, percentage: "51.4%", color: "#93b5c6" },
      { name: "Introvert", value: 1409, percentage: "48.6%", color: "#d7816a" },
    ],
    models: [
      toModel(["Logistic_regression", 0.9379, 0.9486, 0.9295, 0.9390, 0.9455, 0.9426, 0.6200, 0.8760]),
      toModel(["Decision_tree", 0.9276, 0.9476, 0.9094, 0.9281, 0.9532, 0.9584, 0.5500, 0.8560]),
      toModel(["Random_forest", 0.9397, 0.9519, 0.9295, 0.9406, 0.9717, 0.9750, 0.8100, 0.8796]),
      toModel(["SVM", 0.9362, 0.9516, 0.9228, 0.9370, 0.9682, 0.9710, 0.9100, 0.8728]),
      toModel(["Xgboost", 0.9397, 0.9519, 0.9295, 0.9406, 0.9723, 0.9771, 0.6200, 0.8796]),
      toModel(["Lightgbm", 0.9345, 0.9514, 0.9195, 0.9352, 0.9681, 0.9730, 0.7200, 0.8695]),
      toModel(["Catboost", 0.9379, 0.9517, 0.9262, 0.9388, 0.9718, 0.9766, 0.7800, 0.8762]),
      toModel(["MLP", 0.9397, 0.9519, 0.9295, 0.9406, 0.9511, 0.9512, 0.0500, 0.8796]),
      toModel(["KNN", 0.9414, 0.9552, 0.9295, 0.9422, 0.9717, 0.9741, 0.8300, 0.8831]),
      toModel(["Extra_trees", 0.9293, 0.9541, 0.9060, 0.9294, 0.9732, 0.9769, 0.8500, 0.8599]),
      toModel(["Gradient_boosting", 0.9397, 0.9519, 0.9295, 0.9406, 0.9723, 0.9773, 0.5500, 0.8796]),
      toModel(["Hist_gradient_boosting", 0.9397, 0.9519, 0.9295, 0.9406, 0.9735, 0.9762, 0.6200, 0.8796]),
      toModel(["Gaussian_nb", 0.9379, 0.9486, 0.9295, 0.9390, 0.9142, 0.9002, 0.0100, 0.8760]),
      toModel(["Bernoulli_nb", 0.9379, 0.9486, 0.9295, 0.9390, 0.9253, 0.9312, 0.0100, 0.8760]),
      toModel(["LDA", 0.9379, 0.9486, 0.9295, 0.9390, 0.9467, 0.9429, 0.6900, 0.8760]),
      toModel(["QDA", 0.9397, 0.9519, 0.9295, 0.9406, 0.9135, 0.8994, 0.0900, 0.8796]),
    ],
    note: "類別比例接近平衡，特徵主要來自行為與社交模式，適合觀察模型是否能穩定捕捉外向與內向的行為差異。",
  },

  german: {
    key: "german",
    label: "German Credit",
    subtitle: "根據客戶的個人與財務相關資料，判斷其信用風險是良好(Good)還是不良(Bad)",
    size: "1,000",
    features: "20",
    classData: [
      { name: "Good", value: 700, percentage: "70%", color: "#93b5c6" },
      { name: "Bad", value: 300, percentage: "30%", color: "#d7816a" },
    ],
    models: [
      toModel(["Logistic_regression", 0.7250, 0.8095, 0.7083, 0.7556, 0.8173, 0.8736, 0.5400, 0.4496]),
      toModel(["Decision_tree", 0.6750, 0.7619, 0.6667, 0.7111, 0.7545, 0.8244, 0.3800, 0.3474]),
      toModel(["Random_forest", 0.7550, 0.7554, 0.8750, 0.8108, 0.8222, 0.8727, 0.4600, 0.4788]),
      toModel(["SVM", 0.7350, 0.8131, 0.7250, 0.7665, 0.8163, 0.8747, 0.7100, 0.4665]),
      toModel(["Xgboost", 0.7350, 0.7965, 0.7500, 0.7725, 0.8264, 0.8723, 0.6900, 0.4570]),
      toModel(["Lightgbm", 0.7650, 0.7874, 0.8333, 0.8097, 0.8108, 0.8536, 0.6200, 0.5046]),
      toModel(["Catboost", 0.7600, 0.7727, 0.8500, 0.8095, 0.8163, 0.8626, 0.4600, 0.4912]),
      toModel(["MLP", 0.7200, 0.8137, 0.6917, 0.7477, 0.7911, 0.8602, 0.8000, 0.4451]),
      toModel(["KNN", 0.6600, 0.8095, 0.5667, 0.6667, 0.7787, 0.8322, 0.7600, 0.3639]),
      toModel(["Extra_trees", 0.7650, 0.7664, 0.8750, 0.8171, 0.8098, 0.8560, 0.3000, 0.5010]),
      toModel(["Gradient_boosting", 0.7250, 0.7982, 0.7250, 0.7598, 0.8173, 0.8653, 0.7000, 0.4427]),
      toModel(["Hist_gradient_boosting", 0.7000, 0.8261, 0.6333, 0.7170, 0.7960, 0.8427, 0.7300, 0.4259]),
      toModel(["Gaussian_nb", 0.7350, 0.7769, 0.7833, 0.7801, 0.7697, 0.8331, 0.3200, 0.4468]),
      toModel(["Bernoulli_nb", 0.7300, 0.7895, 0.7500, 0.7692, 0.7910, 0.8584, 0.6400, 0.4453]),
      toModel(["LDA", 0.7500, 0.8017, 0.7750, 0.7881, 0.8090, 0.8583, 0.6900, 0.4839]),
      toModel(["QDA", 0.6900, 0.7589, 0.7083, 0.7328, 0.7852, 0.8416, 0.7200, 0.3660]),
    ],
    note: "樣本數較少、類別型欄位多且信用風險比例不均，適合觀察 stacking 是否能提升信用風險判斷的穩定性。",
  },

  sonar: {
    key: "sonar",
    label: "Sonar, Mines VS. Rocks",
    subtitle: "根據聲納在不同角度與條件下所接收到的反射訊號，判斷目標物是岩石(Rock)還是金屬圓柱體(Mine)",
    size: "208",
    features: "60",
    classData: [
      { name: "Mine", value: 111, percentage: "53.4%", color: "#93b5c6" },
      { name: "Rock", value: 97, percentage: "46.6%", color: "#d7816a" },
    ],
    models: [
      toModel(["Logistic_regression", 0.7674, 0.8421, 0.6957, 0.7619, 0.8283, 0.7954, 0.5300, 0.5480]),
      toModel(["Decision_tree", 0.7209, 0.6774, 0.9130, 0.7778, 0.7837, 0.8109, 0.3700, 0.4593]),
      toModel(["Random_forest", 0.7907, 0.7500, 0.9130, 0.8235, 0.8826, 0.8893, 0.5000, 0.5892]),
      toModel(["SVM", 0.6977, 0.7778, 0.6087, 0.6829, 0.7717, 0.8252, 0.5200, 0.4132]),
      toModel(["Xgboost", 0.7907, 0.8182, 0.7826, 0.8000, 0.8935, 0.9017, 0.5500, 0.5813]),
      toModel(["Lightgbm", 0.7907, 0.7500, 0.9130, 0.8235, 0.8543, 0.8750, 0.4900, 0.5892]),
      toModel(["Catboost", 0.7907, 0.7500, 0.9130, 0.8235, 0.8717, 0.8712, 0.4800, 0.5892]),
      toModel(["MLP", 0.6512, 0.6053, 1.0000, 0.7541, 0.6696, 0.6574, 0.4400, 0.3890]),
      toModel(["KNN", 0.6279, 0.6400, 0.6957, 0.6667, 0.7239, 0.7905, 0.5100, 0.2484]),
      toModel(["Extra_trees", 0.7907, 0.7692, 0.8696, 0.8163, 0.8696, 0.8640, 0.4900, 0.5810]),
      toModel(["Gradient_boosting", 0.7907, 0.7917, 0.8261, 0.8085, 0.9239, 0.9398, 0.4700, 0.5786]),
      toModel(["Hist_gradient_boosting", 0.9302, 0.9167, 0.9565, 0.9362, 0.9761, 0.9839, 0.4700, 0.8603]),
      toModel(["Gaussian_nb", 0.7442, 0.8000, 0.6957, 0.7442, 0.8130, 0.7530, 0.1000, 0.4957]),
      toModel(["Bernoulli_nb", 0.6512, 0.6538, 0.7391, 0.6939, 0.6957, 0.6758, 0.3300, 0.2950]),
      toModel(["LDA", 0.8372, 0.8636, 0.8261, 0.8444, 0.8326, 0.7944, 0.5200, 0.6746]),
      toModel(["QDA", 0.6744, 0.7368, 0.6087, 0.6667, 0.7457, 0.7859, 0.5400, 0.3603]),
    ],
    note: "典型高維低樣本訊號資料，適合展示 stacking 是否能改善小樣本情境下的模型穩定性。",
  },

  cancer: {
    key: "cancer",
    label: "Breast Cancer Wisconsin Dataset",
    subtitle: "透過腫瘤細胞的檢查特徵，判斷腫瘤是良性(Benign)還是惡性(Malignant)",
    size: "569",
    features: "30",
    classData: [
      { name: "Benign", value: 357, percentage: "62.7%", color: "#93b5c6" },
      { name: "Malignant", value: 212, percentage: "37.3%", color: "#d7816a" },
    ],
    models: [
      toModel(["Logistic_regression", 0.9561, 0.9367, 1.0000, 0.9673, 0.9946, 0.9971, 0.2700, 0.9053]),
      toModel(["Decision_tree", 0.9211, 0.9012, 0.9865, 0.9419, 0.9777, 0.9894, 0.0100, 0.8276]),
      toModel(["Random_forest", 0.9386, 0.9718, 0.9324, 0.9517, 0.9919, 0.9957, 0.4400, 0.8689]),
      toModel(["SVM", 0.9561, 0.9367, 1.0000, 0.9673, 0.9949, 0.9971, 0.2000, 0.9053]),
      toModel(["Xgboost", 0.9561, 0.9726, 0.9595, 0.9660, 0.9912, 0.9951, 0.4500, 0.9044]),
      toModel(["Lightgbm", 0.9561, 0.9726, 0.9595, 0.9660, 0.9875, 0.9923, 0.5100, 0.9044]),
      toModel(["Catboost", 0.9561, 0.9481, 0.9865, 0.9669, 0.9922, 0.9954, 0.1100, 0.9036]),
      toModel(["MLP", 0.9561, 0.9367, 1.0000, 0.9673, 0.9963, 0.9980, 0.1400, 0.9053]),
      toModel(["KNN", 0.9211, 0.8916, 1.0000, 0.9427, 0.9883, 0.9936, 0.3700, 0.8312]),
      toModel(["Extra_trees", 0.9474, 0.9722, 0.9459, 0.9589, 0.9943, 0.9970, 0.4000, 0.8864]),
      toModel(["Gradient_boosting", 0.9649, 0.9487, 1.0000, 0.9737, 0.9892, 0.9933, 0.0100, 0.9240]),
      toModel(["Hist_gradient_boosting", 0.9649, 0.9487, 1.0000, 0.9737, 0.9916, 0.9952, 0.0200, 0.9240]),
      toModel(["Gaussian_nb", 0.9035, 0.9315, 0.9189, 0.9252, 0.9821, 0.9905, 0.0100, 0.7895]),
      toModel(["Bernoulli_nb", 0.9123, 0.9571, 0.9054, 0.9306, 0.9811, 0.9898, 0.6500, 0.8141]),
      toModel(["LDA", 0.9386, 0.9855, 0.9189, 0.9510, 0.9939, 0.9968, 0.9200, 0.8728]),
      toModel(["QDA", 0.9386, 0.9351, 0.9730, 0.9536, 0.9696, 0.9640, 0.4000, 0.8643]),
    ],
    note: "以 30 個連續型細胞核特徵進行醫療分類，適合觀察 stacking 是否能在高準確基礎上進一步提升穩定性與判別能力。",
  },

  I: {
    key: "I",
    label: "Ionosphere",
    subtitle: "透過雷達回波訊號特徵，判斷電離層回波的品質。Good 表示回波顯示電離層中自由電子結構，而 Bad 表示回波無結構、訊號直接穿過電離層",
    size: "351",
    features: "34",
    classData: [
      { name: "Good", value: 225, percentage: "64.1%", color: "#93b5c6" },
      { name: "Bad", value: 126, percentage: "35.9%", color: "#d7816a" },
    ],
    models: [
      toModel(["Logistic_regression", 0.8592, 0.8600, 0.9348, 0.8958, 0.9357, 0.9606, 0.5800, 0.6853]),
      toModel(["Decision_tree", 0.8169, 0.8235, 0.9130, 0.8660, 0.7970, 0.8501, 0.3800, 0.5872]),
      toModel(["Random_forest", 0.9014, 0.8679, 1.0000, 0.9293, 0.9722, 0.9838, 0.3000, 0.7905]),
      toModel(["SVM", 0.9718, 0.9783, 0.9783, 0.9783, 0.9948, 0.9971, 0.7600, 0.9383]),
      toModel(["Xgboost", 0.9296, 0.9020, 1.0000, 0.9485, 0.9617, 0.9743, 0.3500, 0.8495]),
      toModel(["Lightgbm", 0.6479, 0.6479, 1.0000, 0.7863, 0.5000, 0.8239, 0.5000, 0.0000]),
      toModel(["Catboost", 0.9296, 0.9020, 1.0000, 0.9485, 0.9826, 0.9903, 0.2400, 0.8495]),
      toModel(["MLP", 0.9014, 0.8679, 1.0000, 0.9293, 0.9600, 0.9761, 0.6400, 0.7905]),
      toModel(["KNN", 0.9296, 0.9184, 0.9783, 0.9474, 0.9635, 0.9796, 0.7600, 0.8451]),
      toModel(["Extra_trees", 0.8873, 0.9524, 0.8696, 0.9091, 0.9774, 0.9869, 0.6800, 0.7672]),
      toModel(["Gradient_boosting", 0.9014, 0.8679, 1.0000, 0.9293, 0.9713, 0.9801, 0.2500, 0.7905]),
      toModel(["Hist_gradient_boosting", 0.8732, 0.8364, 1.0000, 0.9109, 0.9626, 0.9769, 0.3200, 0.7316]),
      toModel(["Gaussian_nb", 0.9014, 0.8980, 0.9565, 0.9263, 0.9487, 0.9669, 0.9100, 0.7814]),
      toModel(["Bernoulli_nb", 0.6901, 0.8158, 0.6739, 0.7381, 0.8070, 0.8750, 0.3800, 0.3772]),
      toModel(["LDA", 0.8451, 0.8070, 1.0000, 0.8932, 0.9165, 0.9368, 0.2300, 0.6723]),
      toModel(["QDA", 0.9437, 0.9200, 1.0000, 0.9583, 0.9887, 0.9935, 0.9900, 0.8791]),
    ],
    note: "樣本數較少且多為雷達訊號特徵，適合觀察 stacking 在訊號型資料中是否能降低單一模型的表現波動。",
  },

  Income: {
    key: "Income",
    label: "Adult Income Dataset",
    subtitle: "根據個人的人口統計與職業特徵，判斷其年收入是否超過 50,000 美元/年",
    size: "48,842",
    features: "14",
    classData: [
      { name: "≤ 50K", value: 37155, percentage: "76.1%", color: "#93b5c6" },
      { name: "> 50K", value: 11687, percentage: "23.9%", color: "#d7816a" },
    ],
    models: [
      toModel(["Logistic_regression", 0.8407, 0.6539, 0.7104, 0.6810, 0.9030, 0.7579, 0.3700, 0.5760]),
      toModel(["Decision_tree", 0.7456, 0.4810, 0.7956, 0.5995, 0.8373, 0.6181, 0.2600, 0.4585]),
      toModel(["Random_forest", 0.8577, 0.7178, 0.6681, 0.6921, 0.9128, 0.7900, 0.4100, 0.6004]),
      toModel(["SVM", 0.7061, 0.3435, 0.2502, 0.2895, 0.5376, 0.2897, 0.2500, 0.1122]),
      toModel(["Xgboost", 0.8730, 0.7510, 0.7019, 0.7256, 0.9278, 0.8269, 0.4400, 0.6437]),
      toModel(["Lightgbm", 0.8713, 0.7556, 0.6835, 0.7177, 0.9280, 0.8268, 0.4600, 0.6360]),
      toModel(["Catboost", 0.8719, 0.7713, 0.6608, 0.7118, 0.9263, 0.8238, 0.4700, 0.6332]),
      toModel(["MLP", 0.8573, 0.6967, 0.7151, 0.7058, 0.9166, 0.7953, 0.3700, 0.6117]),
      toModel(["KNN", 0.8390, 0.6562, 0.6873, 0.6714, 0.8992, 0.7471, 0.4100, 0.5651]),
      toModel(["Extra_trees", 0.8378, 0.6353, 0.7562, 0.6905, 0.9029, 0.7481, 0.3500, 0.5857]),
      toModel(["Gradient_boosting", 0.8700, 0.7636, 0.6617, 0.7090, 0.9258, 0.8215, 0.4700, 0.6285]),
      toModel(["Hist_gradient_boosting", 0.8720, 0.7906, 0.6330, 0.7031, 0.9269, 0.8254, 0.5200, 0.6291]),
      toModel(["Gaussian_nb", 0.6661, 0.4108, 0.9098, 0.5660, 0.8516, 0.7054, 0.9900, 0.4267]),
      toModel(["Bernoulli_nb", 0.8228, 0.6246, 0.6506, 0.6373, 0.8784, 0.7105, 0.8200, 0.5204]),
      toModel(["LDA", 0.8207, 0.6005, 0.7485, 0.6664, 0.8896, 0.7227, 0.2900, 0.5520]),
      toModel(["QDA", 0.7990, 0.5597, 0.7498, 0.6410, 0.8741, 0.6753, 0.2600, 0.5158]),
    ],
    note: "大型混合型社經資料且類別分布偏斜，適合觀察 stacking 是否能兼顧整體準確率與少數類別辨識能力。",
  },

  water: {
    key: "water",
    label: "Water Quality",
    subtitle: "透過水的物理化學特徵，判斷水是否可飲用(Potable)或不可飲用(Not potable)",
    size: "3,276",
    features: "9",
    classData: [
      { name: "Not potable", value: 1998, percentage: "61%", color: "#93b5c6" },
      { name: "Potable", value: 1278, percentage: "39%", color: "#d7816a" },
    ],
    models: [
      toModel(["Logistic_regression", 0.6037, 0.4444, 0.0154, 0.0299, 0.4869, 0.3962, 0.4600, 0.0120]),
      toModel(["Decision_tree", 0.5625, 0.4568, 0.5714, 0.5077, 0.5885, 0.5231, 0.4500, 0.1252]),
      toModel(["Random_forest", 0.6067, 0.5021, 0.4595, 0.4798, 0.5986, 0.5110, 0.3900, 0.1651]),
      toModel(["SVM", 0.3948, 0.3948, 1.0000, 0.5661, 0.5000, 0.6974, 0.5000, 0.0000]),
      toModel(["Xgboost", 0.6494, 0.6306, 0.2703, 0.3784, 0.6325, 0.5698, 0.4500, 0.2177]),
      toModel(["Lightgbm", 0.6326, 0.5833, 0.2432, 0.3433, 0.6331, 0.5596, 0.4400, 0.1712]),
      toModel(["Catboost", 0.6418, 0.5741, 0.3591, 0.4418, 0.6296, 0.5680, 0.5300, 0.2100]),
      toModel(["MLP", 0.6753, 0.6075, 0.5019, 0.5497, 0.6933, 0.6213, 0.4800, 0.3027]),
      toModel(["KNN", 0.6509, 0.7083, 0.1969, 0.3082, 0.6503, 0.5909, 0.4300, 0.2252]),
      toModel(["Extra_trees", 0.4619, 0.4173, 0.9151, 0.5732, 0.5762, 0.4963, 0.3800, 0.1166]),
      toModel(["Gradient_boosting", 0.5259, 0.4409, 0.7490, 0.5551, 0.5961, 0.5024, 0.3500, 0.1346]),
      toModel(["Hist_gradient_boosting", 0.6311, 0.5895, 0.2162, 0.3164, 0.6290, 0.5557, 0.4700, 0.1639]),
      toModel(["Gaussian_nb", 0.6189, 0.5634, 0.1544, 0.2424, 0.5728, 0.4901, 0.5700, 0.1201]),
      toModel(["Bernoulli_nb", 0.4710, 0.4154, 0.8340, 0.5546, 0.5309, 0.4183, 0.3400, 0.0823]),
      toModel(["LDA", 0.6037, 0.4444, 0.0154, 0.0299, 0.4869, 0.3963, 0.4600, 0.0120]),
      toModel(["QDA", 0.6753, 0.6667, 0.3552, 0.4635, 0.6992, 0.6239, 0.4700, 0.2871]),
    ],
    note: "水質資料包含多個連續型化學指標與明顯缺失值，適合觀察前處理與 stacking 對可飲用性分類的影響。",
  },

  pumpkin: {
    key: "pumpkin",
    label: "Pumpkin Seeds Dataset",
    subtitle: "根據南瓜子的型態與物理特徵，判斷南瓜子品種為 Çerçevelik 或 Ürgüp Sivrisi",
    size: "2,500",
    features: "12",
    classData: [
      { name: "Çerçevelik", value: 1300, percentage: "52%", color: "#93b5c6" },
      { name: "Ürgüp Sivrisi", value: 1200, percentage: "48%", color: "#d7816a" },
    ],
    models: [
      toModel(["Logistic_regression", 0.8700, 0.9078, 0.8140, 0.8584, 0.9316, 0.9392, 0.3600, 0.7427]),
      toModel(["Decision_tree", 0.8660, 0.8692, 0.8512, 0.8601, 0.9160, 0.9139, 0.1300, 0.7317]),
      toModel(["Random_forest", 0.8880, 0.9043, 0.8595, 0.8814, 0.9316, 0.9355, 0.3000, 0.7763]),
      toModel(["SVM", 0.4340, 0.4319, 0.5372, 0.4788, 0.4358, 0.5949, 0.1000, -0.1282]),
      toModel(["Xgboost", 0.8800, 0.8922, 0.8554, 0.8734, 0.9335, 0.9392, 0.6500, 0.7601]),
      toModel(["Lightgbm", 0.8760, 0.8750, 0.8678, 0.8714, 0.9355, 0.9389, 0.4500, 0.7517]),
      toModel(["Catboost", 0.8820, 0.9067, 0.8430, 0.8737, 0.9363, 0.9427, 0.5600, 0.7650]),
      toModel(["MLP", 0.8000, 0.8817, 0.6777, 0.7664, 0.8219, 0.8617, 0.5800, 0.6125]),
      toModel(["KNN", 0.6040, 0.7157, 0.3017, 0.4244, 0.6623, 0.6770, 0.5600, 0.2347]),
      toModel(["Extra_trees", 0.8700, 0.8583, 0.8760, 0.8671, 0.9291, 0.9363, 0.2000, 0.7400]),
      toModel(["Gradient_boosting", 0.8780, 0.8851, 0.8595, 0.8721, 0.9335, 0.9383, 0.4700, 0.7558]),
      toModel(["Hist_gradient_boosting", 0.8740, 0.8908, 0.8430, 0.8662, 0.9345, 0.9356, 0.5000, 0.7483]),
      toModel(["Gaussian_nb", 0.7920, 0.7974, 0.7645, 0.7806, 0.8652, 0.8640, 0.3100, 0.5835]),
      toModel(["Bernoulli_nb", 0.8500, 0.8615, 0.8223, 0.8414, 0.8888, 0.8961, 0.2000, 0.6999]),
      toModel(["LDA", 0.8700, 0.8865, 0.8388, 0.8620, 0.9341, 0.9421, 0.5400, 0.7403]),
      toModel(["QDA", 0.8560, 0.8935, 0.7975, 0.8428, 0.9075, 0.9144, 0.9800, 0.7147]),
    ],
    note: "以連續型影像形態特徵區分南瓜籽品種，且類別比例接近平衡，適合觀察模型對形狀差異的穩定判別能力。",
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
      title: "方法二：四值排序法",
      desc: "分別選取在Precision、Recall、PR-AUC與ROC-AUC指標下表現最佳之模型納入堆疊，以保留不同評估面向下具代表性的模型，提升整體預測能力。",
    },
  ],
  },
  {
    id: "integration",
    short: "整合",
    title: "Stacking與加權融合",
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
    desc: "從模型表現、錯誤型態與跨資料集差異，整理單一模型與堆疊模型的研究發現。",
    panelTitle: "結果分析與研究詮釋",
    panelDesc: "不只比較最高分模型，也從穩定性、錯誤型態與資料集特性解讀整合效果。",
    panelItems: [
      "比較最佳基礎模型與最佳堆疊模型在F1、MCC、PR-AUC與Balanced Accuracy上的差異",
      "觀察混淆矩陣中的FP與FN，判斷模型主要錯誤來源",
      "檢查不同Strategy/K下模型表現是否穩定，避免只依單次高分下結論",
      "整理哪些資料集適合stacking，哪些資料集單一模型已足夠穩定",
    ],
    methods: [
      {
        title: "一、單一模型與堆疊模型比較",
        desc: "先比較最佳base model與最佳stacking model的整體指標，確認堆疊後是否真正帶來提升，而不是只在某一個指標上略微改善。",
      },
      {
        title: "二、錯誤型態分析",
        desc: "透過混淆矩陣與FP / FN比例觀察模型偏誤方向。例如模型是否容易把負類誤判為正類，或是否漏判正類。",
      },
      {
        title: "三、穩定性與篩選策略檢查",
        desc: "比較同一基礎模型在不同Strategy與K下的表現，判斷模型是否穩定，並確認篩選策略是否會影響最終整合品質。",
      },
      {
        title: "四、跨資料集研究結論",
        desc: "將八個資料集的結果放在一起比較，觀察stacking在高維低樣本、類別不平衡、訊號型資料或混合型資料上的適用情境。",
      },
    ],
  },
];


//數據與流程-基礎模型訓練流程
const baseTrainingSteps = [
  {
    id: "base-split",
    short: "切分",
    title: "資料切分與前處理設定",
    desc: "先建立一致的訓練、驗證與測試資料條件，確保後續模型比較具有公平性。",
    panelTitle: "基礎模型訓練：資料切分與前處理",
    panelDesc: "將資料轉換成可直接訓練的格式，並維持一致的模型輸入條件。",
    panelItems: [
      "將資料用Vakayil&Joseph(2022)提出的孿生資料分割法切分為訓練集與測試集，並保留驗證資料用於模型調整",
      "針對數值型欄位進行標準化，降低尺度差異對模型的影響",
      "將類別型欄位轉換為模型可讀取的數值格式",
    ],
  },
  {
    id: "base-train",
    short: "建模",
    title: "多類型基礎模型獨立訓練",
    desc: "訓練多種不同性質的分類器，建立具有異質性的基礎模型池。",
    panelTitle: "基礎模型訓練：多模型建模",
    panelDesc: "透過線性模型、樹模型、Boosting、距離式模型與機率模型，增加後續stacking可利用的模型差異。",
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
        category: "其他模型",
        models: ["SVM", "MLP", "KNN", "Gaussian NB", "Bernoulli NB"],
      },
    ],
    panelItems: [
      "基礎模型訓練過程中我們固定Optuna超參數搜索次數為50次",
      "產生(Out of Folds)折外預測作為堆疊模型的輸入資料"
    ]
  },
  {
    id: "base-eval",
    short: "評估",
    title: "基礎模型表現彙整與排序",
    desc: "彙整各模型的分類表現，作為後續模型篩選與stacking輸入依據。",
    panelTitle: "基礎模型訓練：結果彙整與排序",
    panelDesc: "從多個評估指標觀察模型強弱，找出適合進入堆疊整合的候選模型。",
    panelItems: [
      "統計Accuracy、Precision、Recall、F1、ROC-AUC、PR-AUC 與 MCC...等多個指標",
      "輸出基礎模型訓練結果總表供後續比較",
      "觀察弱模型與穩定模型，避免低品質模型干擾整合結果"
    ],
  },
];

//數據與流程-堆疊流程
//數據與流程-堆疊流程
const stackingFlowSteps = [
  {
    id: "stack-select",
    short: "篩選",
    title: "候選基礎模型篩選",
    desc: "根據排序結果挑選表現較佳且具代表性的模型，降低弱模型對整合結果的干擾。",
    panelTitle: "堆疊流程：候選模型篩選",
    panelDesc: "在進入stacking前，先排除明顯落後的模型，保留較穩定且可能互補的候選模型。",
    panelItems: [
      "依F1排序或四值排序法挑選候選模型",
      "透過F1陡坡圖觀察模型表現是否出現明顯落差",
      "保留高表現或具有互補性的模型，避免弱模型稀釋整合效果",
    ],
  },
  {
    id: "stack-oof",
    short: "生成",
    title: "建立OOF次層特徵",
    desc: "利用基礎模型的OOF prediction建立meta features，讓第二層模型學習各模型的預測行為。",
    panelTitle: "堆疊流程：建立次層輸入",
    panelDesc: "使用OOF預測作為stacking的訓練資料，可降低資料洩漏風險，讓整合模型更接近真實泛化情境。",
    panelItems: [
      "以交叉驗證產生各基礎模型的OOF prediction",
      "將多個模型的預測機率組合成meta feature matrix"
    ],
  },
  {
    id: "stack-meta",
    short: "整合",
    title: "訓練stacking與加權整合模型",
    desc: "使用不同meta learner與機率加權方法整合基礎模型預測，建立最終分類結果。",
    panelTitle: "堆疊流程：meta learner與融合策略",
    panelDesc: "比較學習式stacking與非學習式加權方法，觀察整合後是否提升分類效能與穩定性。",
    panelItems: [
      "使用Logistic Regression、XGBoost與CatBoost作為meta learner",
      "比較Average Voting、Odds Weighting與Inverse Variance Weighting",
      "以F1、MCC、PR-AUC與Balanced Accuracy評估整合後表現",
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
    <div className="max-w-6xl space-y-3">
      <div className="text-sm font-semibold tracking-[0.2em] uppercase text-[#93b5c6]">
        {eyebrow}
      </div>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 lg:whitespace-nowrap">
        {title}
      </h2>
      {description && (
        <p className="max-w-3xl leading-8 text-slate-600">
          {description}
        </p>
      )}
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
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [selectedStrategyType, setSelectedStrategyType] = useState("F1-rank");
  const [stabilityMetric, setStabilityMetric] = useState("F1");
  const [rankingMetric, setRankingMetric] = useState("F1");
  const [stabilityZoomLevel, setStabilityZoomLevel] = useState(0);
  const [f1ZoomLevel, setF1ZoomLevel] = useState(0);
  const [candidateZoomDomains, setCandidateZoomDomains] = useState(null);
  const [prZoomDomains, setPrZoomDomains] = useState(null);
  const [panState, setPanState] = useState(null);

  const candidateChartRef = useRef(null);
  const prChartRef = useRef(null);
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


  useEffect(() => {
    setCandidateZoomDomains(null);
    setPrZoomDomains(null);
    setF1ZoomLevel(0);
  }, [datasetKey, selectedStrategy]);

  useEffect(() => {
    setStabilityZoomLevel(0);
  }, [datasetKey, selectedStrategyType, stabilityMetric]);

  const formatModelName = (name = "") =>
    name
      .replace(/^stack_/, "stack ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const asNumber = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const buildPaddedDomain = (
    values,
    {
      lowerLimit = 0,
      upperLimit = 1,
      paddingRatio = 0.15,
      minSpan = 0.08,
    } = {}
  ) => {
    const validValues = values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (!validValues.length) return [lowerLimit, upperLimit];

    const minValue = Math.min(...validValues);
    const maxValue = Math.max(...validValues);
    const rawSpan = maxValue - minValue;
    const span = rawSpan === 0 ? minSpan : rawSpan;
    const padding = Math.max(span * paddingRatio, minSpan / 2);

    let lower = minValue - padding;
    let upper = maxValue + padding;

    if (upper - lower < minSpan) {
      const middle = (minValue + maxValue) / 2;
      lower = middle - minSpan / 2;
      upper = middle + minSpan / 2;
    }

    lower = Math.max(lowerLimit, lower);
    upper = Math.min(upperLimit, upper);

    if (upper - lower < minSpan && upperLimit - lowerLimit >= minSpan) {
      if (lower === lowerLimit) {
        upper = Math.min(upperLimit, lower + minSpan);
      } else if (upper === upperLimit) {
        lower = Math.max(lowerLimit, upper - minSpan);
      }
    }

    return [Number(lower.toFixed(4)), Number(upper.toFixed(4))];
  };

  const getNiceAxisMax = (value) => {
    if (!Number.isFinite(value) || value <= 0) return 1;

    const paddedValue = value * 1.08;
    const power = 10 ** Math.floor(Math.log10(paddedValue));
    const normalized = paddedValue / power;

    const niceNormalized =
      normalized <= 1
        ? 1
        : normalized <= 2
          ? 2
          : normalized <= 5
            ? 5
            : 10;

    return niceNormalized * power;
  };

  
  const clampRange = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  };

  const buildCenteredDomain = (center, span, lowerLimit, upperLimit) => {
    const maxSpan = upperLimit - lowerLimit;
    const safeSpan = clampRange(span, 0.00001, maxSpan);

    let lower = center - safeSpan / 2;
    let upper = center + safeSpan / 2;

    if (lower < lowerLimit) {
      lower = lowerLimit;
      upper = lower + safeSpan;
    }

    if (upper > upperLimit) {
      upper = upperLimit;
      lower = upper - safeSpan;
    }

    lower = Math.max(lowerLimit, lower);
    upper = Math.min(upperLimit, upper);

    return [Number(lower.toFixed(4)), Number(upper.toFixed(4))];
  };
  

  const clampDomainToFull = (domain, fullDomain) => {
    const [domainMin, domainMax] = domain;
    const [fullMin, fullMax] = fullDomain;

    const domainSpan = domainMax - domainMin;
    const fullSpan = fullMax - fullMin;

    if (domainSpan >= fullSpan) return fullDomain;

    const nextMin = Math.max(fullMin, Math.min(domainMin, fullMax - domainSpan));
    return [Number(nextMin.toFixed(4)), Number((nextMin + domainSpan).toFixed(4))];
  };

  const zoomAxisDomain = (currentDomain, fullDomain, centerRatio, scale) => {
    const [currentMin, currentMax] = currentDomain;
    const [fullMin, fullMax] = fullDomain;

    const fullSpan = fullMax - fullMin;
    const currentSpan = currentMax - currentMin;
    const minSpan = fullSpan * 0.03;

    const center = currentMin + currentSpan * centerRatio;
    const nextSpan = Math.max(minSpan, Math.min(fullSpan, currentSpan * scale));

    const nextDomain = [
      center - nextSpan * centerRatio,
      center + nextSpan * (1 - centerRatio),
    ];

    return clampDomainToFull(nextDomain, fullDomain);
  };

  const zoomDomainsByFactor = (currentDomains, fullDomains, scale) => {
    return {
      x: zoomAxisDomain(currentDomains.x, fullDomains.x, 0.5, scale),
      y: zoomAxisDomain(currentDomains.y, fullDomains.y, 0.5, scale),
    };
  };

  const panAxisDomain = (startDomain, fullDomain, deltaRatio) => {
    const span = startDomain[1] - startDomain[0];
    const nextDomain = [
      startDomain[0] + deltaRatio * span,
      startDomain[1] + deltaRatio * span,
    ];

    return clampDomainToFull(nextDomain, fullDomain);
  };

  const handlePanStart = (event, chartKey, currentDomains) => {
    if (event.button !== 0) return;

    const rect = event.currentTarget.getBoundingClientRect();

    event.currentTarget.setPointerCapture?.(event.pointerId);

    setPanState({
      chartKey,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: rect.width,
      height: rect.height,
      startDomains: currentDomains,
    });
  };

  const handlePanMove = (event, chartKey, fullDomains, setDomains) => {
    if (!panState || panState.chartKey !== chartKey || panState.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - panState.startX;
    const dy = event.clientY - panState.startY;

    const xDeltaRatio = -(dx / panState.width);
    const yDeltaRatio = dy / panState.height;

    setDomains({
      x: panAxisDomain(panState.startDomains.x, fullDomains.x, xDeltaRatio),
      y: panAxisDomain(panState.startDomains.y, fullDomains.y, yDeltaRatio),
    });
  };

  const handlePanEnd = () => {
    setPanState(null);
  };


  const datasetResults = useMemo(() => {
    return allStackingResults.filter((row) => row.Dataset === jsonDatasetName);
  }, [jsonDatasetName]);

  const strategyOptions = useMemo(() => {
    const grouped = new Map();
    datasetResults.forEach((row) => {
      if (!row.Strategy) return;
      if (!grouped.has(row.Strategy)) {
        grouped.set(row.Strategy, {
          strategy: row.Strategy,
          strategyType: row.Strategy_Type,
          k: row.K,
          count: 0,
        });
      }
      grouped.get(row.Strategy).count += 1;
    });

    return Array.from(grouped.values()).sort((a, b) => {
      const typeOrder = { "4-rank": 0, "F1-rank": 1 };
      return (
        (typeOrder[a.strategyType] ?? 9) - (typeOrder[b.strategyType] ?? 9) ||
        asNumber(a.k) - asNumber(b.k) ||
        a.strategy.localeCompare(b.strategy)
      );
    });
  }, [datasetResults]);

  useEffect(() => {
    if (!strategyOptions.length) {
      setSelectedStrategy("");
      return;
    }

    if (!strategyOptions.some((option) => option.strategy === selectedStrategy)) {
      setSelectedStrategy(strategyOptions[0].strategy);
    }
  }, [strategyOptions, selectedStrategy]);

  const strategyResults = useMemo(() => {
    return datasetResults.filter((row) => row.Strategy === selectedStrategy);
  }, [datasetResults, selectedStrategy]);

  const selectedStrategyMeta = useMemo(() => {
    return strategyOptions.find((option) => option.strategy === selectedStrategy) || null;
  }, [strategyOptions, selectedStrategy]);

  const sortByModelQuality = (a, b) =>
    asNumber(b.F1) - asNumber(a.F1) ||
    asNumber(b.MCC) - asNumber(a.MCC) ||
    asNumber(b.BalancedAccuracy) - asNumber(a.BalancedAccuracy) ||
    asNumber(b.PR_AUC) - asNumber(a.PR_AUC);

  const bestBaseResult = useMemo(() => {
    return [...strategyResults]
      .filter((row) => row.Type === "base")
      .sort(sortByModelQuality)[0] || null;
  }, [strategyResults]);

  const bestStackResult = useMemo(() => {
    return [...strategyResults]
      .filter((row) => row.Type === "stack")
      .sort(sortByModelQuality)[0] || null;
  }, [strategyResults]);

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

  const lineData = useMemo(() => {
    return [...(current.models || [])].sort((a, b) => b.f1 - a.f1);
  }, [current.models]);

  const f1YAxisDomain = useMemo(() => {
    const values = lineData
      .map((model) => Number(model.f1))
      .filter((value) => Number.isFinite(value));

    if (!values.length) return [0, 1];

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const center = (minValue + maxValue) / 2;
    const rawSpan = maxValue - minValue;

    // 預設先把 Y 軸縮到比較接近資料本身，讓差異明顯
    const overviewSpan = Math.max(rawSpan * 2.8, 0.04);

    // f1ZoomLevel 越大，Y 軸越窄
    const zoomFactor = Math.pow(0.65, f1ZoomLevel);
    const targetSpan = Math.max(overviewSpan * zoomFactor, 0.0001);

    return buildCenteredDomain(center, targetSpan, 0, 1);
  }, [lineData, f1ZoomLevel]);


  const lineData2 = useMemo(() => {
    return [...(current.models || [])].sort((a, b) => b.precision - a.precision);
  }, [current.models]);


  const formatMetricValue = (value, digits = 4) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric.toFixed(digits) : "-";
  };


  const tableMetricKeys = [
    "accuracy",
    "precision",
    "recall",
    "f1",
    "ROC_AUC",
    "PR_AUC",
    "MCC",
  ];

  const tableMetricExtremes = useMemo(() => {
    const models = current.models || {};
    const extremes = {};

    tableMetricKeys.forEach((metricKey) => {
      const values = (current.models || [])
        .map((model) => Number(model[metricKey]))
        .filter((value) => Number.isFinite(value));

      if (!values.length) return;

      extremes[metricKey] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    return extremes;
  }, [current.models]);

  const getMetricCellClass = (metricKey, value, baseClass = "px-5 py-3") => {
    const numericValue = Number(value);
    const extremes = tableMetricExtremes[metricKey];

    if (!extremes || !Number.isFinite(numericValue)) {
      return `${baseClass} text-slate-900`;
    }

    const isFlat = Math.abs(extremes.max - extremes.min) < 1e-12;
    if (isFlat) {
      return `${baseClass} text-slate-900`;
    }

    const isMax = Math.abs(numericValue - extremes.max) < 1e-12;
    const isMin = Math.abs(numericValue - extremes.min) < 1e-12;

    if (isMax) {
      return `${baseClass} bg-emerald-50 text-slate-900 font-semibold`;
    }

    if (isMin) {
      return `${baseClass} bg-rose-50 text-slate-900 font-semibold`;
    }

    return `${baseClass} text-slate-900`;
  };


  const normalizeModelKey = (name = "") =>
    String(name)
      .toLowerCase()
      .replace(/^stack_/, "")
      .replace(/\s+/g, "_");

  const baseMetricLookup = useMemo(() => {
    const grouped = new Map();

    datasetResults
      .filter((row) => row.Type === "base")
      .forEach((row) => {
        const key = normalizeModelKey(row.Model);

        if (!grouped.has(key)) {
          grouped.set(key, {
            BalancedAccuracy: [],
            F1: [],
            MCC: [],
            PR_AUC: [],
            Recall: [],
            Precision: [],
          });
        }

        const target = grouped.get(key);

        Object.keys(target).forEach((metricKey) => {
          const value = Number(row[metricKey]);
          if (Number.isFinite(value)) {
            target[metricKey].push(value);
          }
        });
      });

    const lookup = {};

    grouped.forEach((metrics, modelKey) => {
      lookup[modelKey] = {};

      Object.entries(metrics).forEach(([metricKey, values]) => {
        lookup[modelKey][metricKey] =
          values.length > 0
            ? values.reduce((sum, value) => sum + value, 0) / values.length
            : null;
      });
    });

    return lookup;
  }, [datasetResults]);

  const getBaseModelMetric = (model, metricKey) => {
    if (!model) return null;

    const directValue = Number(model[metricKey]);
    if (Number.isFinite(directValue)) return directValue;

    const lookupValue = baseMetricLookup[normalizeModelKey(model.name)]?.[metricKey];
    return Number.isFinite(Number(lookupValue)) ? Number(lookupValue) : null;
  };

  const getBaseModelType = (modelName = "") => {
    const normalizedName = modelName.toLowerCase();

    if (["logistic_regression", "lda", "qda"].includes(normalizedName)) {
      return "線性 / 判別模型";
    }

    if (["decision_tree", "random_forest", "extra_trees"].includes(normalizedName)) {
      return "樹狀與集成模型";
    }

    if (
      [
        "xgboost",
        "lightgbm",
        "catboost",
        "gradient_boosting",
        "hist_gradient_boosting",
      ].includes(normalizedName)
    ) {
      return "Boosting 模型";
    }

    if (["svm", "mlp"].includes(normalizedName)) {
      return "核方法與神經網路";
    }

    if (["knn"].includes(normalizedName)) {
      return "距離與鄰近模型";
    }

    if (["gaussian_nb", "bernoulli_nb"].includes(normalizedName)) {
      return "機率式分類模型";
    }

    return "其他模型";
  };

  const baseModelTypeColors = {
    "線性 / 判別模型": "#93b5c6",
    "樹狀與集成模型": "#d7816a",
    "Boosting 模型": "#b9c99f",
    "核方法與神經網路": "#f0cf65",
    "距離與鄰近模型": "#8aa6a3",
    "機率式分類模型": "#b88c8c",
    "其他模型": "#9d8abf",
  };

  const buildBaseChartDomain = (
    values,
    {
      lowerLimit = 0,
      upperLimit = 1,
      paddingRatio = 0.18,
      minSpan = 0.08,
    } = {}
  ) => {
    const validValues = values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (!validValues.length) return [lowerLimit, upperLimit];

    const minValue = Math.min(...validValues);
    const maxValue = Math.max(...validValues);
    const rawSpan = maxValue - minValue;
    const span = rawSpan === 0 ? minSpan : rawSpan;
    const padding = Math.max(span * paddingRatio, minSpan / 2);

    let lower = minValue - padding;
    let upper = maxValue + padding;

    if (upper - lower < minSpan) {
      const middle = (minValue + maxValue) / 2;
      lower = middle - minSpan / 2;
      upper = middle + minSpan / 2;
    }

    lower = Math.max(lowerLimit, lower);
    upper = Math.min(upperLimit, upper);

    if (upper - lower < minSpan && upperLimit - lowerLimit >= minSpan) {
      if (lower === lowerLimit) {
        upper = Math.min(upperLimit, lower + minSpan);
      } else if (upper === upperLimit) {
        lower = Math.max(lowerLimit, upper - minSpan);
      }
    }

    return [Number(lower.toFixed(4)), Number(upper.toFixed(4))];
  };

  const recommendedBaseModel = useMemo(() => {
    return [...(current.models || [])].sort(
      (a, b) =>
        asNumber(b.f1) - asNumber(a.f1) ||
        asNumber(b.MCC) - asNumber(a.MCC) ||
        asNumber(getBaseModelMetric(b, "BalancedAccuracy")) -
          asNumber(getBaseModelMetric(a, "BalancedAccuracy")) ||
        asNumber(b.PR_AUC) - asNumber(a.PR_AUC)
    )[0];
  }, [current.models, baseMetricLookup]);

  const metricChampions = useMemo(() => {
    const models = current.models || [];

    const pickBest = (metricKey) =>
      [...models].sort(
        (a, b) =>
          asNumber(getBaseModelMetric(b, metricKey)) -
          asNumber(getBaseModelMetric(a, metricKey))
      )[0];

    return {
      f1: pickBest("f1"),
      mcc: pickBest("MCC"),
      prAuc: pickBest("PR_AUC"),
      balancedAccuracy: pickBest("BalancedAccuracy"),
    };
  }, [current.models, baseMetricLookup]);

  const baseModelDiagnostics = useMemo(() => {
    const models = current.models || [];
    if (!models.length) {
      return {
        f1Gap: 0,
        diversityLevel: "低",
        complementarity: "不明顯",
        stackingPotential: "低",
      };
    }

    const f1Values = models.map((model) => asNumber(model.f1));
    const f1Gap = Math.max(...f1Values) - Math.min(...f1Values);

    const championNames = [
      metricChampions.f1?.name,
      metricChampions.mcc?.name,
      metricChampions.prAuc?.name,
      metricChampions.balancedAccuracy?.name,
    ].filter(Boolean);

    const uniqueChampionCount = new Set(championNames).size;

    const diversityLevel =
      f1Gap >= 0.25 ? "高" : f1Gap >= 0.1 ? "中" : "低";

    const complementarity =
      uniqueChampionCount >= 3
        ? "明顯"
        : uniqueChampionCount === 2
          ? "普通"
          : "不明顯";

    const stackingPotential =
      (diversityLevel === "高" && complementarity !== "不明顯") ||
      (complementarity === "明顯" && f1Gap >= 0.08)
        ? "高"
        : diversityLevel === "中" || complementarity === "普通"
          ? "中"
          : "低";

    return {
      f1Gap,
      diversityLevel,
      complementarity,
      stackingPotential,
    };
  }, [current.models, metricChampions]);

  const baseCandidateData = useMemo(() => {
    return [...(current.models || [])].map((model) => ({
      ...model,
      modelLabel: model.name.replace(/_/g, " "),
      modelType: getBaseModelType(model.name),
      F1: asNumber(model.f1),
      MCCValue: asNumber(model.MCC),
      PR_AUCValue: asNumber(model.PR_AUC),
      pointSize: Math.max(asNumber(model.PR_AUC), 0.05),
    }));
  }, [current.models]);

  const candidateGroupedData = useMemo(() => {
    return Object.entries(baseModelTypeColors)
      .map(([type, fill]) => ({
        type,
        fill,
        data: baseCandidateData.filter((model) => model.modelType === type),
      }))
      .filter((group) => group.data.length > 0);
  }, [baseCandidateData]);

  const candidateAxisDomains = useMemo(() => {
    return {
      f1: buildBaseChartDomain(baseCandidateData.map((model) => model.F1), {
        lowerLimit: 0,
        upperLimit: 1,
        paddingRatio: 0.2,
        minSpan: 0.12,
      }),
      mcc: buildBaseChartDomain(baseCandidateData.map((model) => model.MCCValue), {
        lowerLimit: -1,
        upperLimit: 1,
        paddingRatio: 0.2,
        minSpan: 0.16,
      }),
    };
  }, [baseCandidateData]);


  const candidateFullDomains = useMemo(
    () => ({
      x: candidateAxisDomains.f1,
      y: candidateAxisDomains.mcc,
    }),
    [candidateAxisDomains]
  );

  const candidateDisplayDomains = candidateZoomDomains ?? candidateFullDomains;


  const metricDefinitions = [
    { key: "F1", label: "F1", fill: "#93b5c6" },
    { key: "MCC", label: "MCC", fill: "#d7816a" },
    { key: "BalancedAccuracy", label: "Balanced Accuracy", fill: "#f0cf65" },
    { key: "PR_AUC", label: "PR AUC", fill: "#b9c99f" },
  ];
  const selectedRankingMetricDefinition =
    metricDefinitions.find((item) => item.key === rankingMetric) ||
    metricDefinitions[0];

  const rankedModelData = useMemo(() => {
    return [...strategyResults]
      .map((row) => ({
        ...row,
        modelLabel: formatModelName(row.Model),
        modelTypeLabel: row.Type === "base" ? "Base" : "Stacking",
        F1: asNumber(row.F1),
        MCC: asNumber(row.MCC),
        BalancedAccuracy: asNumber(row.BalancedAccuracy),
        PR_AUC: asNumber(row.PR_AUC),
        Precision: asNumber(row.Precision),
        Recall: asNumber(row.Recall),
        FP: asNumber(row.FP),
        FN: asNumber(row.FN),
      }))
      .sort((a, b) => {
        return (
          asNumber(b[rankingMetric]) - asNumber(a[rankingMetric]) ||
          asNumber(b.F1) - asNumber(a.F1) ||
          asNumber(b.MCC) - asNumber(a.MCC) ||
          asNumber(b.BalancedAccuracy) - asNumber(a.BalancedAccuracy) ||
          asNumber(b.PR_AUC) - asNumber(a.PR_AUC)
        );
      });
  }, [strategyResults, rankingMetric]);

  const rankingChartHeight = Math.max(360, rankedModelData.length * 42);
  const rankingAxisMin =
    rankingMetric === "MCC"
      ? Math.min(0, ...rankedModelData.map((row) => row.MCC))
      : 0;

  const prBaseData = useMemo(
    () => rankedModelData.filter((row) => row.Type === "base"),
    [rankedModelData]
  );

  const prStackData = useMemo(
    () => rankedModelData.filter((row) => row.Type === "stack"),
    [rankedModelData]
  );


  const prAxisDomains = useMemo(() => {
    const points = [...prBaseData, ...prStackData];

    return {
      recall: buildPaddedDomain(points.map((row) => row.Recall), {
        lowerLimit: 0,
        upperLimit: 1,
        paddingRatio: 0.2,
        minSpan: 0.12,
      }),
      precision: buildPaddedDomain(points.map((row) => row.Precision), {
        lowerLimit: 0,
        upperLimit: 1,
        paddingRatio: 0.2,
        minSpan: 0.12,
      }),
    };
  }, [prBaseData, prStackData]);


  const prFullDomains = useMemo(
    () => ({
      x: prAxisDomains.recall,
      y: prAxisDomains.precision,
    }),
    [prAxisDomains]
  );

  const prDisplayDomains = prZoomDomains ?? prFullDomains;


  const errorCompositionData = useMemo(() => {
    return rankedModelData.map((row) => ({
      modelLabel: row.modelLabel,
      modelTypeLabel: row.modelTypeLabel,
      FP: row.FP,
      FN: row.FN,
      Strategy: row.Strategy,
    }));
  }, [rankedModelData]);


  const errorChartWidth = Math.max(760, errorCompositionData.length * 110);

  const errorYAxisMax = useMemo(() => {
    const maxStackedError = Math.max(
      0,
      ...errorCompositionData.map((row) => asNumber(row.FP) + asNumber(row.FN))
    );

    return getNiceAxisMax(maxStackedError);
  }, [errorCompositionData]);


  const strategyTypeOptions = useMemo(() => {
    const types = Array.from(
      new Set(datasetResults.map((row) => row.Strategy_Type).filter(Boolean))
    );
    return types.sort((a, b) => {
      const typeOrder = { "F1-rank": 0, "4-rank": 1 };
      return (typeOrder[a] ?? 9) - (typeOrder[b] ?? 9) || a.localeCompare(b);
    });
  }, [datasetResults]);

  useEffect(() => {
    if (!strategyTypeOptions.length) {
      setSelectedStrategyType("");
      return;
    }

    if (!strategyTypeOptions.includes(selectedStrategyType)) {
      setSelectedStrategyType(strategyTypeOptions[0]);
    }
  }, [strategyTypeOptions, selectedStrategyType]);

  const stabilityMetricOptions = [
    { key: "F1", label: "F1" },
    { key: "MCC", label: "MCC" },
    { key: "PR_AUC", label: "PR AUC" },
    { key: "BalancedAccuracy", label: "Balanced Accuracy" },
  ];

  const stabilitySourceRows = useMemo(() => {
    return datasetResults.filter(
      (row) => row.Type === "base" && row.Strategy_Type === selectedStrategyType
    );
  }, [datasetResults, selectedStrategyType]);

  const stabilityModelNames = useMemo(() => {
    const counts = stabilitySourceRows.reduce((acc, row) => {
      acc[row.Model] = (acc[row.Model] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([model]) => model);
  }, [stabilitySourceRows]);

  const stabilityStrategyMeta = useMemo(() => {
    const grouped = new Map();
    stabilitySourceRows.forEach((row) => {
      if (!grouped.has(row.Strategy)) {
        grouped.set(row.Strategy, {
          strategy: row.Strategy,
          k: row.K,
        });
      }
    });

    return Array.from(grouped.values()).sort(
      (a, b) => asNumber(a.k) - asNumber(b.k) || a.strategy.localeCompare(b.strategy)
    );
  }, [stabilitySourceRows]);

  const stabilityChartData = useMemo(() => {
    return stabilityStrategyMeta.map((strategyMeta) => {
      const point = {
        strategyLabel: `${strategyMeta.strategy} (K=${strategyMeta.k})`,
      };

      stabilityModelNames.forEach((model) => {
        const row = stabilitySourceRows.find(
          (item) => item.Model === model && item.Strategy === strategyMeta.strategy
        );
        point[model] = row ? asNumber(row[stabilityMetric]) : null;
      });

      return point;
    });
  }, [stabilityStrategyMeta, stabilityModelNames, stabilitySourceRows, stabilityMetric]);


  const stabilityYAxisDomain = useMemo(() => {
    const values = stabilityChartData
      .flatMap((row) => stabilityModelNames.map((model) => Number(row[model])))
      .filter((value) => Number.isFinite(value));

    const lowerLimit = stabilityMetric === "MCC" ? -1 : 0;
    const upperLimit = 1;

    if (!values.length) {
      return [lowerLimit, upperLimit];
    }

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const center = (minValue + maxValue) / 2;
    const rawSpan = maxValue - minValue;

    // 預設不要太窄：避免一開始 Y 軸只剩 0.88～1.00 這種很壓縮的範圍
    const overviewMinSpan =
      stabilityMetric === "MCC"
        ? 0.4
        : 0.25;

    // 實際資料範圍加 padding
    const paddedDataSpan = Math.max(rawSpan * 1.8, overviewMinSpan);

    // stabilityZoomLevel 越大，Y 軸越窄；越小，Y 軸越寬
    const zoomFactor = Math.pow(0.6, stabilityZoomLevel);
    const targetSpan = paddedDataSpan * zoomFactor;

    return buildCenteredDomain(
      center,
      targetSpan,
      lowerLimit,
      upperLimit
    );
  }, [stabilityChartData, stabilityModelNames, stabilityMetric, stabilityZoomLevel]);



  const lineColors = [
    "#93b5c6",
    "#d7816a",
    "#f0cf65",
    "#b9c99f",
    "#8aa6a3",
    "#b88c8c",
    "#9d8abf",
    "#c0a36e",
    "#7aa6c2",
    "#c28f6a",
    "#89a978",
    "#b58aa2",
    "#8c9bb8",
    "#c7a66b",
    "#8fb7a0",
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="研究流程"
        title="資料介紹、基礎模型結果與堆疊模型分析"
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

                      <td className={getMetricCellClass("accuracy", row.accuracy)}>
                        {row.accuracy.toFixed(4)}
                      </td>

                      <td className={getMetricCellClass("precision", row.precision)}>
                        {row.precision.toFixed(4)}
                      </td>

                      <td className={getMetricCellClass("recall", row.recall)}>
                        {row.recall.toFixed(4)}
                      </td>

                      <td className={getMetricCellClass("f1", row.f1, "px-4 py-3")}>
                        {row.f1.toFixed(4)}
                      </td>

                      <td className={getMetricCellClass("ROC_AUC", row.ROC_AUC)}>
                        {row.ROC_AUC.toFixed(4)}
                      </td>

                      <td className={getMetricCellClass("PR_AUC", row.PR_AUC)}>
                        {row.PR_AUC.toFixed(4)}
                      </td>

                      <td className={getMetricCellClass("MCC", row.MCC, "px-6 py-3")}>
                        {row.MCC.toFixed(4)}
                      </td>

                      <td className="px-6 py-3 text-slate-900">
                        {row.Best_Threshold.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              <div className="mt-6">
              <div className="mb-3 text-xl font-semibold text-slate-900">
                模型診斷
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  ["模型差異度", baseModelDiagnostics.diversityLevel, `F1 差距 ${formatMetricValue(baseModelDiagnostics.f1Gap)}`],
                  ["互補性", baseModelDiagnostics.complementarity, "觀察單項冠軍是否分散"],
                  ["Stacking 潛力", baseModelDiagnostics.stackingPotential, "綜合差異度與互補性"],
                ].map(([label, value, detail]) => (
                  <div key={label} className="rounded-2xl bg-[#f7f3ec] p-3">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 text-xl font-bold text-slate-900">
                      {value}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">
                      {detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>基礎模型摘要</CardTitle>
            <CardDescription>快速掌握目前資料集的模型強弱、互補性與 stacking 潛力</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 text-sm text-slate-600">
            <div className="rounded-3xl bg-[#f5efe4] p-5 shadow-sm">
              <div className="text-xs font-semibold tracking-[0.16em] text-[#93b5c6]">
                推薦基礎模型
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {recommendedBaseModel?.name}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["F1", recommendedBaseModel?.f1, 4],
                  ["MCC", recommendedBaseModel?.MCC, 4],
                  ["PR AUC", recommendedBaseModel?.PR_AUC, 4],
                  ["Balanced Accuracy", getBaseModelMetric(recommendedBaseModel, "BalancedAccuracy"), 4,],
                ].map(([label, value, digits]) => (
                  <div key={label} className="rounded-2xl bg-white/80 p-3">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 font-bold text-slate-900 tabular-nums">
                      {formatMetricValue(value, digits)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-slate-900">
                模型最佳指標
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["F1 最佳", metricChampions.f1, "f1"],
                  ["MCC 最佳", metricChampions.mcc, "MCC"],
                  ["PR AUC 最佳", metricChampions.prAuc, "PR_AUC"],
                  ["Balanced Accuracy 最佳", metricChampions.balancedAccuracy, "BalancedAccuracy"],
                ].map(([label, model, metricKey]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-3">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {model?.name}
                    </div>
                    <div className="mt-1 text-xs text-[#d7816a] tabular-nums">
                      {formatMetricValue(getBaseModelMetric(model, metricKey))}
                    </div>
                  </div>
                ))}
              </div>
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
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-500">
                Y 軸範圍：{f1YAxisDomain[0].toFixed(4)} ～ {f1YAxisDomain[1].toFixed(4)}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setF1ZoomLevel((level) => Math.min(level + 1, 20))}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
                >
                  放大 Y 軸
                </button>

                <button
                  type="button"
                  onClick={() => setF1ZoomLevel((level) => Math.max(level - 1, -4))}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
                >
                  縮小 Y 軸
                </button>

                <button
                  type="button"
                  onClick={() => setF1ZoomLevel(0)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
                >
                  重置 Y 軸
                </button>
              </div>
            </div>

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
                  <YAxis
                    domain={f1YAxisDomain}
                    tickCount={6}
                    allowDecimals
                    tickFormatter={(value) => Number(value).toFixed(4)}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      Number(value).toFixed(4),
                      name === "f1" ? "F1" : name,
                    ]}
                  />
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
        {/*基礎模型候選地圖*/}
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>基礎模型候選地圖：F1 × MCC</CardTitle>
            <CardDescription>
              X 軸為 F1，Y 軸為 MCC；點大小代表 PR AUC，點顏色代表模型類型
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setCandidateZoomDomains((prev) =>
                    zoomDomainsByFactor(
                      prev ?? candidateFullDomains,
                      candidateFullDomains,
                      0.82
                    )
                  )
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
              >
                放大
              </button>

              <button
                type="button"
                onClick={() =>
                  setCandidateZoomDomains((prev) =>
                    zoomDomainsByFactor(
                      prev ?? candidateFullDomains,
                      candidateFullDomains,
                      1.18
                    )
                  )
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
              >
                縮小
              </button>

              <button
                type="button"
                onClick={() => setCandidateZoomDomains(null)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
              >
                重置縮放
              </button>
            </div>

            <div
              ref={candidateChartRef}
              className="h-80 w-full cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
              onPointerDown={(event) =>
                handlePanStart(event, "candidate", candidateDisplayDomains)
              }
              onPointerMove={(event) =>
                handlePanMove(
                  event,
                  "candidate",
                  candidateFullDomains,
                  setCandidateZoomDomains
                )
              }
              onPointerUp={handlePanEnd}
              onPointerLeave={handlePanEnd}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 28, bottom: 28, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    type="number"
                    dataKey="F1"
                    name="F1"
                    domain={candidateDisplayDomains.x}
                    tickCount={5}
                    tickFormatter={(value) => value.toFixed(4)}
                  />

                  <YAxis
                    type="number"
                    dataKey="MCCValue"
                    name="MCC"
                    domain={candidateDisplayDomains.y}
                    tickCount={5}
                    tickFormatter={(value) => value.toFixed(4)}
                  />

                  <ZAxis
                    type="number"
                    dataKey="pointSize"
                    range={[70, 280]}
                    name="PR AUC"
                  />

                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;

                      const row = payload[0].payload;

                      return (
                        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg">
                          <div className="font-semibold text-slate-900">
                            {row.modelLabel}
                          </div>
                          <div className="mt-1 text-slate-500">
                            {row.modelType}
                          </div>
                          <div className="mt-2 grid gap-1">
                            <div>
                              F1：
                              <span className="font-semibold tabular-nums">
                                {formatMetricValue(row.F1)}
                              </span>
                            </div>
                            <div>
                              MCC：
                              <span className="font-semibold tabular-nums">
                                {formatMetricValue(row.MCCValue)}
                              </span>
                            </div>
                            <div>
                              PR AUC：
                              <span className="font-semibold tabular-nums">
                                {formatMetricValue(row.PR_AUCValue)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />

                  <Legend />

                  {candidateGroupedData.map((group) => (
                    <Scatter
                      key={group.type}
                      name={group.type}
                      data={group.data}
                      fill={group.fill}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-[#f7f3ec] p-4 text-xs leading-6 text-slate-600 sm:grid-cols-2">
              <div>
                <span className="font-semibold text-slate-900">右上角：</span>
                最值得納入 stacking 的強模型
              </div>
              <div>
                <span className="font-semibold text-slate-900">右下角：</span>
                F1 高但整體分類相關性較弱
              </div>
              <div>
                <span className="font-semibold text-slate-900">左上角：</span>
                可能有特殊互補價值
              </div>
              <div>
                <span className="font-semibold text-slate-900">左下角：</span>
                弱模型，應排除
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-slate-900">點越大：</span>
                PR AUC 越好，代表機率排序能力越強
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <SectionTitle
          eyebrow="堆疊模型結果"
          title="進階分析與整合模型表現"
        />
      </div>
      {/*模型篩選 Strategy 按鈕*/}
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-[#93b5c6]">模型篩選方法 Strategy</div>
            <div className="mt-1 text-sm text-slate-500">
              目前資料集共有 {strategyOptions.length} 個模型篩選結果；切換 Strategy 後，混淆矩陣與下方所有進階圖表會同步更新。
            </div>
          </div>
          {selectedStrategyMeta && (
            <Badge className="w-fit rounded-full bg-[#f5efe4] px-3 py-1 text-slate-700 hover:bg-[#f5efe4]">
              {selectedStrategyMeta.strategyType} ｜ K = {selectedStrategyMeta.k}
            </Badge>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {strategyOptions.map((option) => (
            <button
              key={option.strategy}
              onClick={() => setSelectedStrategy(option.strategy)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selectedStrategy === option.strategy
                  ? "border-[#93b5c6] bg-[#93b5c6] text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-[#93b5c6]/60 hover:bg-[#f7f3ec]"
              }`}
            >
              <span className="font-medium">{option.strategy}</span>
              <span className="ml-2 text-xs opacity-80">{option.strategyType} / K={option.k}</span>
            </button>
          ))}
        </div>
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
            <CardTitle>
              模型排行榜：{selectedRankingMetricDefinition.label}
            </CardTitle>
            <CardDescription>
              顯示目前 Strategy 下進入堆疊的基礎模型與六種堆疊方法，可切換不同評估指標排序
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              {metricDefinitions.map((metricItem) => (
                <button
                  key={metricItem.key}
                  onClick={() => setRankingMetric(metricItem.key)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    rankingMetric === metricItem.key
                      ? "border-[#93b5c6] bg-[#93b5c6] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#93b5c6]/60 hover:bg-[#f7f3ec]"
                  }`}
                >
                  {metricItem.label}
                </button>
              ))}
            </div>

            {rankedModelData.length > 0 ? (
              <div className="overflow-y-auto pr-2" style={{ maxHeight: 560 }}>
                <ResponsiveContainer width="100%" height={rankingChartHeight}>
                  <BarChart
                    data={rankedModelData}
                    layout="vertical"
                    margin={{ top: 20, right: 36, left: 8, bottom: 20 }}
                    barCategoryGap={14}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      domain={[rankingAxisMin, 1]}
                      tickFormatter={(value) => value.toFixed(4)}
                    />
                    <YAxis
                      type="category"
                      dataKey="modelLabel"
                      width={125}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const row = payload[0].payload;

                        return (
                          <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg">
                            <div className="font-semibold text-slate-900">
                              {row.modelLabel}
                            </div>
                            <div className="mt-1 text-slate-500">
                              {row.modelTypeLabel} ｜ {row.Strategy}
                            </div>

                            <div className="mt-2 grid gap-1">
                              {metricDefinitions.map((metricItem) => (
                                <div
                                  key={metricItem.key}
                                  className="flex justify-between gap-4"
                                >
                                  <span>{metricItem.label}</span>
                                  <span className="font-semibold tabular-nums">
                                    {asNumber(row[metricItem.key]).toFixed(4)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey={rankingMetric}
                      name={selectedRankingMetricDefinition.label}
                      fill={selectedRankingMetricDefinition.fill}
                      radius={[0, 10, 10, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
                找不到目前 Strategy 的排行榜資料
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Precision–Recall 取捨散點圖</CardTitle>
            <CardDescription>
              X 軸 Recall，Y 軸 Precision；每個點代表一個模型
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setPrZoomDomains((prev) =>
                    zoomDomainsByFactor(
                      prev ?? prFullDomains,
                      prFullDomains,
                      0.82
                    )
                  )
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
              >
                放大
              </button>

              <button
                type="button"
                onClick={() =>
                  setPrZoomDomains((prev) =>
                    zoomDomainsByFactor(
                      prev ?? prFullDomains,
                      prFullDomains,
                      1.18
                    )
                  )
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
              >
                縮小
              </button>

              <button
                type="button"
                onClick={() => setPrZoomDomains(null)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
              >
                重置縮放
              </button>
            </div>

            <div
              ref={prChartRef}
              className="h-96 w-full cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
              onPointerDown={(event) =>
                handlePanStart(event, "pr", prDisplayDomains)
              }
              onPointerMove={(event) =>
                handlePanMove(
                  event,
                  "pr",
                  prFullDomains,
                  setPrZoomDomains
                )
              }
              onPointerUp={handlePanEnd}
              onPointerLeave={handlePanEnd}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 24, bottom: 24, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="Recall"
                    name="Recall"
                    domain={prDisplayDomains.x}
                    tickCount={5}
                    tickFormatter={(value) => value.toFixed(4)}
                  />
                  <YAxis
                    type="number"
                    dataKey="Precision"
                    name="Precision"
                    domain={prDisplayDomains.y}
                    tickCount={5}
                    tickFormatter={(value) => value.toFixed(4)}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg">
                          <div className="font-semibold text-slate-900">{row.modelLabel}</div>
                          <div className="mt-1 text-slate-500">{row.modelTypeLabel} ｜ {row.Strategy}</div>
                          <div className="mt-2 grid gap-1">
                            <div>Precision：<span className="font-semibold tabular-nums">{row.Precision.toFixed(4)}</span></div>
                            <div>Recall：<span className="font-semibold tabular-nums">{row.Recall.toFixed(4)}</span></div>
                            <div>F1：<span className="font-semibold tabular-nums">{row.F1.toFixed(4)}</span></div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend />
                  <Scatter name="Base Models" data={prBaseData} fill="#93b5c6" />
                  <Scatter name="Stacking Methods" data={prStackData} fill="#d7816a" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>模型錯誤組成堆疊長條圖：FP vs FN</CardTitle>
            <CardDescription>
              比較目前 Strategy 下各模型錯誤來源，觀察偏假陽性或偏假陰性
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorCompositionData.length > 0 ? (
              <div className="overflow-x-auto py-2">
                <div style={{ width: errorChartWidth }}>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart
                      data={errorCompositionData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 90 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="modelLabel"
                        angle={-28}
                        textAnchor="end"
                        interval={0}
                        height={92}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, errorYAxisMax]}
                        tickCount={5}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const row = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg">
                              <div className="font-semibold text-slate-900">{row.modelLabel}</div>
                              <div className="mt-1 text-slate-500">{row.modelTypeLabel} ｜ {row.Strategy}</div>
                              <div className="mt-2 grid gap-1">
                                <div>FP：<span className="font-semibold tabular-nums">{row.FP}</span></div>
                                <div>FN：<span className="font-semibold tabular-nums">{row.FN}</span></div>
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Legend />
                      <Bar dataKey="FP" name="False Positive" stackId="error" fill="#93b5c6" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="FN" name="False Negative" stackId="error" fill="#d7816a" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
                找不到目前 Strategy 的 FP / FN 資料
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/80 shadow-[0_14px_40px_rgba(147,181,198,0.12)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>基礎模型穩定性圖</CardTitle>
            <CardDescription>
              比較同一 base model 在不同 Strategy / K 下的 {stabilityMetricOptions.find((item) => item.key === stabilityMetric)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {strategyTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedStrategyType(type)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      selectedStrategyType === type
                        ? "border-[#93b5c6] bg-[#93b5c6] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#93b5c6]/60"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {stabilityMetricOptions.map((metricItem) => (
                  <button
                    key={metricItem.key}
                    onClick={() => setStabilityMetric(metricItem.key)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      stabilityMetric === metricItem.key
                        ? "border-[#d7816a] bg-[#d7816a] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#d7816a]/60"
                    }`}
                  >
                    {metricItem.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-500">
                  Y 軸範圍：{stabilityYAxisDomain[0].toFixed(4)} ～ {stabilityYAxisDomain[1].toFixed(4)}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStabilityZoomLevel((level) => Math.min(level + 1, 30))}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
                  >
                    放大 Y 軸
                  </button>

                  <button
                    type="button"
                    onClick={() => setStabilityZoomLevel((level) => Math.max(level - 1, -4))}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
                  >
                    縮小 Y 軸
                  </button>

                  <button
                    type="button"
                    onClick={() => setStabilityZoomLevel(0)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#93b5c6] hover:bg-[#f7f3ec]"
                  >
                    重置 Y 軸
                  </button>
                </div>
              </div>
            </div>

            {stabilityChartData.length >= 2 && stabilityModelNames.length > 0 ? (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stabilityChartData} margin={{ top: 18, right: 24, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="strategyLabel"
                      angle={-24}
                      textAnchor="end"
                      interval={0}
                      height={72}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      domain={stabilityYAxisDomain}
                      tickCount={6}
                      tickFormatter={(value) => value.toFixed(4)}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        value == null ? "-" : Number(value).toFixed(4),
                        formatModelName(name),
                      ]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      wrapperStyle={{
                        fontSize: 11,
                        paddingTop: 24,
                        transform: "translateY(18px)",
                      }}
                    />
                    {stabilityModelNames.map((model, index) => (
                      <Line
                        key={model}
                        type="monotone"
                        dataKey={model}
                        name={formatModelName(model)}
                        stroke={lineColors[index % lineColors.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm leading-7 text-slate-500">
                目前 Strategy_Type 只有單一 K 或沒有重複出現的 base model，無法形成跨 Strategy / K 的穩定性折線比較。
              </div>
            )}
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
