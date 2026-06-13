import React, { useState, useEffect } from 'react';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { CalendarFlyout } from './components/CalendarFlyout';

// 載入子應用程式 / 分頁內容說明
import { AboutMe } from './apps/AboutMe';
import { Tools } from './apps/Tools';
import { Links } from './apps/Links';
import { CMD } from './apps/CMD';

type TabId = 'about' | 'tools' | 'links' | 'cmd';

interface TabDef {
    id: TabId;
    title: string;
    titleEn: string;
    titleJa: string;
    iconName: string;
}

/**
 * App 頂級系統控制器
 * 協同 Windows 10 明亮模式 Dashboard、工作列任務切換與開始選單。
 * 預設打開關於我頁面，新增下拉式語系選單，且視窗關閉 chrome 列已被完全移除！
 */
export default function App() {
    // 全局系統語言狀態，支援：'zh' (繁體中文) | 'en' (英文) | 'ja' (日文)
    const [activeLang, setActiveLang] = useState<'zh' | 'en' | 'ja'>('zh');

    // 當前作用中（展開）的分頁 ID 指針，預設開啟「關於我 (about)」
    const [activeTab, setActiveTab] = useState<TabId>('about');

    // 開始選單及時間行事曆彈窗的展開狀態
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // 後台靜默 IP 數據收集
    useEffect(() => {
        const silentlyTrackVisitor = async () => {
            try {
                const ipRes = await fetch('https://ipapi.co/json/');
                const ipData = await ipRes.json();

                const apiUrl = import.meta.env.DEV
                    ? 'http://127.0.0.1:3001/api/track'
                    : import.meta.env.VITE_API_URL || '';

                if (!apiUrl) {
                    return;
                }

                await fetch(`${apiUrl}/api/track`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ip: ipData.ip,
                        country: ipData.country_name || ipData.country,
                        region: ipData.city || ipData.region,
                    }),
                });
            } catch (err) {
                // 靜默忽略
            }
        };
        silentlyTrackVisitor();
    }, []);

    // 語言變更方法
    const handleLangChange = (lang: 'zh' | 'en' | 'ja') => {
        setActiveLang(lang);
        setIsStartOpen(false);
        setIsCalendarOpen(false);
    };

    // 配置全站的核心功能分頁目錄（日誌、訪客留言簿與 IP Tracker 已經完全廢除刪除！）
    const tabs: TabDef[] = [
        {
            id: 'about',
            title: '關於我 (About)',
            titleEn: 'About Me',
            titleJa: 'プロフィール (About)',
            iconName: '🙍'
        },
        {
            id: 'tools',
            title: '應用工具 (Tools App)',
            titleEn: 'Tools Console',
            titleJa: '便利ツール (Tools)',
            iconName: '🛠️'
        },
        {
            id: 'links',
            title: '常用連結 (Links)',
            titleEn: 'Useful Links',
            titleJa: 'おすすめリンク (Links)',
            iconName: '🔗'
        },
        {
            id: 'cmd',
            title: '命令提示字元 (CMD)',
            titleEn: 'Command Prompt',
            titleJa: 'コマンドプロンプト (CMD)',
            iconName: '💻'
        }
    ];

    // 根據主指標動態渲染對應分頁正文
    const renderActiveContent = () => {
        switch (activeTab) {
            case 'about':
                return <AboutMe lang={activeLang} />;
            case 'tools':
                return <Tools lang={activeLang} />;
            case 'links':
                return <Links lang={activeLang} />;
            case 'cmd':
                return <CMD lang={activeLang} />;
            default:
                return <AboutMe lang={activeLang} />;
        }
    };

    const activeTabDetails = tabs.find(t => t.id === activeTab) || tabs[0];
    const activeTitle = activeLang === 'en'
        ? activeTabDetails.titleEn
        : activeLang === 'ja'
            ? activeTabDetails.titleJa
            : activeTabDetails.title;

    // 點選空白背景關閉時間或選單 Popup 覆蓋層
    const handleGlobalClick = () => {
        setIsStartOpen(false);
        setIsCalendarOpen(false);
    };

    // 執行分頁選單切換與同步覆疊重置
    const handleTabSwitch = (id: TabId) => {
        setActiveTab(id);
        setIsStartOpen(false);
        setIsCalendarOpen(false);
    };

    return (
        <div
            onClick={handleGlobalClick}
            className="relative w-full h-full min-h-screen text-neutral-800 font-win flex flex-col items-center justify-start overflow-hidden bg-cover bg-center select-none"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* 
        1. Fullscreen Main Application Window Frame 
        - 永久 Stretched 全面屏，貼齊工作列上緣 (w-full h-[calc(100vh-48px)] top-0 left-0 border-0 rounded-none)。
        - LIGHT MODE theme style! (White bg-opacity, clean borders, bright and gorgeous outlook).
        - WINDOW CLOSEBAR REMOVED entirely for a seamless portal experience!
      */}
            <div className="w-full h-[calc(100vh-48px)] bg-white bg-opacity-95 shadow-2xl flex flex-col backdrop-blur-xl absolute top-0 left-0 overflow-hidden select-text z-10 transition-all duration-300">

                {/* 核心工作主區（側選邊欄已完全刪除移除！） */}
                <div className="flex-grow flex flex-col min-h-0 bg-white">
                    {/* 導航路徑 Breadcrumb (也已依要求向左對齊，只單純顯示開啟的應用程式名稱！) */}
                    <div className="h-11 bg-[#f3f2f1] border-b border-neutral-250 px-6 flex items-center justify-between select-none shrink-0 text-neutral-520">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0078d7] text-shadow-sm select-none">
                            <span>{activeTabDetails.iconName}</span>
                            <span className="cursor-default tracking-wide font-extrabold">{activeTitle}</span>
                        </div>
                        <span className="hidden sm:inline text-[9px] text-neutral-450 uppercase tracking-widest font-extrabold select-none">
                            {activeLang === 'en'
                                ? 'Windows Light Mode Active'
                                : activeLang === 'ja'
                                    ? 'Windows 10 ライトモード有効'
                                    : 'Windows 10 明亮模式已啟用'
                            }
                        </span>
                    </div>

                    {/* 頁面掛載插槽 (高對比亮白背景，文字完全不衝突不眼花) */}
                    <div className="flex-grow overflow-y-auto min-h-0 relative scroll-smooth select-text bg-white">
                        <div className="w-full h-full min-h-0 animate-window-open animate-once select-text">
                            {renderActiveContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 開始功能表動態彈出面板 */}
            <StartMenu
                isOpen={isStartOpen}
                onClose={() => setIsStartOpen(false)}
                apps={tabs}
                onOpenApp={(id) => handleTabSwitch(id)}
            />

            {/* 3. 時間通知中心行事曆彈窗 */}
            <CalendarFlyout
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
            />

            {/* 4. 底部系統工作列 (CMD 不釘選，支援語言切換選單彈出與 activeLang 狀態對接) */}
            <Taskbar
                apps={tabs}
                activeTab={activeTab}
                activeLang={activeLang}
                onLangChange={handleLangChange}
                onStartClick={() => {
                    setIsStartOpen(!isStartOpen);
                    setIsCalendarOpen(false);
                }}
                onClockClick={() => {
                    setIsCalendarOpen(!isCalendarOpen);
                    setIsStartOpen(false);
                }}
                onTabClick={(id) => handleTabSwitch(id)}
            />
        </div>
    );
}
