import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Heart, BookOpen, Terminal, Sparkles, RefreshCw } from 'lucide-react';

interface AboutMeProps {
    lang: 'zh' | 'en' | 'ja'; // 全局語言傳入
}

/**
 * AboutMe 元件：個人簡介與專業技能樹頁頁
 * 支援繁體中文/英文/日文切換、高解析技能進度條、以及一個高擬真互動型 JSON Web 編輯器模擬框 (時間隨系統跑秒，支援 GMT 跑秒)
 */
export const AboutMe: React.FC<AboutMeProps> = ({ lang }) => {
    // 語言標識輔助
    const isEn = lang === 'en';
    const isJa = lang === 'ja';

    // 對應圖片要求：時間與 ID 實時隨系統時間跑秒狀態
    const [systemTime, setSystemTime] = useState(new Date());

    // 記錄 JSON 模擬器的主題切換分選：'text' | 'tree' | 'table'
    const [activeTab, setActiveTab] = useState<'text' | 'tree' | 'table'>('text');

    // 實時定時計時器：每秒更新系統時間，確保格林威治標準時間 (GMT/UTC) 與 ID 同步跳躍
    useEffect(() => {
        const timer = setInterval(() => {
            setSystemTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 格式化為 ISO 8651 時間字串 (為格林威治標準時間 GMT/UTC 表示，結尾帶 Z)
    const currentISOTime = systemTime.toISOString();

    // 13位毫秒時間印記，完美匹配圖片 "id": 1780378370188
    const currentTimestampId = systemTime.getTime();

    // 技能水平列表 (已加入 PHP, Python, JavaScript, HTML, CSS, MySQL, Redhat, 和 TAROT，並除去任何可能的重複！)
    const skills = [
        { name: 'HTML', level: 80 },
        { name: 'CSS', level: 80 },
        { name: 'JavaScript', level: 85 },
        { name: 'React / Next.js', level: 83 },
        { name: 'Python', level: 95 },
        { name: 'MySQL', level: 86 },
        { name: 'PHP', level: 75 },
        { name: 'Redhat (RHEL)', level: 90 },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 select-text font-win text-sm pb-10 text-neutral-800">

            {/* 1. 主視窗橫幅名片：頭像、個人稱謂與聯絡 */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 pb-6 border-b border-neutral-200">
                <div className="relative group select-none">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur opacity-45 group-hover:opacity-65 transition duration-300"></div>
                    <div className="relative w-28 h-28 bg-neutral-100 rounded-full flex items-center justify-center text-[52px] select-none shadow-sm border border-neutral-250">
                        🐱
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                    <div className="flex flex-col md:flex-row items-center space-y-1.5 md:space-y-0 md:space-x-3">
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-905 font-sans">
                            {isJa ? 'Tammy' : isEn ? 'Tammy' : 'Tammy'}
                        </h1>
                        <span className="bg-[#0078d7] bg-opacity-10 text-[#0078d7] border border-blue-505 border-opacity-35 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide select-none">
                            {isJa ? 'フルスタックエンジニア' : isEn ? 'Full Stack Developer' : '全端開發工程師'}
                        </span>
                    </div>

                    <p className="text-neutral-505 text-xs italic font-bold">
                        {isJa
                            ? '「プログラミングの無限の創造性を探求し、レトロで現代的な美学を融合します」'
                            : isEn
                                ? '“Exploring infinite programming boundaries, infusing vintage nostalgia into modern layouts”'
                                : '「探索程式的無限創意，將老派的情懷融入現代的美學」'
                        }
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600 pt-1 font-semibold">
                        <div className="flex items-center space-x-2">
                            <MapPin size={13} className="text-[#0078d7] shrink-0" />
                            <span>{isJa ? '日本、台湾' : isEn ? 'japan, Taiwan' : '日本，台灣'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail size={13} className="text-[#0078d7] shrink-0" />
                            <span className="select-all">Happy10209@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <BookOpen size={13} className="text-[#0078d7] shrink-0" />
                            <span>
                                {isJa ? '技術嗜好：新規プロジェクトの研究、OS、サーバー、ブロックチェーン、AI、Web3'
                                    : isEn ? 'Tech Hobbies: Researching new projects, OS, Server, Blockchain, AI, Web3'
                                        : '技術愛好：研究新項目、OS 、 Server、 區塊鏈 、 AI 、 Web3'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Heart size={13} className="text-rose-555 fill-rose-50 shrink-0" />
                            <span>
                                {isJa ? '大好物：バイクツーリング、旅行、写真撮影'
                                    : isEn ? 'Favorites: Motorcycle riding, Traveling, Photography'
                                        : '最愛：摩托車騎行、旅行、攝影'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 核心大更新：比照使用者提供之圖片，100% 擬真還原 JSON 編輯器面板 (可點選 Text / Tree / Table，時間與 id 單獨跑秒運算，GMT 標準格林威治時間！) */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold text-neutral-900 flex items-center space-x-2 uppercase tracking-wide border-l-4 border-emerald-500 pl-2 select-none">
                    <Terminal size={15} className="text-emerald-600" />
                    <span>
                        {isJa ? 'システムステータス JSON 端末' : isEn ? 'System Status JSON Console' : '系統即時 JSON 終端機偵錯板'}
                    </span>
                </h2>

                {/* JSON Editor Simulated Dashboard Frame */}
                <div className="w-full border border-[#b8b8b8] shadow-md flex flex-col overflow-hidden text-neutral-800 bg-white font-mono text-[13px] leading-relaxed select-none">

                    {/* Top light gray button bar */}
                    <div className="bg-[#787878] p-1.5 flex items-center justify-between select-none">
                        {/* Left buttons for dynamic tab switching */}
                        <div className="flex items-center space-x-1 pl-1">
                            <button
                                onClick={() => setActiveTab('text')}
                                className={`px-2 py-0.5 text-[11px] font-bold rounded-sm transition-all ${activeTab === 'text'
                                    ? 'bg-white text-neutral-700 border border-neutral-300 shadow-sm'
                                    : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}
                            >
                                text
                            </button>
                            <button
                                onClick={() => setActiveTab('tree')}
                                className={`px-2 py-0.5 text-[11px] font-bold rounded-sm transition-all ${activeTab === 'tree'
                                    ? 'bg-white text-neutral-700 border border-neutral-300 shadow-sm'
                                    : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}
                            >
                                tree
                            </button>
                            <button
                                onClick={() => setActiveTab('table')}
                                className={`px-2 py-0.5 text-[11px] font-bold rounded-sm transition-all ${activeTab === 'table'
                                    ? 'bg-white text-neutral-700 border border-neutral-300 shadow-sm'
                                    : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}
                            >
                                table
                            </button>
                        </div>

                        {/* Right mock tools icons (Replicating the image exactly) */}
                        <div className="flex items-center space-x-3.5 pr-2 text-white opacity-85 select-none text-[12px] font-sans">
                            <span title="Indent" className="cursor-pointer hover:text-neutral-200">⇶</span>
                            <span title="Align" className="cursor-pointer hover:text-neutral-200">⇿</span>
                            <span title="Sort text" className="cursor-pointer hover:text-neutral-200">⇅</span>
                            <span title="Filter block" className="cursor-pointer hover:text-neutral-200">⚡</span>
                            <span title="Search logs" className="cursor-pointer hover:text-neutral-200">🔍</span>
                            <span title="Actions menu" className="cursor-pointer hover:text-neutral-200">:</span>
                            <span title="Undo actions" className="cursor-pointer hover:text-neutral-200">⟲</span>
                            <span title="Redo actions" className="cursor-pointer hover:text-neutral-200">⟳</span>
                        </div>
                    </div>

                    {/* Render Tab 1: "text" Mode (Standard JSON layout with quotes around keys, standard line numbers) */}
                    {activeTab === 'text' && (
                        <div className="flex flex-grow w-full bg-white select-text">

                            {/* Left side line numbers */}
                            <div className="bg-[#f0f0f0] text-[#a0a0a0] py-3 text-right select-none border-r border-[#eaeaea] w-12 flex flex-col font-mono text-[12px] leading-[22px] pr-2.5">
                                <div className="flex items-center justify-end space-x-1">
                                    <span>1</span><span className="text-[9px] text-[#b8b8b8]">v</span>
                                </div>
                                <div>2</div>
                                <div>3</div>
                                <div className="flex items-center justify-end space-x-1">
                                    <span>4</span><span className="text-[9px] text-[#b8b8b8]">v</span>
                                </div>
                                <div>5</div>
                                <div className="text-neutral-600 bg-neutral-200 px-0.5 rounded-sm">6</div>
                                <div>7</div>
                                <div>8</div>
                                <div>9</div>
                            </div>

                            {/* Right side code canvas */}
                            <div className="flex-grow py-3 pl-3.5 text-[13px] leading-[22px] text-neutral-800 font-mono select-text bg-white">
                                <div>{`{`}</div>

                                <div className="pl-4">
                                    <span>"jsonrpc": </span>
                                    <span className="text-[#008000] font-semibold">"2.0"</span>,
                                </div>

                                <div className="pl-4">
                                    <span>"method": </span>
                                    <span className="text-[#008000] font-semibold">"TheSun"</span>,
                                </div>

                                <div className="pl-4">{`"params": {`}</div>

                                <div className="pl-8">
                                    <span>"message": </span>
                                    <span className="text-[#008000] font-semibold">
                                        {isJa
                                            ? '"プロジェクトの期限がまだ一ヶ月ある問題はバグと呼ばれ、期限が残り三日しかない問題は仕様制限と呼ばれます。 ",'
                                            : isEn
                                                ? '"Abnormal code when there is a month left is called a Bug; when there are only three days left, it is called a Specification Limit. ",'
                                                : '"程式異常在期限還有一個月的時候叫做Bug, 在期限還剩三天的時候則稱為規格限制。 ",'
                                        }
                                    </span>
                                </div>

                                {/* Line 6: highlighted bar containing Greenwich Mean Time (toISOString output - GMT/UTC format!) */}
                                <div className="w-full bg-[#f0f0f0] -ml-3.5 pl-11 py-[1px] select-text">
                                    <span className="text-neutral-800">"time": </span>
                                    <span className="text-[#008000] font-bold select-all">"{currentISOTime}"</span>
                                </div>

                                <div className="pl-4">{`},`}</div>

                                <div className="pl-4">
                                    <span>"id": </span>
                                    <span className="text-[#ff3333] font-bold select-all font-mono">{currentTimestampId}</span>
                                </div>

                                <div>{`}`}</div>
                            </div>

                        </div>
                    )}

                    {/* Render Tab 2: "tree" Mode (No line numbers, bold/green values, no quotes around keys, red clock icon next to ID) */}
                    {activeTab === 'tree' && (
                        <div className="flex flex-col w-full bg-white select-text">

                            {/* Second row tool indicator in Tree Mode (Right triangle on left, pencil edit on right) */}
                            <div className="h-7 bg-[#f7f7f7] border-b border-[#eaeaea] px-4 flex items-center justify-between text-neutral-500 text-[11px] select-none shrink-0 font-sans">
                                <span className="text-neutral-700 font-bold select-none cursor-pointer">▶</span>
                                <span className="text-neutral-450 hover:text-neutral-800 cursor-pointer text-xs" title="Edit JSON">📝</span>
                            </div>

                            {/* Tree content area */}
                            <div className="p-3.5 pl-5 text-[13px] leading-[22px] text-neutral-800 font-mono select-text bg-white">
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] text-neutral-400 select-none">▼</span>
                                    <span>{`{`}</span>
                                </div>

                                <div className="pl-5 space-y-0.5">
                                    <div>
                                        <span className="text-neutral-600 font-bold">jsonrpc</span>
                                        <span className="text-neutral-400 mx-1.5">:</span>
                                        <span className="text-[#008000] font-bold">2.0</span>
                                    </div>

                                    <div>
                                        <span className="text-neutral-600 font-bold">method</span>
                                        <span className="text-neutral-400 mx-1.5">:</span>
                                        <span className="text-[#008000] font-bold">TheSun</span>
                                    </div>

                                    <div className="space-y-0.5">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[10px] text-neutral-400 select-none">▼</span>
                                            <span className="text-neutral-600 font-bold">params</span>
                                            <span className="text-neutral-400 mx-1.5">:</span>
                                            <span>{`{`}</span>
                                        </div>

                                        <div className="pl-6 space-y-0.5 border-l border-[#d3d3d3] border-dashed ml-1.5">
                                            <div>
                                                <span className="text-neutral-600 font-bold">message</span>
                                                <span className="text-neutral-400 mx-1.5">:</span>
                                                <span className="text-[#008000] font-semibold">
                                                    {isJa
                                                        ? 'プロジェクトの期限がまだ一ヶ月ある問題はバグと呼ばれ、期限が残り三日しかない問題は仕様制限と呼ばれます。'
                                                        : isEn
                                                            ? 'Abnormal code when there is a month left is called a Bug; when there are only three days left, it is called a Specification Limit.'
                                                            : '程式異常在期限還有一個月的時候叫做Bug, 在期限還剩三天的時候則稱為規格限制。'
                                                    }
                                                </span>
                                            </div>

                                            {/* time in GMT/UTC Greenwich time in Tree mode! */}
                                            <div>
                                                <span className="text-neutral-600 font-bold">time</span>
                                                <span className="text-neutral-400 mx-1.5">:</span>
                                                <span className="text-[#008000] font-bold select-all">{currentISOTime}</span>
                                            </div>
                                        </div>

                                        <div className="pl-4">
                                            <span>{`}`}</span>
                                        </div>
                                    </div>

                                    {/* ID + Red Clock dynamic rendering (Ticking along) */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-neutral-600 font-bold flex-shrink-0">id</span>
                                        <span className="text-neutral-400 flex-shrink-0">:</span>
                                        <span className="text-[#ff3333] font-bold select-all font-mono flex-shrink-0">{currentTimestampId}</span>

                                        {/* Red ticking Clock icon */}
                                        <span
                                            className="text-red-500 text-xs font-bold leading-none cursor-default inline-flex items-center justify-center animate-pulse select-none text-[14px]"
                                        >
                                            🕒
                                        </span>
                                    </div>
                                </div>

                                <div>{`}`}</div>
                            </div>

                        </div>
                    )}

                    {/* Render Tab 3: "table" Mode */}
                    {activeTab === 'table' && (
                        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white text-center select-none min-h-[280px]">
                            <h3 className="text-lg font-bold text-neutral-800 font-sans mb-1.5">An object</h3>
                            <p className="text-xs text-neutral-450 max-w-sm font-semibold font-sans mb-5 leading-normal">
                                An object cannot be opened in table mode. You can open the document in tree mode instead.
                            </p>
                            <button
                                onClick={() => setActiveTab('tree')}
                                className="bg-[#787878] hover:bg-neutral-600 text-white font-bold text-xs py-2 px-5 rounded border border-neutral-400 shadow-sm transition-all select-none"
                            >
                                Switch to tree mode
                            </button>
                        </div>
                    )}

                    {/* Bottom status gray row  */}
                    <div className="bg-[#eaeaea] py-1 px-4 text-[10px] text-neutral-450 border-t border-neutral-300 select-none font-semibold flex items-center justify-start shrink-0">
                        <span>Line: 6  Column: 31</span>
                        <span className="ml-auto flex items-center space-x-1">
                            <RefreshCw size={8} className="animate-spin-slow text-neutral-500" />
                            <span>{isJa ? 'GMT/UTC時間同期処理中' : isEn ? 'Live Synced (GMT/UTC)' : '格林威治標準時間實時同步中'}</span>
                        </span>
                    </div>

                </div>
            </div>

            {/* 3. 自我介紹 (Who I Am) 區區 */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold text-neutral-905 flex items-center space-x-2 uppercase tracking-wide border-l-4 border-[#0078d7] pl-2 select-none">
                    <BookOpen size={15} className="text-[#0078d7]" />
                    <span>{isJa ? '自己紹介' : isEn ? 'Profile (Who I Am)' : '自我介紹 (Who I Am)'}</span>
                </h2>
                <div className="text-neutral-705 leading-relaxed space-y-3 text-xs bg-neutral-50 bg-opacity-70 p-4 border border-neutral-200 rounded font-medium">
                    {isJa ? (
                        <>
                            <p>
                                2019年9月からフルスタック開発を始め、現在まで約8年ほどの開発経験があります。主にPython + MySQLを開発のコアとして使用しており、時折PHPも使用し、サーバーOSに関してはRHELシリーズを好んでいます。開発以外では、時々バーに行って新しい友達を作っておしゃべりするのが好きで、一番のお気に入りの趣味は「バイクで各地を旅すること」です。
                            </p>
                        </>
                    ) : isEn ? (
                        <>
                            <p>
                                I have been working as a full-stack developer since September 2019, which is about 8 years of experience. My development workflow is primarily driven by Python + MySQL, with occasional use of PHP, and I prefer the RHEL family for server operating systems. Apart from developing, I occasionally visit bars to meet new friends and chat, and my absolute favorite hobby is traveling around on my motorcycle.
                            </p>
                        </>
                    ) : (
                        <>
                            <p>
                                自 2019 年 9 月開始開發全端至今，差不多 8 年左右。主要以 Python + MySQL 為開發核心，偶爾也與 PHP 打個招呼，伺服器系統方面偏好 RHEL 系列。除了開發以外，我偶爾會去酒吧認識新朋友聊天，最愛的消遣活動是「騎乘摩托車到處旅遊」。
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* 4. 技能進度條清單區區 */}
            <div className="space-y-4">
                <h2 className="text-sm font-bold text-neutral-900 flex items-center space-x-2 uppercase tracking-wide border-l-4 border-[#0078d7] pl-2 select-none">
                    <Sparkles size={15} className="text-[#0078d7]" />
                    <span>{isJa ? '専門スキル' : isEn ? 'Skills Tree' : '專業技能圖表 (Skills Tree)'}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill, index) => {
                        let displayName = skill.name;
                        // 支援 TAROT 塔羅及其他項目的中英日文轉換表示
                        if (isJa && 'nameJa' in skill) displayName = skill.nameJa as string;
                        else if (isEn && 'nameEn' in skill) displayName = skill.nameEn as string;
                        else if (!isEn && !isJa && skill.name === 'TAROT') displayName = '塔羅牌 (Tarot)';

                        return (
                            <div key={index} className="space-y-1.5 bg-neutral-50 bg-opacity-60 p-3.5 border border-neutral-200 rounded-sm">
                                <div className="flex justify-between text-xs font-bold text-neutral-808">
                                    <span>{displayName}</span>
                                    <span className="text-[#0078d7] font-bold font-mono">{skill.level}%</span>
                                </div>
                                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-sky-500 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${skill.level}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};
