import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Wifi, MessageSquare } from 'lucide-react';

interface TaskbarProps {
    apps: { id: string; title: string; titleEn: string; titleJa: string; iconName: string }[];
    activeTab: string;
    activeLang: 'zh' | 'en' | 'ja';                // 當前啟用語言
    onLangChange: (lang: 'zh' | 'en' | 'ja') => void; // 變更語言的方法
    onStartClick: () => void;
    onClockClick: () => void;
    onTabClick: (id: any) => void;
}

/**
 * Taskbar 元件：精製底部 Windows 經典工作列 (明亮光澤 Fluent 套件)
 * 整合仿 Windows 10 鍵盤語系切換的「彈出式下拉式選單」
 */
export const Taskbar: React.FC<TaskbarProps> = ({
    apps,
    activeTab,
    activeLang,
    onLangChange,
    onStartClick,
    onClockClick,
    onTabClick,
}) => {
    const [time, setTime] = useState(new Date());
    // 控制語言下拉式選單是否開啟
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);

    // 時間每秒刷新
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 監聽全局點擊事件以自動關閉語言下拉式選單
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (isLangOpen && langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
                setIsLangOpen(false);
            }
        };
        window.addEventListener('mousedown', handleOutsideClick);
        return () => window.removeEventListener('mousedown', handleOutsideClick);
    }, [isLangOpen]);

    const isEn = activeLang === 'en';
    const isJa = activeLang === 'ja';

    const timeString = time.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateString = time.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });

    // 篩選掉 'cmd' 使之不釘選於工作列
    const pinnedApps = apps.filter(app => app.id !== 'cmd');

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 w-full h-[48px] bg-white bg-opacity-80 backdrop-blur-md border-t border-neutral-250 flex items-center justify-between select-none z-[99999] px-0.5 text-neutral-808 font-win transition-all"
        >
            {/* 1. 開始按鈕 */}
            <div className="flex items-center h-full flex-shrink-0">
                <button
                    onClick={onStartClick}
                    title={isEn ? "Start Menu" : isJa ? "スタート" : "開始功能表"}
                    className="flex items-center justify-center w-[48px] h-full hover:bg-neutral-200 transition-colors duration-100 text-sky-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current text-[#0078d7]">
                        <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.102zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
                    </svg>
                </button>
            </div>

            {/* 2. 中間：靠左對齊釘選應用 (About, Tools, Links) */}
            <div className="flex flex-1 items-center h-full px-2 overflow-x-auto space-x-0.5 justify-start scrollbar-none border-l border-neutral-255 ml-1">
                {pinnedApps.map((app) => {
                    const isActive = activeTab === app.id;

                    let label = app.title.split(' ')[0];
                    if (isEn) {
                        label = app.titleEn.split(' ')[0];
                    } else if (isJa) {
                        label = app.titleJa.split(' ')[0];
                    }

                    return (
                        <button
                            key={app.id}
                            onClick={() => {
                                onTabClick(app.id);
                                setIsLangOpen(false); // 切換分頁時，關閉語系選單
                            }}
                            className={`flex items-center space-x-2 px-3.5 h-[40px] transition-all relative border border-transparent rounded-sm flex-shrink-0 duration-100 ${isActive
                                ? 'bg-neutral-200 bg-opacity-90 text-neutral-900 font-bold border-neutral-350 shadow-sm'
                                : 'bg-transparent text-neutral-750 hover:bg-neutral-100 hover:text-neutral-950'
                                }`}
                        >
                            <span className="text-lg leading-none">{app.iconName}</span>
                            <span className="text-xs truncate block max-w-[80px] sm:max-w-none text-[11px] font-bold leading-tight select-none">
                                {label}
                            </span>

                            {/* 微軟藍底指示條 */}
                            <div
                                className={`absolute bottom-[0.5px] left-[10%] right-[10%] h-[2.5px] rounded-sm transition-all duration-100 ${isActive ? 'bg-[#0078d7] w-[80%]' : 'bg-neutral-400 w-[20%] left-[40%] opacity-0 hover:opacity-100'
                                    }`}
                            />
                        </button>
                    );
                })}
            </div>

            {/* 3. 右側：系統狀態托盤列 */}
            <div className="flex items-center h-full text-neutral-650 flex-shrink-0 font-semibold pr-1">

                {/* === 新增：語言切換下拉選單觸發按鈕 === */}
                <div className="relative pr-1" ref={langMenuRef}>
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className={`px-1.5 py-0.5 hover:bg-neutral-150 rounded transition-colors text-[10px] font-bold text-[#0078d7] border border-[#0078d7] border-opacity-40 leading-none select-none shrink-0`}
                        title={isEn ? "Language Selector" : isJa ? "言語設定" : "系統語言型選單"}
                    >
                        {activeLang === 'zh' ? '繁' : activeLang === 'ja' ? '日' : 'ENG'}
                    </button>

                    {/* === Windows 10 風格明亮下拉式語系選單 === */}
                    {isLangOpen && (
                        <div
                            className="absolute bottom-11 right-0 w-52 bg-white bg-opacity-95 shadow-2xl border border-neutral-300 p-1 flex flex-col space-y-0.5 z-[999999] animate-window-open text-xs rounded-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 選項一：繁體中文 */}
                            <button
                                onClick={() => {
                                    onLangChange('zh');
                                    setIsLangOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-sm transition-colors ${activeLang === 'zh'
                                    ? 'bg-neutral-100 text-[#0078d7] font-bold'
                                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 font-semibold'
                                    }`}
                            >
                                <span>繁體中文 (台灣)</span>
                                <span className="text-[10px] text-neutral-400 font-mono">繁</span>
                            </button>

                            {/* 選項二：英文 */}
                            <button
                                onClick={() => {
                                    onLangChange('en');
                                    setIsLangOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-sm transition-colors ${activeLang === 'en'
                                    ? 'bg-neutral-100 text-[#0078d7] font-bold'
                                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 font-semibold'
                                    }`}
                            >
                                <span>English (United States)</span>
                                <span className="text-[10px] text-neutral-400 font-mono">ENG</span>
                            </button>

                            {/* 選項三：日文 */}
                            <button
                                onClick={() => {
                                    onLangChange('ja');
                                    setIsLangOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-sm transition-colors ${activeLang === 'ja'
                                    ? 'bg-neutral-100 text-[#0078d7] font-bold'
                                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 font-semibold'
                                    }`}
                            >
                                <span>日本語 (日本)</span>
                                <span className="text-[10px] text-neutral-400 font-mono">日</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex items-center px-1.5 space-x-2.5 text-xs border-r border-neutral-250 h-full">
                    <button className="p-1 hover:bg-neutral-150 rounded transition-colors text-neutral-600 duration-100" title={isEn ? "Network connected" : "網路已連線"}>
                        <Wifi size={13} strokeWidth={2.5} />
                    </button>
                    <button className="p-1 hover:bg-neutral-150 rounded transition-colors text-neutral-600 duration-100" title={isEn ? "Volume" : "喇叭音量"}>
                        <Volume2 size={13} strokeWidth={2.5} />
                    </button>
                </div>

                <button className="flex items-center justify-center px-2.5 h-full hover:bg-neutral-150 duration-100 text-neutral-600" title={isEn ? "Action Center" : "通知中心"}>
                    <MessageSquare size={13} strokeWidth={2.5} />
                </button>

                <button
                    onClick={onClockClick}
                    className="flex flex-col items-center justify-center hover:bg-neutral-150 h-full px-3 text-center text-[11px]"
                    title={isEn ? "System Calendar" : "系統行事曆"}
                >
                    <span className="font-bold tabular-nums leading-none tracking-wide text-neutral-850">{timeString}</span>
                    <span className="text-[9px] scale-90 pt-0.5 text-neutral-700 font-bold">{dateString}</span>
                </button>

                <div className="w-[4px] h-full border-l border-neutral-250 hover:bg-neutral-200 cursor-pointer" />
            </div>
        </div>
    );
};
