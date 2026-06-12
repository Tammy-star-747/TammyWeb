import React, { useState, useEffect } from 'react';
import { User, FileText, Image as ImageIcon, Power, Github, Twitter, Linkedin, ExternalLink, Sun, CloudRain, Cloud, CloudLightning } from 'lucide-react';

interface StartMenuProps {
    isOpen: boolean;      // 開始選單展開布林狀態
    onClose: () => void;   // 關閉開始選單的方法
    apps: { id: string; title: string; iconName: string }[]; // 應用選單
    onOpenApp: (id: any) => void;                            // 開啟分頁的調度器
}

/**
 * StartMenu 元件：模擬 Windows 10 開始功能表與釘選磁貼 (Live Tiles)
 * 整合了 IP+GPS 雙導向氣壓天氣定位、網頁分頁關閉電源鍵、以及全白底高對比磁貼
 */
export const StartMenu: React.FC<StartMenuProps> = ({
    isOpen,
    onClose,
    apps,
    onOpenApp,
}) => {
    // 動態天氣資訊狀態，預設為伺服器基準
    const [weatherCity, setWeatherCity] = useState('台北市');
    const [weatherTemp, setWeatherTemp] = useState('26°C');
    const [weatherDesc, setWeatherDesc] = useState('晴天');
    const [weatherCode, setWeatherCode] = useState(0);

    // 瀏覽器多語言判定
    const isEn = !navigator.language.toLowerCase().startsWith('zh');

    // GPS 結合 IP 雙導向地理與氣候定位運算
    useEffect(() => {
        let active = true;

        // 主天氣抓取非同步任務
        const fetchWeather = async (lat: number, lon: number, cityName: string) => {
            try {
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                );
                const weatherData = await weatherRes.json();

                if (!active) return;

                const temp = Math.round(weatherData.current_weather.temperature);
                const code = weatherData.current_weather.weathercode;
                setWeatherCode(code);

                // 翻譯 WMO 標準氣候代碼為文字表示
                let desc = isEn ? 'Sunny' : '晴天';
                if (code >= 1 && code <= 3) desc = isEn ? 'Partly Cloudy' : '多雲';
                else if (code >= 45 && code <= 48) desc = isEn ? 'Foggy' : '有霧';
                else if (code >= 51 && code <= 67) desc = isEn ? 'Drizzle & Rain' : '細雨/有雨';
                else if (code >= 71 && code <= 86) desc = isEn ? 'Snowy' : '降雪';
                else if (code >= 95) desc = isEn ? 'Stormy' : '雷陣雨';

                setWeatherCity(cityName);
                setWeatherTemp(`${temp}°C`);
                setWeatherDesc(desc);
            } catch (e) {
                // 靜默出錯處理
            }
        };

        // 啟動定位判定
        const startLocateAndWeather = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        if (!active) return;
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;
                        let customName = isEn ? 'My Location' : '所在地區';
                        fetchWeather(lat, lon, customName);
                    },
                    async () => {
                        try {
                            const locRes = await fetch('https://ipapi.co/json/');
                            const locData = await locRes.json();
                            if (locData.city && active) {
                                fetchWeather(locData.latitude, locData.longitude, locData.city);
                            }
                        } catch (err) {
                            fetchWeather(25.033, 121.564, isEn ? 'Taipei' : '台北市');
                        }
                    },
                    { timeout: 5000 }
                );
            } else {
                fetchWeather(25.033, 121.564, isEn ? 'Taipei' : '台北市');
            }
        };

        if (isOpen) {
            startLocateAndWeather();
        }

        return () => {
            active = false;
        };
    }, [isOpen, isEn]);

    if (!isOpen) return null;

    // 開始選單項目點選分合流
    const handleAppClick = (id: any) => {
        onOpenApp(id);
        onClose();
    };

    // 關閉系統電源
    const handleShutdown = () => {
        const confirmMsg = isEn
            ? 'Are you sure you want to shut down this system and close the webpage?'
            : '確定要關閉系統並關閉目前網頁分頁嗎？';
        if (confirm(confirmMsg)) {
            window.close();
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 100);
        }
    };

    // 實時映射天氣圖標
    const renderWeatherIcon = () => {
        if (weatherCode >= 95) return <CloudLightning size={24} className="text-yellow-600 animate-pulse" />;
        if (weatherCode >= 51) return <CloudRain size={24} className="text-sky-500" />;
        if (weatherCode >= 1) return <Cloud size={24} className="text-neutral-500 animate-bounce" />;
        return <Sun size={24} className="text-amber-500 animate-spin-slow" />;
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-12 left-0 w-[640px] max-w-[98vw] h-[525px] shadow-2xl border border-neutral-300 bg-white bg-opacity-95 text-neutral-800 flex z-[9999] select-none text-sm font-win animate-window-open backdrop-blur-xl"
        >
            {/* 1. 開始選單最左側快捷圖示帶 (Power, settings, documents) */}
            <div className="flex flex-col justify-between items-center w-12 border-r border-neutral-200 bg-neutral-100 bg-opacity-80 py-4 h-full flex-shrink-0">
                <div className="flex flex-col space-y-4">
                    <button title={isEn ? "Profile" : "個人資料"} className="p-2.5 rounded hover:bg-neutral-250 text-neutral-700 transition-colors duration-100">
                        <User size={18} />
                    </button>
                </div>

                <div className="flex flex-col space-y-2">
                    <button title={isEn ? "Documents" : "文件夾"} className="p-2.5 rounded hover:bg-neutral-250 text-neutral-700 transition-colors duration-100">
                        <FileText size={18} />
                    </button>
                    <button title={isEn ? "Pictures" : "圖片集"} className="p-2.5 rounded hover:bg-neutral-250 text-neutral-700 transition-colors duration-100">
                        <ImageIcon size={18} />
                    </button>
                    {/* 電源按鈕 */}
                    <button
                        onClick={handleShutdown}
                        title={isEn ? "Shutdown & Close tab" : "安全系統關鍵電源"}
                        className="p-2.5 rounded hover:bg-red-100 text-red-650 transition-colors duration-100"
                    >
                        <Power size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* 2. 開始功能表中間：應用程式功能樹目錄 */}
            <div className="flex flex-col flex-1 py-4 px-2 overflow-y-auto bg-neutral-50 bg-opacity-40">
                <span className="text-[11px] font-bold text-neutral-500 px-3 py-1 mb-1 select-none">
                    {isEn ? "System Menu Directory" : "系統功能目錄"}
                </span>
                <div className="flex flex-col space-y-[2px]">
                    {apps.map((app) => {
                        let title = app.title;
                        if (isEn) {
                            if (app.id === 'about') title = 'About Me (🙍 Profile)';
                            else if (app.id === 'tools') title = 'Tools Suite (🛠️ Utils)';
                            else if (app.id === 'projects') title = 'Projects (📂 Works)';
                            else if (app.id === 'logs') title = 'Developer Logs (📝 Notepad)';
                            else if (app.id === 'guestbook') title = 'Guestbook (💬 Remarks)';
                            else if (app.id === 'cmd') title = 'Command Prompt (💻 CMD)';
                        }

                        return (
                            <button
                                key={app.id}
                                onClick={() => handleAppClick(app.id)}
                                className="flex items-center space-x-3 px-3 py-2 text-left hover:bg-neutral-200 rounded transition-colors text-neutral-855 duration-100"
                            >
                                <span className="text-xl leading-none">{app.iconName}</span>
                                <span className="text-xs truncate font-bold text-neutral-855">{title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. 開始選單右部：釘選磁貼動態磚動態群 */}
            <div className="hidden sm:grid grid-cols-3 gap-2 p-4 w-[360px] overflow-y-auto bg-neutral-100 bg-opacity-60 border-l border-neutral-200 content-start flex-shrink-0">
                <div className="col-span-3 text-[11px] font-bold text-neutral-500 mb-1 select-none">
                    {isEn ? "Pinned Live Tiles" : "釘選的動態磚"}
                </div>

                {/* 關於我磁貼 */}
                <div
                    onClick={() => handleAppClick('about')}
                    className="col-span-2 row-span-1 bg-[#0078d7] hover:bg-blue-600 transition-colors duration-150 p-3 h-24 flex flex-col justify-between cursor-pointer group shadow text-white"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[26px]">🙍</span>
                    </div>
                    <span className="text-[12px] font-bold truncate group-hover:translate-x-1 transition-transform">
                        {isEn ? 'About Me' : '關於我 (About Me)'}
                    </span>
                </div>

                {/* 天氣 */}
                <div className="col-span-1 row-span-1 bg-sky-100 hover:bg-sky-200 p-3 h-24 flex flex-col justify-between shadow select-none cursor-default border border-sky-200 text-neutral-803 transition-all">
                    <div className="flex justify-between items-start">
                        {renderWeatherIcon()}
                        <span className="text-sm font-extrabold font-mono text-neutral-850 tabular-nums">{weatherTemp}</span>
                    </div>
                    <div className="text-[10px] leading-tight font-bold text-neutral-750 truncate" title={weatherCity}>
                        {weatherCity}<br />
                        <span className="text-[#0078d7] font-extrabold">{weatherDesc}</span>
                    </div>
                </div>

                {/* 常用開發工具箱 */}
                <div
                    onClick={() => handleAppClick('tools')}
                    className="col-span-3 bg-white hover:bg-neutral-55 border border-neutral-300 hover:border-neutral-400 p-3 h-24 flex flex-col justify-between cursor-pointer group shadow-sm text-neutral-808 transition-all"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[26px]">🛠️</span>
                        <ExternalLink size={14} className="text-neutral-505 group-hover:text-[#0078d7]" />
                    </div>
                    <div className="text-[12px] font-bold group-hover:translate-x-1 transition-transform">
                        <span className="text-neutral-900 font-extrabold">{isEn ? 'Developer Tools App (Tools)' : '實用開發工具箱 (Tools)'}</span><br />
                        <span className="text-[10px] text-neutral-500 font-bold block leading-tight pt-0.5">
                            {isEn ? 'Base64, word stats, color pickers, AES cbc code generators.' : 'Base64加解密、字數統計與色板等 14 種工具'}
                        </span>
                    </div>
                </div>

                {/* GitHub 貼紙 */}
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 bg-[#2d333b] hover:bg-neutral-850 text-white transition-colors duration-155 p-3 h-24 flex flex-col justify-between cursor-pointer group shadow"
                >
                    <div className="flex justify-between items-start">
                        <Github size={24} />
                    </div>
                    <span className="text-[12px] font-bold truncate group-hover:translate-x-1 transition-transform">
                        {isEn ? 'View GitHub Repo' : '前往 GitHub 倉庫'}
                    </span>
                </a>

                {/* Twitter 貼紙 */}
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-1 bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-155 p-3 h-24 flex flex-col justify-between cursor-pointer group shadow"
                >
                    <Twitter size={20} />
                    <span className="text-[10px] font-bold group-hover:scale-105 transition-transform text-center pt-2">
                        {isEn ? 'Twitter' : '社群 Twitter'}
                    </span>
                </a>

                {/* LinkedIn 貼紙 */}
                <a
                    href="https://www.linkedin.com/in/chunwei-chang-b1916a39b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-3 bg-[#0077b5] hover:bg-[#006097] text-white transition-colors duration-155 p-3 h-20 flex flex-col justify-between cursor-pointer group shadow"
                >
                    <div className="flex justify-between items-start">
                        <Linkedin size={24} />
                    </div>
                    <span className="text-[12px] font-bold truncate group-hover:translate-x-1 transition-transform">
                        {isEn ? 'Connect on LinkedIn' : '加入 LinkedIn 專家朋友圈'}
                    </span>
                </a>

            </div>
        </div>
    );
};
