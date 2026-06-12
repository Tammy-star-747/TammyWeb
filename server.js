import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

// 解決 ESM 模範下的 __dirname 變數問題
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001; // 模擬後端伺服器端口

app.use(cors());
app.use(express.json());

// 確保 ip 資料夾存在於根目錄
const ipDir = path.join(__dirname, 'ip');
if (!fs.existsSync(ipDir)) {
    fs.mkdirSync(ipDir);
    console.log('已建立 ip 資料夾！');
}

// 實體 Excel 輸出路徑
const excelPath = path.join(ipDir, 'visits.xlsx');

/**
 * 讀取或初始化 visits.xlsx 檔案
 * @returns {Array} 歷史訪問紀錄陣列
 */
const readExcelData = () => {
    if (!fs.existsSync(excelPath)) {
        return [];
    }
    try {
        const workbook = xlsx.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(sheet);
    } catch (e) {
        console.error('讀取 Excel 失敗，返回空快取。', e);
        return [];
    }
};

/**
 * 將紀錄寫入 visits.xlsx 檔案中
 * @param {Array} data 新的完整紀錄陣列
 */
const writeExcelData = (data) => {
    try {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Visits Log');
        xlsx.writeFile(workbook, excelPath);
        console.log('Excel 檔案更新成功！存放於 /ip/visits.xlsx');
    } catch (e) {
        console.error('寫入 Excel 失敗！', e);
    }
};

// ----------------------------------------------------
// API 路由設計
// ----------------------------------------------------

/**
 * 1. 紀錄訪問 IP 路由器 (POST /api/track)
 * 接受前端上傳的公網 IP 與地理位置資訊，寫入 /ip/visits.xlsx 的 Excel 檔案中
 */
app.post('/api/track', (req, res) => {
    const { ip, country, region } = req.body;

    if (!ip) {
        return res.status(400).json({ success: false, message: 'Missing IP address' });
    }

    // 取得當前訪問紀錄並放入新條目
    const currentLogs = readExcelData();
    const newEntry = {
        IP: ip,
        '國家/地區 (Country)': country || '未識別地區',
        '城市/區域 (Region)': region || '未識別區域',
        '訪問時間 (Timestamp)': new Date().toLocaleString('zh-TW', { hour12: false })
    };

    // 將新紀錄附加在最前面
    const updatedLogs = [newEntry, ...currentLogs];
    writeExcelData(updatedLogs);

    res.json({ success: true, entry: newEntry });
});

/**
 * 2. 獲取所有 IP 紀錄 (GET /api/ips)
 * 讀取 Excel 還原陣列回傳給前端渲染
 */
app.get('/api/ips', (req, res) => {
    const data = readExcelData();
    res.json(data);
});

/**
 * 3. 獲取 Excel 實體檔案下載流 (GET /api/download-excel)
 * 提供實體 Excel 輸出傳送下載
 */
app.get('/api/download-excel', (req, res) => {
    if (fs.existsSync(excelPath)) {
        res.download(excelPath, 'visits.xlsx');
    } else {
        res.status(404).send('Excel file not found yet');
    }
});

// 啟動伺服器監聽
app.listen(PORT, () => {
    console.log(`後端 Express 伺服器已啟動！監聽端口 http://localhost:${PORT}`);
    console.log(`IP 紀錄資料庫將自動匯入保存至：${excelPath}`);
});
