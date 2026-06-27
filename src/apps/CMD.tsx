import React, { useState, useRef, useEffect } from 'react';

interface CMDProps {
    lang: 'zh' | 'en' | 'ja'; // 多語言參數傳入說明
}

interface CommandLine {
    type: 'input' | 'output' | 'error';
    text: string;
}

/**
 * CMD 元件：微軟復古黑底綠字命令提示字元模擬應用。
 * 支援 help、cls、systeminfo (neofetch)、about 等多種互動命令，並附有高度繁體中文註解與 3 大語言整合支援。
 */
export const CMD: React.FC<CMDProps> = ({ lang }) => {
    const isEn = lang === 'en';
    const isJa = lang === 'ja';

    // 1. 記錄終端指令歷史快取
    const [history, setHistory] = useState<CommandLine[]>([]);
    const [inputVal, setInputVal] = useState('');
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 初始化終端標頭歡迎訊息
    useEffect(() => {
        const welcome = [
            { type: 'output' as const, text: 'Microsoft Windows [版本 10.0.19042]' },
            { type: 'output' as const, text: '(c) 2026 Microsoft Corporation. 著作權所有，並保留一切權利。' },
            { type: 'output' as const, text: '' },
            {
                type: 'output' as const,
                text: isJa
                    ? 'ヘルプを表示するには "help" または "?" を入力してください。'
                    : isEn
                        ? 'Type "help" or "?" to view all available commands.'
                        : '輸入 "help" 或 "?" 可查看所有可用的互動指令。'
            },
            { type: 'output' as const, text: '' }
        ];
        setHistory(welcome);
    }, [lang, isEn, isJa]);

    // 當歷史紀錄變更，滾動至終端機最底端
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // 單擊終端聚焦輸入框
    const focusInput = () => {
        inputRef.current?.focus();
    };

    // 元件對接時預設聚焦
    useEffect(() => {
        focusInput();
    }, []);

    // 處理鍵入提交 CMD 命令發送
    const handleCommandSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cmdText = inputVal.trim();
        if (!cmdText) return;

        const newHistory = [...history, { type: 'input' as const, text: `C:\\Users\\admin> ${cmdText}` }];
        const parts = cmdText.toLowerCase().split(' ');
        const mainCmd = parts[0];

        let responses: CommandLine[] = [];

        // 命令分析與跳轉
        switch (mainCmd) {
            case 'help':
            case '?':
                if (isJa) {
                    responses = [
                        { type: 'output', text: '==== Windows 10 Web CMD コマンドリスト ====' },
                        { type: 'output', text: 'help / ?      - このヘルプヘルプ画面を表示します' },
                        { type: 'output', text: 'cls / clear   - 画面のログバッファをクリアします' },
                        { type: 'output', text: 'systeminfo    - システムとハードウェア仕様パラメータを表示 (neofetch)' },
                        { type: 'output', text: 'about         - 管理者紹介の表示' },
                        { type: 'output', text: 'tools         - 統合された 14 個の便利ユーティリティ一覧' },
                        { type: 'output', text: 'projects      - 現在ディスクに保存されているプロダクトディレクトリを表示' },
                        { type: 'output', text: 'date          - 今日の日付を表示します' },
                        { type: 'output', text: 'time          - 現在のシステム時刻を表示します' },
                        { type: 'output', text: 'joke          - ランダムなエンジニアのジョークを1つ表示' },
                        { type: 'output', text: 'exit          - Webシステムコンソールをリロードします' }
                    ];
                } else if (isEn) {
                    responses = [
                        { type: 'output', text: '==== Windows 10 Web CMD Helper Commands ====' },
                        { type: 'output', text: 'help / ?      - Show this help menu list' },
                        { type: 'output', text: 'cls / clear   - Clear the terminal screen buffer' },
                        { type: 'output', text: 'systeminfo    - View system & hardware specs (neofetch)' },
                        { type: 'output', text: 'about         - Show system administrator profile' },
                        { type: 'output', text: 'tools         - Lists the 14 integrated utility tools' },
                        { type: 'output', text: 'projects      - Review works direct folder inside harddrive' },
                        { type: 'output', text: 'date          - Express current localized date' },
                        { type: 'output', text: 'time          - Express ticking system clock now' },
                        { type: 'output', text: 'joke          - Tell a random dev joke' },
                        { type: 'output', text: 'exit          - Reboots / refreshes the system' }
                    ];
                } else {
                    responses = [
                        { type: 'output', text: '==== Windows 10 Web CMD 輔助指令 ====' },
                        { type: 'output', text: 'help / ?      - 顯示此說明清單' },
                        { type: 'output', text: 'cls / clear   - 清除螢幕緩衝區' },
                        { type: 'output', text: 'systeminfo    - 查看本系統與主機規格參數(neofetch)' },
                        { type: 'output', text: 'about         - 關於本站站長簡介' },
                        { type: 'output', text: 'tools         - 列出 14 種已集成的應用工具軟體' },
                        { type: 'output', text: 'projects      - 查看目前磁碟儲存的專案作品' },
                        { type: 'output', text: 'date          - 顯示今日日期' },
                        { type: 'output', text: 'time          - 顯示目前系統時鐘時間' },
                        { type: 'output', text: 'joke          - 列出一則工程師冷笑話' },
                        { type: 'output', text: 'exit          - 重啟或重置網頁控制台' }
                    ];
                }
                break;

            case 'cls':
            case 'clear':
                setHistory([]);
                setInputVal('');
                return;

            case 'systeminfo':
                responses = [
                    { type: 'output', text: '   .---.       OS: Windows 10 Enterprise Web' },
                    { type: 'output', text: '  /     \\      Kernel version: 10.0.19042' },
                    { type: 'output', text: '  \\     /      Framework: React 18 + TS + Tailwind' },
                    { type: 'output', text: '   `---`       Build tool: Vite dev server' },
                    { type: 'output', text: '  /|_  _\\      Virtual CPU: Intel Core i9-14900KS' },
                    { type: 'output', text: ' /  |  / \\     Virtual RAM: 64.0 GB (Web Virtual)' },
                    { type: 'output', text: '/   | /   \\    System Admin: Administrator (ESM)' },
                    { type: 'output', text: '=============== STATUS: ONLINE & ACTIVE =================' }
                ];
                break;

            case 'about':
                if (isJa) {
                    responses = [
                        { type: 'output', text: '[システム管理者プロフィール]' },
                        { type: 'output', text: ' - ロケーション: 台湾、台北市' },
                        { type: 'output', text: ' - ロール: フルスタックWebエンジニア。Fluent磨砂ガラスの美学が大好きです。' },
                        { type: 'output', text: ' - Eメール: at0958105@gmail.com' },
                        { type: 'output', text: ' "projects" を入力すると作品ディレクトリをレビューできます。' }
                    ];
                } else if (isEn) {
                    responses = [
                        { type: 'output', text: '[System Administrator Profile]' },
                        { type: 'output', text: ' - Location: Taipei, Taiwan' },
                        { type: 'output', text: ' - Role: Full Stack Dev interested in OS UI emulations & Fluent blurs.' },
                        { type: 'output', text: ' - Email: at0958105@gmail.com' },
                        { type: 'output', text: ' Type "projects" to view his portfolios.' }
                    ];
                } else {
                    responses = [
                        { type: 'output', text: '[System Administrator Profile]' },
                        { type: 'output', text: ' - 位置: 台北，台灣' },
                        { type: 'output', text: ' - 角色: 全端 Web 工程師，喜歡物聯與 Fluent 現代磨砂玻璃質感。' },
                        { type: 'output', text: ' - Email: at0958105@gmail.com' },
                        { type: 'output', text: ' 輸入 "projects" 可查看他的代表作品。' }
                    ];
                }
                break;

            case 'tools':
                if (isJa) {
                    responses = [
                        { type: 'output', text: '==== 統合された 14 個の便利ユーティリティ ====' },
                        { type: 'output', text: ' 1. 2FA生成器           2. 雪花アルゴリズム     3. JWTツール' },
                        { type: 'output', text: ' 4. AES-CBC暗号化       5. 画像Base64変換       6. Base64編解碼' },
                        { type: 'output', text: ' 7. URLエンコード       8. ハッシュ生成器       9. 大文字小文字変換' },
                        { type: 'output', text: '10. タイムスタンプ     11. パスワード生成器    12. UUID生成器' },
                        { type: 'output', text: '13. 進数変換            14. ASCII/UTF-8コード変換' },
                        { type: 'output', text: ' メイン画面上の Tools 項目を選択して呼び出します。' }
                    ];
                } else if (isEn) {
                    responses = [
                        { type: 'output', text: '==== 14 Integrated Utilities (C:\\Tools\\*) ====' },
                        { type: 'output', text: ' 1. 2FA Token Gen      2. Snowflake ID         3. JWT Inspector' },
                        { type: 'output', text: ' 4. AES-CBC Crypt      5. Image to Base64      6. Base64 Coder' },
                        { type: 'output', text: ' 7. URL Coder          8. Hash Generator       9. Case Converter' },
                        { type: 'output', text: '10. Timestamp Coder    11. Password Gen        12. UUID Generator' },
                        { type: 'output', text: '13. Radix Converter    14. ASCII/UTF8 Coder' },
                        { type: 'output', text: ' Select "Tools" tab on the main window navigation to launch.' }
                    ];
                } else {
                    responses = [
                        { type: 'output', text: '==== 已成功集成的 14 項專屬實用工具 (C:\\Tools\\*) ====' },
                        { type: 'output', text: ' 1. 2FA產生器       2. 雪花算法         3. JWT 工具' },
                        { type: 'output', text: ' 4. AES-CBC 加密    5. 圖片轉 Base64    6. Base64 編解碼' },
                        { type: 'output', text: ' 7. URL 編解碼      8. 雜湊加密工具     9. 大小寫轉換器' },
                        { type: 'output', text: '10. 時間戳工具     11. 密碼產生器      12. UUID 產生器' },
                        { type: 'output', text: '13. 進制轉換       14. ASCII/UTF-8 編譯轉換' },
                        { type: 'output', text: ' 請在主畫面點選 Tools 按鍵快速開啟調用！' }
                    ];
                }
                break;

            case 'projects':
                responses = [
                    { type: 'output', text: 'C:\\Users\\admin\\Projects 的目錄' },
                    { type: 'output', text: '2026/05/31  下午 16:00    <DIR>          Win10-Light-Console' },
                    { type: 'output', text: '2026/05/15  下午 11:20    <DIR>          PHP-Vintage-Engine' },
                    { type: 'output', text: '2026/04/10  上午 09:05    <DIR>          HTML5-Arcade-Games' },
                    { type: 'output', text: '2026/03/01  上午 10:15    <DIR>          Acrylic-Fluent-CSS-Git' },
                    { type: 'output', text: '               0 個檔案              0 位元組' },
                    { type: 'output', text: '               4 個目錄 345,120,442,880 位元組可用空間' }
                ];
                break;

            case 'date':
                responses = [{
                    type: 'output',
                    text: isJa
                        ? `システム日付: ${new Date().toLocaleDateString('ja-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                        : isEn
                            ? `System localized date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                            : `當前系統日期: ${new Date().toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                }];
                break;

            case 'time':
                responses = [{ type: 'output', text: `System time: ${new Date().toLocaleTimeString('zh-TW', { hour12: false })}` }];
                break;

            case 'joke':
                const jokes = [
                    "為什麼程式設計師戴眼鏡？因為他們看不清 C# (C Sharp)。",
                    "世界上有 10 種人：懂二進制的，和不懂二進制的。",
                    "寫程式有三種境界：複製別人的代碼、看懂別人的代碼、忘記自己寫的代碼。"
                ];
                const randomIdx = Math.floor(Math.random() * jokes.length);
                responses = [{ type: 'output', text: `[Joke] ${jokes[randomIdx]}` }];
                break;

            case 'exit':
                responses = [{ type: 'output', text: 'Rebooting...' }];
                window.location.reload();
                break;

            default:
                responses = [{
                    type: 'error',
                    text: isJa
                        ? `'${mainCmd}' は、內部コマンドまたは外部コマンド、操作可能なプログラムまたはバッチファイルとして認識されていません。`
                        : isEn
                            ? `'${mainCmd}' is not recognized as an internal or external command, operable program or batch file.`
                            : `'${mainCmd}' 不是內部或外部命令、可執行的程式或批次檔。請輸入 help 獲得有效列表。`
                }];
        }

        setHistory([...newHistory, ...responses]);
        setInputVal('');
    };

    return (
        <div
            onClick={focusInput}
            className="w-full h-full min-h-[460px] bg-[#0c0c0c] text-[#00ff00] p-4 font-mono text-xs select-text flex flex-col justify-between overflow-y-auto leading-relaxed border border-neutral-800"
        >
            <div className="flex-grow flex-1 overflow-y-auto space-y-1">
                {history.map((line, idx) => (
                    <div
                        key={idx}
                        className={
                            line.type === 'input'
                                ? 'text-white'
                                : line.type === 'error'
                                    ? 'text-red-400 font-bold'
                                    : 'text-[#00ff00]'
                        }
                    >
                        {line.text}
                    </div>
                ))}
                <div ref={terminalEndRef} />
            </div>

            <form onSubmit={handleCommandSubmit} className="flex items-center mt-3 select-none flex-shrink-0">
                <span className="text-white font-mono mr-1.5 flex-shrink-0 select-none">
                    C:\Users\admin&gt;
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#00ff00] font-mono text-xs w-full caret-[#00ff00]"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </form>
        </div>
    );
};
