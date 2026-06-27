import React, { useState, useEffect } from 'react';
import { User, FileText, Image as ImageIcon, Power, Sun, CloudRain, Cloud, CloudLightning, Globe } from 'lucide-react';

interface StartMenuProps {
    lang: 'zh' | 'en' | 'ja'; // 網頁語言
    isOpen: boolean;      // 開始選單展開布林狀態
    onClose: () => void;   // 關閉開始選單的方法
    apps: { id: string; title: string; titleEn: string; titleJa: string; iconName: string }[]; // 應用選單
    onOpenApp: (id: any) => void;                            // 開啟分頁的調度器
}

/**
 * StartMenu 元件：模擬 Windows 10 開始功能表與釘選磁貼 (Live Tiles)
 * 整合了 IP+GPS 雙導向氣壓天氣定位、網頁分頁關閉電源鍵、以及全白底高對比磁貼
 * 本元件之文字、選單標題、磁貼提示，全面綁定傳入的 lang 以實現真正的多語同步切換
 */
export const StartMenu: React.FC<StartMenuProps> = ({
    lang,
    isOpen,
    onClose,
    apps,
    onOpenApp,
}) => {
    // 判定語言變數
    const isEn = lang === 'en';
    const isJa = lang === 'ja';

    // 預設城市名、氣溫、狀態
    const defaultCity = isJa ? '台北' : isEn ? 'Taipei' : '台北市';
    const [weatherCity, setWeatherCity] = useState(defaultCity);
    const [weatherTemp, setWeatherTemp] = useState('26°C');
    const [weatherDesc, setWeatherDesc] = useState(isJa ? '晴れ' : isEn ? 'Sunny' : '晴天');
    const [weatherCode, setWeatherCode] = useState(0);

    // 主天氣抓取非同步任務
    const fetchWeather = async (lat: number, lon: number, cityName: string) => {
        try {
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            const weatherData = await weatherRes.json();

            const temp = Math.round(weatherData.current_weather.temperature);
            const code = weatherData.current_weather.weathercode;
            setWeatherCode(code);

            // 翻譯 WMO 標準氣候代碼為多國語言文字表示
            let desc = isJa ? '晴れ' : isEn ? 'Sunny' : '晴天';
            if (code >= 1 && code <= 3) desc = isJa ? '曇り' : isEn ? 'Partly Cloudy' : '多雲';
            else if (code >= 45 && code <= 48) desc = isJa ? '霧' : isEn ? 'Foggy' : '有霧';
            else if (code >= 51 && code <= 67) desc = isJa ? '雨' : isEn ? 'Drizzle & Rain' : '細雨/有雨';
            else if (code >= 71 && code <= 86) desc = isJa ? '雪' : isEn ? 'Snowy' : '降雪';
            else if (code >= 95) desc = isJa ? '雷雨' : isEn ? 'Stormy' : '雷陣雨';

            setWeatherCity(cityName);
            setWeatherTemp(`${temp}°C`);
            setWeatherDesc(desc);
        } catch (e) {
            // 靜默出錯
        }
    };

    // 點開開始選單直接自動觸發 GPS / IP 天氣定位
    useEffect(() => {
        let active = true;

        const fetchLocationAndWeather = async () => {
            const defaultLat = 25.033;
            const defaultLon = 121.564;
            const fallbackCity = isJa ? '台北' : isEn ? 'Taipei' : '台北市';

            if (!active) return;

            // 主動向瀏覽器請求地理權限
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        if (!active) return;
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;
                        let cityName = isJa ? '現在地' : isEn ? 'My Location' : '所在地區';

                        try {
                            const rgeores = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang === 'zh' ? 'zh-Hant' : lang === 'ja' ? 'ja' : 'en'}`);
                            const rgeodata = await rgeores.json();
                            cityName = rgeodata.city || rgeodata.locality || rgeodata.principalSubdivision || cityName;
                        } catch (err) {
                            // 靜默出錯
                        }

                        fetchWeather(lat, lon, cityName);
                    },
                    () => {
                        // 拒絕或失敗時，用 IP 反向查詢
                        fetchIPLocation().catch(() => {
                            fetchWeather(defaultLat, defaultLon, fallbackCity);
                        });
                    },
                    { timeout: 7000 }
                );
            } else {
                fetchIPLocation().catch(() => {
                    fetchWeather(defaultLat, defaultLon, fallbackCity);
                });
            }
        };

        const fetchIPLocation = async () => {
            const geoRes = await fetch('https://ipapi.co/json/');
            const geoData = await geoRes.json() as any;

            if (!active) return;
            const lat = parseFloat(geoData.latitude) || 25.033;
            const lon = parseFloat(geoData.longitude) || 121.564;
            const city = geoData.city || (isJa ? '台北' : isEn ? 'Taipei' : '台北市');
            fetchWeather(lat, lon, city);
        };

        if (isOpen) {
            fetchLocationAndWeather();
        }

        return () => {
            active = false;
        };
    }, [isOpen, lang]); // 監聽開始選單打開及語言變更

    // 切換預設語言字元對齊
    useEffect(() => {
        // 當使用者中途變更網頁語言且未定位前，預載預設的城市標籤
        setWeatherCity(prev => {
            if (prev === '台北市' || prev === 'Taipei' || prev === '台北') {
                return isJa ? '台北' : isEn ? 'Taipei' : '台北市';
            }
            return prev;
        });
        setWeatherDesc(prev => {
            if (prev === '晴天' || prev === 'Sunny' || prev === '晴れ') {
                return isJa ? '晴れ' : isEn ? 'Sunny' : '晴天';
            }
            return prev;
        });
    }, [lang]);

    if (!isOpen) return null;

    // 開始選單項目點選分合流
    const handleAppClick = (id: any) => {
        onOpenApp(id);
        onClose();
    };

    // 關閉系統電源
    const handleShutdown = () => {
        const confirmMsg = isJa
            ? 'システムをシャットダウンし、ブラウザのタブを閉じてもよろしいですか？'
            : isEn
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
            <div className="flex flex-col justify-between items-center w-12 border-r border-neutral-200 bg-neutral-100 bg-opacity-80 py-4 h-full flex-shrink-0 animate-window-open">
                <div className="flex flex-col space-y-4">
                    <button title={isJa ? "プロフィール" : isEn ? "Profile" : "個人資料"} className="p-2.5 rounded hover:bg-neutral-250 text-neutral-700 transition-colors duration-100">
                        <User size={18} />
                    </button>
                </div>

                <div className="flex flex-col space-y-2">
                    <button title={isJa ? "ドキュメント" : isEn ? "Documents" : "文件夾"} className="p-2.5 rounded hover:bg-neutral-250 text-neutral-700 transition-colors duration-100">
                        <FileText size={18} />
                    </button>
                    <button title={isJa ? "ピクチャ" : isEn ? "Pictures" : "圖片集"} className="p-2.5 rounded hover:bg-neutral-250 text-neutral-700 transition-colors duration-100">
                        <ImageIcon size={18} />
                    </button>
                    {/* 電源按鈕 */}
                    <button
                        onClick={handleShutdown}
                        title={isJa ? "システム終了" : isEn ? "Shutdown & Close tab" : "安全系統關鍵電源"}
                        className="p-2.5 rounded hover:bg-red-100 text-red-650 transition-colors duration-100"
                    >
                        <Power size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* 2. 開始功能表中間：應用程式功能樹目錄 */}
            <div className="flex flex-col flex-1 py-4 px-2 overflow-y-auto bg-neutral-50 bg-opacity-40">
                <span className="text-[11px] font-bold text-neutral-500 px-3 py-1 mb-1 select-none">
                    {isJa ? "システムメニューのディレクトリ" : isEn ? "System Menu Directory" : "系統功能目錄"}
                </span>
                <div className="flex flex-col space-y-[2px]">
                    {apps.map((app) => {
                        let title = lang === 'en' ? app.titleEn : lang === 'ja' ? app.titleJa : app.title;
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

            {/* 3. 開始選單右部：釘選磁貼動態磚 */}
            <div className="hidden sm:grid grid-cols-3 gap-2 p-4 w-[360px] overflow-y-auto bg-neutral-100 bg-opacity-60 border-l border-neutral-200 content-start flex-shrink-0">
                <div className="col-span-3 text-[11px] font-bold text-neutral-500 mb-1 select-none">
                    {isJa ? "ピン留めされたライブタイル" : isEn ? "Pinned Live Tiles" : "釘選的動態磚"}
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
                        {isJa ? 'プロフィール (About)' : isEn ? 'About Me' : '關於我 (About Me)'}
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
                        <Globe size={14} className="text-neutral-505 group-hover:text-[#0078d7]" />
                    </div>
                    <div className="text-[12px] font-bold group-hover:translate-x-1 transition-transform">
                        <span className="text-neutral-900 font-extrabold">
                            {isJa ? '便利ツール箱 (Tools)' : isEn ? 'Developer Tools App (Tools)' : '實用開發工具箱 (Tools)'}
                        </span><br />
                        <span className="text-[10px] text-neutral-500 font-bold block leading-tight pt-0.5">
                            {isJa
                                ? 'Base64変換、AES暗号化、UUID生成など14個のツール箱。'
                                : isEn
                                    ? 'Base64, AES cbc code, UUID generators, 14 utilities.'
                                    : 'Base64加解密、密碼產生器與進位換算等 14 種工具'
                            }
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
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </div>
                    <span className="text-[12px] font-bold truncate group-hover:translate-x-1 transition-transform">
                        {isJa ? "GitHubへ移動" : isEn ? "View GitHub Repo" : "前往 GitHub 倉庫"}
                    </span>
                </a>

                {/* Twitter 貼紙 */}
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-1 bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-155 p-3 h-24 flex flex-col justify-between cursor-pointer group shadow"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span className="text-[10px] font-bold group-hover:scale-105 transition-transform text-center pt-2">
                        {isJa ? "ツイッター" : isEn ? "Twitter" : "社群 Twitter"}
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
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </div>
                    <span className="text-[12px] font-bold truncate group-hover:translate-x-1 transition-transform">
                        {isJa ? "LinkedInで繋がる" : isEn ? "Connect on LinkedIn" : "加入 LinkedIn 專家朋友圈"}
                    </span>
                </a>

            </div>
        </div>
    );
};
