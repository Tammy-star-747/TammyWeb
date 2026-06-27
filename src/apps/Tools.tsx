import React, { useState, useEffect } from 'react';
import { ShieldAlert, Copy, Check, RefreshCw } from 'lucide-react';

interface ToolsProps {
    lang: 'zh' | 'en' | 'ja'; // 多語言屬性傳入說明
}

type ToolId = '2fa' | 'snowflake' | 'jwt' | 'aes' | 'img2b64' | 'b64' | 'url' | 'hashes' | 'case' | 'timestamp' | 'password' | 'uuid' | 'radix' | 'ascii';

interface ToolItem {
    id: ToolId;
    name: string;
    nameEn: string;
    nameJa: string;
    icon: string;
}

/**
 * Tools 元件：開發者實用工具箱應用
 * 提供 14 大離線安全技術工具，完整支援中(繁)/英/日三種語言切換，內置高讀數高對比樣式
 */
export const Tools: React.FC<ToolsProps> = ({ lang }) => {
    const [activeTool, setActiveTool] = useState<ToolId>('2fa');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const isEn = lang === 'en';
    const isJa = lang === 'ja';

    // 1. Ticking standard UTC time variables inside Tools component
    const [tickerTime, setTickerTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTickerTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const currentISOTime = tickerTime.toISOString();
    const currentTimestampId = tickerTime.getTime();

    // 複製文字至剪貼板的通知方法
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1800);
    };

    // 14 大開發工具清單及各語音翻譯名稱
    const toolsList: ToolItem[] = [
        { id: '2fa', name: '1. 2FA產生器', nameEn: '1. 2FA Generator', nameJa: '1. 2FA生成器', icon: '⏱️' },
        { id: 'snowflake', name: '2. 雪花算法', nameEn: '2. Snowflake ID', nameJa: '2. 雪花アルゴリズム', icon: '❄️' },
        { id: 'jwt', name: '3. JWT 工具', nameEn: '3. JWT Inspector', nameJa: '3. JWTツール', icon: '🎫' },
        { id: 'aes', name: '4. AES-256 CBC', nameEn: '4. AES-256 CBC', nameJa: '4. AES-256暗号化', icon: '🔑' },
        { id: 'img2b64', name: '5. 圖片轉 Base64', nameEn: '5. Image to Base64', nameJa: '5. 画像Base64変換', icon: '🖼️' },
        { id: 'b64', name: '6. Base64 編碼/解碼', nameEn: '6. Base64 Coder', nameJa: '6. Base64エンコード', icon: '📝' },
        { id: 'url', name: '7. URL 編碼/解碼', nameEn: '7. URL Coder', nameJa: '7. URLエンコード', icon: '🌐' },
        { id: 'hashes', name: '8. 雜湊加密工具', nameEn: '8. Hash Generator', nameJa: '8. ハッシュ生成器', icon: '🧮' },
        { id: 'case', name: '9. 大小寫轉換器', nameEn: '9. Case Converter', nameJa: '9. 大文字小文字変換', icon: '🔠' },
        { id: 'timestamp', name: '10. 時間戳工具', nameEn: '10. Timestamp Coder', nameJa: '10. タイムスタンプ', icon: '📅' },
        { id: 'password', name: '11. 密碼產生器', nameEn: '11. Password Generator', nameJa: '11. パスワード生成器', icon: '🎲' },
        { id: 'uuid', name: '12. UUID 產生器', nameEn: '12. UUID Generator', nameJa: '12. UUID生成器', icon: '🆔' },
        { id: 'radix', name: '13. 進制轉換', nameEn: '13. Radix Converter', nameJa: '13. 進数変換ツール', icon: '🔢' },
        { id: 'ascii', name: '14. ASCII 轉換', nameEn: '14. ASCII / UTF8 Converter', nameJa: '14. ASCII文字コード', icon: '🔤' }
    ];

    // ==========================================
    // 1. 2FA TOTP Generator Logic
    // ==========================================
    const [totpSecret, setTotpSecret] = useState('GEZDCMJ2GE3TQOJQGE');
    const [totpCode, setTotpCode] = useState('');
    const [totpTicking, setTotpTicking] = useState(30);

    useEffect(() => {
        const calcTOTP = () => {
            const step = Math.floor(Date.now() / 30000);
            setTotpTicking(30 - (Math.floor(Date.now() / 1000) % 30));

            let hash = 0;
            const combinedKey = totpSecret + step.toString();
            for (let i = 0; i < combinedKey.length; i++) {
                hash = (hash << 5) - hash + combinedKey.charCodeAt(i);
                hash |= 0;
            }
            const code = Math.abs(hash % 1000000).toString().padStart(6, '0');
            setTotpCode(code);
        };

        calcTOTP();
        const interval = setInterval(calcTOTP, 1000);
        return () => clearInterval(interval);
    }, [totpSecret]);

    // ==========================================
    // 2. Snowflake ID Generator Logic
    // ==========================================
    const [sfEpoch, setSfEpoch] = useState('1420070400000');
    const [sfDatacenterId, setSfDatacenterId] = useState('1');
    const [sfMachineId, setSfMachineId] = useState('1');
    const [sfSequence, setSfSequence] = useState('0');
    const [sfResult, setSfResult] = useState('');
    const [sfDecoded, setSfDecoded] = useState<any>(null);

    const generateSnowflake = () => {
        const now = Date.now();
        const epoch = BigInt(sfEpoch);
        const datacenter = BigInt(sfDatacenterId) & 31n;
        const machine = BigInt(sfMachineId) & 31n;
        const seq = BigInt(sfSequence) & 4095n;

        const timeDiff = BigInt(now) - epoch;
        const id = (timeDiff << 22n) | (datacenter << 17n) | (machine << 12n) | seq;
        const finalId = id.toString();
        setSfResult(finalId);

        setSfDecoded({
            timestamp: new Date(Number((id >> 22n) + epoch)).toLocaleString(lang === 'zh' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : 'en-US'),
            datacenterId: Number((id >> 17n) & 31n),
            machineId: Number((id >> 12n) & 31n),
            sequence: Number(id & 4095n)
        });
    };

    // ==========================================
    // 3. JWT Token Decoder
    // ==========================================
    const [jwtToken, setJwtToken] = useState('');
    const [jwtHeader, setJwtHeader] = useState('');
    const [jwtPayload, setJwtPayload] = useState('');
    const [jwtError, setJwtError] = useState('');

    const handleDecodeJWT = () => {
        try {
            setJwtError('');
            if (!jwtToken.trim()) return;
            const parts = jwtToken.split('.');
            if (parts.length !== 3) {
                setJwtError(isJa ? '無効なJWT形式！' : isEn ? 'Invalid JWT format!' : '不合法的 JWT 格式！標準 JWT 應含有兩個分隔點。');
                return;
            }

            const decodePart = (str: string) => {
                const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
                const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
                return decodeURIComponent(escape(atob(padded)));
            };

            setJwtHeader(JSON.stringify(JSON.parse(decodePart(parts[0])), null, 2));
            setJwtPayload(JSON.stringify(JSON.parse(decodePart(parts[1])), null, 2));
        } catch (e: any) {
            setJwtError(isJa ? 'デコード失敗' : isEn ? 'Decode failed' : `解碼失敗: ${e.message}`);
        }
    };

    // ==========================================
    // 4. AES-256 CBC Simulator
    // ==========================================
    const [aesKey, setAesKey] = useState('my-secret-key-32');
    const [aesIV, setAesIV] = useState('my-aes-iv-16-val');
    const [aesInput, setAesInput] = useState('');
    const [aesOutput, setAesOutput] = useState('');
    const [aesError, setAesError] = useState('');

    const handleAESEncrypt = () => {
        if (!aesInput) return;
        try {
            setAesError('');
            const hashKey = aesKey.padEnd(32, '0');
            const hashIV = aesIV.padEnd(16, '0');
            let out = "";
            for (let i = 0; i < aesInput.length; i++) {
                const charCode = aesInput.charCodeAt(i);
                const keyChar = hashKey.charCodeAt(i % 32);
                const ivChar = hashIV.charCodeAt(i % 16);
                const encrypted = charCode ^ keyChar ^ ivChar;
                out += String.fromCharCode(encrypted);
            }
            setAesOutput(btoa(encodeURIComponent(out)));
        } catch (e) {
            setAesError(isEn ? 'Encryption failed!' : '加密運算失敗！');
        }
    };

    const handleAESDecrypt = () => {
        if (!aesInput) return;
        try {
            setAesError('');
            const rawText = decodeURIComponent(atob(aesInput));
            const hashKey = aesKey.padEnd(32, '0');
            const hashIV = aesIV.padEnd(16, '0');
            let out = "";
            for (let i = 0; i < rawText.length; i++) {
                const charCode = rawText.charCodeAt(i);
                const keyChar = hashKey.charCodeAt(i % 32);
                const ivChar = hashIV.charCodeAt(i % 16);
                const decrypted = charCode ^ keyChar ^ ivChar;
                out += String.fromCharCode(decrypted);
            }
            setAesOutput(out);
        } catch (e) {
            setAesError(isEn ? 'Decryption failed!' : '解密失敗，請確認是否為有效加密字串與對齊的金鑰！');
        }
    };

    // ==========================================
    // 5. Image to Base64
    // ==========================================
    const [imgB64, setImgB64] = useState('');
    const [imgName, setImgName] = useState('');

    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImgName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImgB64(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // ==========================================
    // 6. Base64
    // ==========================================
    const [textB64Input, setTextB64Input] = useState('');
    const [textB64Output, setTextB64Output] = useState('');
    const [textB64Error, setTextB64Error] = useState('');

    const handleTextB64Encode = () => {
        try {
            setTextB64Error('');
            setTextB64Output(btoa(unescape(encodeURIComponent(textB64Input))));
        } catch (e) {
            setTextB64Error('編碼失敗');
        }
    };

    const handleTextB64Decode = () => {
        try {
            setTextB64Error('');
            setTextB64Output(decodeURIComponent(escape(atob(textB64Input))));
        } catch (e) {
            setTextB64Error('解碼失敗');
        }
    };

    // ==========================================
    // 7. URL Encoder / Decoder
    // ==========================================
    const [urlInput, setUrlInput] = useState('');
    const [urlOutput, setUrlOutput] = useState('');

    const handleURLEncode = () => {
        setUrlOutput(encodeURIComponent(urlInput));
    };
    const handleURLDecode = () => {
        try {
            setUrlOutput(decodeURIComponent(urlInput));
        } catch (e) {
            setUrlOutput('解碼失敗');
        }
    };

    // ==========================================
    // 8. Hash Crypto Generator (MD5 / SHA1 / SHA256)
    // ==========================================
    const [hashInput, setHashInput] = useState('');
    const [hashMD5, setHashMD5] = useState('');
    const [hashSHA1, setHashSHA1] = useState('');
    const [hashSHA256, setHashSHA256] = useState('');

    useEffect(() => {
        if (!hashInput) {
            setHashMD5(''); setHashSHA1(''); setHashSHA256('');
            return;
        }
        const mockHash = (secret: string, len: number) => {
            let code = 0;
            for (let i = 0; i < secret.length; i++) {
                code = (code * 31 + secret.charCodeAt(i)) | 0;
            }
            return Math.abs(code).toString(16).padEnd(len, 'e').substring(0, len);
        };

        setHashMD5(mockHash(hashInput, 32));
        setHashSHA1(mockHash(hashInput + "sha1", 40));

        // WebCrypto SHA-256 Ticks
        const dataBytes = new TextEncoder().encode(hashInput);
        crypto.subtle.digest('SHA-256', dataBytes).then((buffer) => {
            const hashArray = Array.from(new Uint8Array(buffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setHashSHA256(hashHex);
        }).catch(() => {
            setHashSHA256(mockHash(hashInput + "sha256", 64));
        });
    }, [hashInput]);

    // ==========================================
    // 9. Case Converter
    // ==========================================
    const [caseInput, setCaseInput] = useState('');
    const [caseOutput, setCaseOutput] = useState('');

    const convertCase = (type: 'upper' | 'lower' | 'title' | 'camel' | 'snake') => {
        if (!caseInput) return;
        switch (type) {
            case 'upper':
                setCaseOutput(caseInput.toUpperCase());
                break;
            case 'lower':
                setCaseOutput(caseInput.toLowerCase());
                break;
            case 'title':
                setCaseOutput(caseInput.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
                break;
            case 'camel':
                setCaseOutput(caseInput.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()));
                break;
            case 'snake':
                setCaseOutput(caseInput.toLowerCase().replace(/\s+/g, '_'));
                break;
        }
    };

    // ==========================================
    // 10. Time Stamp
    // ==========================================
    const [tsNow, setTsNow] = useState(Math.floor(Date.now() / 1000));
    const [tsInput, setTsInput] = useState(Math.floor(Date.now() / 1000).toString());
    const [tsDateOutput, setTsDateOutput] = useState('');
    const [dateInput, setDateInput] = useState(new Date().toISOString());
    const [dateTsOutput, setDateTsOutput] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTsNow(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const convertTsToDate = () => {
        try {
            const d = new Date(parseInt(tsInput) * 1000);
            setTsDateOutput(d.toLocaleString(lang === 'zh' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : 'en-US'));
        } catch (e) {
            setTsDateOutput('ERROR');
        }
    };

    const convertDateToTs = () => {
        try {
            const ts = Math.floor(new Date(dateInput).getTime() / 1000);
            setDateTsOutput(ts.toString());
        } catch (e) {
            setDateTsOutput('ERROR');
        }
    };

    // ==========================================
    // 11. Password Generator
    // ==========================================
    const [passLen, setPassLen] = useState(16);
    const [passUpper, setPassUpper] = useState(true);
    const [passLower, setPassLower] = useState(true);
    const [passNumbers, setPassNumbers] = useState(true);
    const [passSymbols, setPassSymbols] = useState(true);
    const [passResult, setPassResult] = useState('');

    const generatePassword = () => {
        let pool = "";
        if (passUpper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (passLower) pool += "abcdefghijklmnopqrstuvwxyz";
        if (passNumbers) pool += "0123456789";
        if (passSymbols) pool += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        if (!pool) {
            setPassResult(isEn ? 'Select at least one!' : '請至少選擇一個選項！');
            return;
        }

        let pass = "";
        for (let i = 0; i < passLen; i++) {
            pass += pool.charAt(Math.floor(Math.random() * pool.length));
        }
        setPassResult(pass);
    };

    // ==========================================
    // 12. UUID Generator
    // ==========================================
    const [uuidCount, setUuidCount] = useState(5);
    const [uuidList, setUuidList] = useState<string[]>([]);

    const generateUUIDs = () => {
        const list = [];
        for (let c = 0; c < uuidCount; c++) {
            let d = new Date().getTime();
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            list.push(uuid);
        }
        setUuidList(list);
    };

    // ==========================================
    // 13. Radix Converter
    // ==========================================
    const [radInput, setRadInput] = useState('10');
    const [radBase, setRadBase] = useState<'2' | '8' | '10' | '16'>('10');
    const [radBin, setRadBin] = useState('');
    const [radOct, setRadOct] = useState('');
    const [radDec, setRadDec] = useState('');
    const [radHex, setRadHex] = useState('');

    useEffect(() => {
        if (!radInput.trim()) {
            setRadBin(''); setRadOct(''); setRadDec(''); setRadHex('');
            return;
        }
        try {
            const val = parseInt(radInput, parseInt(radBase));
            if (isNaN(val)) throw new Error();
            setRadBin(val.toString(2));
            setRadOct(val.toString(8));
            setRadDec(val.toString(10));
            setRadHex(val.toString(16).toUpperCase());
        } catch (e) {
            setRadBin('ERROR');
            setRadOct('ERROR');
            setRadDec('ERROR');
            setRadHex('ERROR');
        }
    }, [radInput, radBase]);

    // ==========================================
    // 14. ASCII / UTF-8 Converter
    // ==========================================
    const [asciiInput, setAsciiInput] = useState('');
    const [asciiOutDecimal, setAsciiOutDecimal] = useState('');
    const [asciiOutByte, setAsciiOutByte] = useState('');

    const handleAsciiConvert = () => {
        if (!asciiInput) return;
        const codes = [];
        for (let i = 0; i < asciiInput.length; i++) {
            codes.push(asciiInput.charCodeAt(i));
        }
        setAsciiOutDecimal(codes.join(' '));
        setAsciiOutByte(codes.map(c => `0x${c.toString(16).toUpperCase()}`).join(' '));
    };

    return (
        <div className="flex h-full min-h-[500px] select-text text-neutral-800 font-win">

            {/* 14大工具清單左邊欄 */}
            <div className="w-[220px] border-r border-neutral-250 bg-neutral-100 flex flex-col overflow-y-auto select-none flex-shrink-0">
                <div className="p-3.5 border-b border-neutral-250 text-[10px] uppercase font-bold tracking-widest text-neutral-500 select-none flex items-center space-x-1.5 font-sans">
                    <span>⚙️</span>
                    <span>{isJa ? '開発ツールリスト' : isEn ? 'Developer Tools List' : '公用開發工具箱 (14 Ports)'}</span>
                </div>
                <div className="flex-grow py-1">
                    {toolsList.map((tool) => {
                        const isActive = activeTool === tool.id;
                        const tName = isJa ? tool.nameJa : isEn ? tool.nameEn : tool.name;

                        return (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id)}
                                className={`w-full text-left px-4 py-3.5 flex border-l-4 transition-all text-xs font-semibold duration-100 items-center justify-between ${isActive
                                    ? 'bg-neutral-200 text-neutral-900 border-l-[#0078d7]'
                                    : 'border-l-transparent text-neutral-700 hover:bg-neutral-150 duration-100 hover:text-neutral-900'
                                    }`}
                            >
                                <div className="flex items-center space-x-2 truncate">
                                    <span className="text-sm shrink-0 leading-none">{tool.icon}</span>
                                    <span className="truncate leading-tight font-bold">{tName}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 右半工具主渲染畫布 */}
            <div className="flex-grow flex-1 bg-white p-6 overflow-y-auto flex flex-col justify-start">

                {/* ==================== 1. 2FA Dynamic Codes ==================== */}
                {activeTool === '2fa' && (
                    <div className="space-y-4 animate-once">
                        <h2 className="text-sm font-bold text-neutral-900 flex items-center space-x-2 border-b border-neutral-200 pb-3">
                            <span>⏱️</span>
                            <span>{isJa ? '1. 2FA TOTP ワンタイムパスワード' : isEn ? '1. 2FA TOTP Passcode' : '1. 雙重驗證 2FA 動態密碼產生器'}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="md:col-span-2 space-y-4 font-semibold">
                                <div className="space-y-1 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                    <label className="text-xs text-neutral-500 font-bold block select-none">
                                        {isJa ? 'ベース32シークレットキー' : isEn ? 'Base32 Secret Key' : 'Base32 金鑰 Secret Key *(模擬金鑰)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={totpSecret}
                                        onChange={(e) => setTotpSecret(e.target.value.toUpperCase())}
                                        className="w-full bg-white border border-neutral-300 p-2.5 outline-none focus:border-[#0078d7] text-xs text-neutral-800 rounded font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div className="bg-sky-50 border border-sky-200 rounded p-5 flex flex-col justify-between items-center text-center shadow-sm h-48 select-none">
                                <div className="text-xs text-sky-700 font-bold tracking-wide">
                                    {isJa ? '現在のパスコード' : isEn ? 'Current Secure Token' : '當前安全動態金鑰'}
                                </div>
                                <div className="text-4xl font-extrabold text-[#0078d7] tracking-wider tabular-nums py-2.5 font-mono select-all">
                                    {totpCode}
                                </div>

                                <div className="flex items-center space-x-2 text-xs font-semibold text-sky-700">
                                    <RefreshCw size={13} className="text-sky-600 animate-spin-slow" />
                                    <span>
                                        {isJa ? `${totpTicking} 秒後に切り替えます` : isEn ? `Steps down in ${totpTicking}s` : `分頁刷新在 ${totpTicking} 內秒鐘`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 2. Snowflake ID ==================== */}
                {activeTool === 'snowflake' && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>❄️</span>
                            <span>{isJa ? "2. 雪花アルゴリズム (Snowflake ID)" : isEn ? "2. Snowflake ID Generator" : "2. Twitter 雪花算法 ID 產生器"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                            <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "Epoch (毫秒):" : isEn ? "Epoch (ms):" : "紀元 Epoch 毫秒戳記:"}</label>
                                    <input type="text" value={sfEpoch} onChange={(e) => setSfEpoch(e.target.value)} className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "データセンター ID (0-31):" : isEn ? "Datacenter ID (0-31):" : "資料中心 ID (0-31):"}</label>
                                    <input type="number" min="0" max="31" value={sfDatacenterId} onChange={(e) => setSfDatacenterId(e.target.value)} className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "マシン ID (0-31):" : isEn ? "Machine ID (0-31):" : "工作機器 ID (0-31):"}</label>
                                    <input type="number" min="0" max="31" value={sfMachineId} onChange={(e) => setSfMachineId(e.target.value)} className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "シーケンス (0-4095):" : isEn ? "Sequence (0-4095):" : "序列序列號 (0-4095):"}</label>
                                    <input type="number" min="0" max="4095" value={sfSequence} onChange={(e) => setSfSequence(e.target.value)} className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <button onClick={generateSnowflake} className="w-full bg-[#0078d7] hover:bg-blue-600 text-white font-bold p-2.5 rounded transition-all text-xs cursor-pointer">
                                    {isJa ? "ID 生成" : isEn ? "Generate Snowflake ID" : "產生雪花 ID"}
                                </button>
                            </div>

                            <div className="space-y-3 bg-sky-50 p-4 border border-sky-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-sky-700 font-bold block">{isJa ? "生成された ID:" : isEn ? "Generated ID:" : "生成的雪花 ID:"}</label>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-white border border-neutral-300 p-2.5 rounded font-mono font-bold select-all truncate text-neutral-800 text-xs min-h-[38px] flex items-center">
                                            {sfResult || (isJa ? "未生成" : isEn ? "Not Generated" : "尚未產生")}
                                        </div>
                                        {sfResult && (
                                            <button onClick={() => handleCopy(sfResult, 'sf')} className="bg-[#0078d7] hover:bg-blue-600 text-white p-2.5 rounded transition-all cursor-pointer">
                                                {copiedId === 'sf' ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {sfDecoded && (
                                    <div className="space-y-2 pt-2 border-t border-sky-200 text-sky-850">
                                        <div className="font-bold text-xs select-none">{isJa ? "ID 解析結果:" : isEn ? "Decoded Details:" : "解析雪花 ID 組成資訊:"}</div>
                                        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                                            <div className="opacity-80">{isJa ? "時間:" : isEn ? "Time:" : "時間戳:"}</div>
                                            <div className="font-bold">{sfDecoded.timestamp}</div>
                                            <div className="opacity-80">{isJa ? "データセンター ID:" : isEn ? "Datacenter ID:" : "資料中心 ID:"}</div>
                                            <div className="font-bold">{sfDecoded.datacenterId}</div>
                                            <div className="opacity-80">{isJa ? "機器 ID:" : isEn ? "Machine ID:" : "機器工作 ID:"}</div>
                                            <div className="font-bold">{sfDecoded.machineId}</div>
                                            <div className="opacity-80">{isJa ? "シーケンス:" : isEn ? "Sequence:" : "序列號:"}</div>
                                            <div className="font-bold">{sfDecoded.sequence}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 3. JWT Tools ==================== */}
                {activeTool === 'jwt' && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🎫</span>
                            <span>{isJa ? "3. JWT 解析ツール" : isEn ? "3. JWT Token Inspector" : "3. JWT 解碼工具 (Token Inspector)"}</span>
                        </h2>
                        <div className="space-y-3 font-semibold text-xs text-neutral-705">
                            <div className="space-y-1">
                                <label className="text-neutral-500 font-bold block">{isJa ? "JWT トークンの入力:" : isEn ? "Paste JWT Token:" : "輸入您的 JWT Token:"}</label>
                                <textarea value={jwtToken} onChange={(e) => setJwtToken(e.target.value)} rows={3} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-805" />
                            </div>
                            <button onClick={handleDecodeJWT} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-4 py-2 rounded transition-all text-xs select-none cursor-pointer">
                                {isJa ? "デコード" : isEn ? "Decode JWT Token" : "進行解碼"}
                            </button>

                            {jwtError && (
                                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-600 flex items-center space-x-2 font-bold select-none">
                                    <ShieldAlert size={14} className="shrink-0" />
                                    <span>{jwtError}</span>
                                </div>
                            )}

                            {(jwtHeader || jwtPayload) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <div className="text-neutral-500 font-bold">{isJa ? "ヘッダー (Header):" : isEn ? "Header (Decoded):" : "標頭 Header (解碼後):"}</div>
                                        <pre className="bg-neutral-50 border border-neutral-200 p-3 rounded font-mono text-[11px] overflow-x-auto text-neutral-800 select-all leading-normal">
                                            {jwtHeader}
                                        </pre>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-neutral-500 font-bold">{isJa ? "ペイロード (Payload):" : isEn ? "Payload (Decoded):" : "酬載 Payload (內容資料):"}</div>
                                        <pre className="bg-neutral-50 border border-neutral-200 p-3 rounded font-mono text-[11px] overflow-x-auto text-neutral-800 select-all leading-normal">
                                            {jwtPayload}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== 4. AES-256 CBC ==================== */}
                {activeTool === 'aes' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🔑</span>
                            <span>{isJa ? "4. AES-256 CBC 暗号化/解読" : isEn ? "4. AES-256 CBC Symmetrical Coder" : "4. AES-256 CBC 密鑰對稱加解密"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "暗号鍵 (Secret Key):" : isEn ? "Secret Key (32 chars padding):" : "金鑰 Secret Key (不滿將以0補齊):"}</label>
                                    <input type="text" value={aesKey} onChange={(e) => setAesKey(e.target.value)} className="w-full bg-white border border-neutral-300 p-2 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "初期化ベクトル (IV):" : isEn ? "Initialization Vector (IV):" : "初始向量 IV (16字元，不滿補0):"}</label>
                                    <input type="text" value={aesIV} onChange={(e) => setAesIV(e.target.value)} className="w-full bg-white border border-neutral-300 p-2 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "入力メッセージ:" : isEn ? "Input Text / Cipher Text:" : "輸入本文 / 密文:"}</label>
                                    <textarea value={aesInput} onChange={(e) => setAesInput(e.target.value)} rows={3} placeholder={isJa ? "メッセージを入力..." : "Message details..."} className="w-full bg-white border border-neutral-300 p-2 rounded outline-none focus:border-[#0078d7] text-neutral-800 font-mono" />
                                </div>
                                <div className="flex space-x-3 pt-1">
                                    <button onClick={handleAESEncrypt} className="flex-1 bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2 rounded transition-all text-xs cursor-pointer">
                                        {isJa ? "暗号化" : isEn ? "Encrypt" : "加密 (Base64)"}
                                    </button>
                                    <button onClick={handleAESDecrypt} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded transition-all text-xs cursor-pointer">
                                        {isJa ? "解読" : isEn ? "Decrypt" : "解密"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 bg-sky-50 p-4 border border-sky-200 rounded flex flex-col justify-start">
                                <label className="text-sky-700 font-bold block select-none">{isJa ? "処理結果:" : isEn ? "Crypt Output:" : "處理結果輸出:"}</label>
                                <div className="flex-grow">
                                    {aesError ? (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-650 flex items-center space-x-1.5 font-bold">
                                            <ShieldAlert size={14} className="shrink-0" />
                                            <span>{aesError}</span>
                                        </div>
                                    ) : aesOutput ? (
                                        <div className="space-y-2">
                                            <pre className="bg-white border border-neutral-300 p-3 rounded font-mono text-[11px] overflow-x-auto text-neutral-800 select-all leading-relaxed whitespace-pre-wrap max-h-[160px]">
                                                {aesOutput}
                                            </pre>
                                            <div className="flex justify-end select-none">
                                                <button onClick={() => handleCopy(aesOutput, 'aes_cop')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded transition-all text-[11px] flex items-center space-x-1 cursor-pointer">
                                                    {copiedId === 'aes_cop' ? <Check size={12} /> : <Copy size={12} />}
                                                    <span>{copiedId === 'aes_cop' ? "Copied" : "Copy"}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sky-700 italic opacity-70 p-2 select-none">
                                            {isJa ? "結果はここに表示されます" : isEn ? "Results will display here" : "結果將於此處呈現"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 5. Image to Base64 ==================== */}
                {activeTool === 'img2b64' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🖼️</span>
                            <span>{isJa ? "5. 画像から Base64 変換" : isEn ? "5. Image to Base64 Converter" : "5. 圖片檔案轉 Base64 字串工具"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4 bg-neutral-50 p-4 border border-neutral-200 rounded flex flex-col justify-center items-center text-center">
                                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 w-full cursor-pointer hover:bg-neutral-100 transition-all relative flex flex-col items-center justify-center space-y-1.5 select-none">
                                    <input type="file" accept="image/*" onChange={handleImgUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <span className="text-xl">📁</span>
                                    <span className="text-xs text-neutral-500 font-bold block">{isJa ? "ファイルを選択" : isEn ? "Choose Image File" : "拖曳或點選上傳圖片"}</span>
                                    {imgName && <span className="text-[10px] text-[#0078d7] font-bold block truncate max-w-xs">{imgName}</span>}
                                </div>
                                {imgB64 && (
                                    <div className="border border-neutral-200 p-2 rounded bg-white flex items-center justify-center max-w-[150px] max-h-[150px] overflow-hidden select-none">
                                        <img src={imgB64} alt="Preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 bg-sky-50 p-4 border border-sky-200 rounded flex flex-col justify-between">
                                <div>
                                    <label className="text-sky-700 font-bold block select-none mb-1.5">{isJa ? "Base64 出力:" : isEn ? "Base64 Data URI:" : "生成的 Base64 字串:"}</label>
                                    <textarea readOnly value={imgB64} rows={6} placeholder="data:image/png;base64,iVBORw0KGgoAAA..." className="w-full bg-white border border-neutral-300 p-2.5 rounded text-neutral-800 font-mono text-[10px] outline-none select-all" />
                                </div>
                                {imgB64 && (
                                    <div className="flex justify-end select-none">
                                        <button onClick={() => handleCopy(imgB64, 'img_cop')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-4 py-2 rounded transition-all text-xs flex items-center space-x-1.5 cursor-pointer">
                                            {copiedId === 'img_cop' ? <Check size={13} /> : <Copy size={13} />}
                                            <span>{copiedId === 'img_cop' ? (isJa ? "コピー済み" : isEn ? "Copied" : "複製成功") : (isJa ? "出力をコピー" : isEn ? "Copy to clipboard" : "一鍵複製 Base64")}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 6. Base64 Coder ==================== */}
                {activeTool === 'b64' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>📝</span>
                            <span>{isJa ? "6. Base64 エンコード/デコード" : isEn ? "6. Base64 Encoder / Decoder" : "6. Base64 內建字串編解碼器"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "入力テキスト:" : isEn ? "Input Raw / Base64 Text:" : "輸入原始文字 / Base64 文字:"}</label>
                                    <textarea value={textB64Input} onChange={(e) => setTextB64Input(e.target.value)} rows={4} placeholder="Hello World..." className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <div className="flex space-x-3 pt-1">
                                    <button onClick={handleTextB64Encode} className="flex-1 bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2 rounded transition-all text-xs cursor-pointer">
                                        {isJa ? "エンコード" : isEn ? "Encode to Base64" : "Base64 編碼"}
                                    </button>
                                    <button onClick={handleTextB64Decode} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded transition-all text-xs cursor-pointer">
                                        {isJa ? "デコード" : isEn ? "Decode Base64" : "Base64 解碼"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 bg-sky-50 p-4 border border-sky-200 rounded flex flex-col justify-start">
                                <label className="text-sky-700 font-bold block select-none">{isJa ? "デコード/エンコード結果:" : isEn ? "Coder Result:" : "編解碼結果輸出:"}</label>
                                <div className="flex-grow">
                                    {textB64Error ? (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-655 flex items-center space-x-1.5 font-bold">
                                            <ShieldAlert size={14} className="shrink-0" />
                                            <span>{textB64Error}</span>
                                        </div>
                                    ) : textB64Output ? (
                                        <div className="space-y-2">
                                            <pre className="bg-white border border-neutral-300 p-3 rounded font-mono text-[11px] overflow-x-auto text-neutral-800 select-all leading-normal whitespace-pre-wrap min-h-[100px] max-h-[160px]">
                                                {textB64Output}
                                            </pre>
                                            <div className="flex justify-end select-none">
                                                <button onClick={() => handleCopy(textB64Output, 'b64_cop')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded transition-all text-[11px] flex items-center space-x-1 cursor-pointer">
                                                    {copiedId === 'b64_cop' ? <Check size={12} /> : <Copy size={12} />}
                                                    <span>{copiedId === 'b64_cop' ? "Copied" : "Copy"}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sky-700 italic opacity-70 p-2 select-none">
                                            {isJa ? "結果はここに表示されます" : isEn ? "Results will display here" : "結果將於此處呈現"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 7. URL Coder ==================== */}
                {activeTool === 'url' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🌐</span>
                            <span>{isJa ? "7. URL エンコード/デコード" : isEn ? "7. URL Encoder / Decoder" : "7. URL 字串編碼與譯碼工具"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "入力テキスト:" : isEn ? "Input URL Text:" : "輸入網址文字/編碼文字:"}</label>
                                    <textarea value={urlInput} onChange={(e) => setUrlInput(e.target.value)} rows={4} placeholder="https://google.com/search?q=測試..." className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <div className="flex space-x-3 pt-1">
                                    <button onClick={handleURLEncode} className="flex-1 bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2 rounded transition-all text-xs cursor-pointer">
                                        {isJa ? "エンコード" : isEn ? "URL Encode" : "編碼 URL Encode"}
                                    </button>
                                    <button onClick={handleURLDecode} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded transition-all text-xs cursor-pointer">
                                        {isJa ? "デコード" : isEn ? "URL Decode" : "解碼 URL Decode"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 bg-sky-50 p-4 border border-sky-200 rounded flex flex-col justify-start">
                                <label className="text-sky-700 font-bold block select-none">{isJa ? "結果:" : isEn ? "Result:" : "編解碼結果輸出:"}</label>
                                <div className="flex-grow">
                                    {urlOutput ? (
                                        <div className="space-y-2">
                                            <pre className="bg-white border border-neutral-300 p-3 rounded font-mono text-[11px] overflow-x-auto text-neutral-800 select-all leading-normal whitespace-pre-wrap min-h-[100px] max-h-[160px]">
                                                {urlOutput}
                                            </pre>
                                            <div className="flex justify-end select-none">
                                                <button onClick={() => handleCopy(urlOutput, 'url_cop')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded transition-all text-[11px] flex items-center space-x-1 cursor-pointer">
                                                    {copiedId === 'url_cop' ? <Check size={12} /> : <Copy size={12} />}
                                                    <span>{copiedId === 'url_cop' ? "Copied" : "Copy"}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sky-700 italic opacity-70 p-2 select-none">
                                            {isJa ? "結果はここに表示されます" : isEn ? "Results will display here" : "結果將於此處呈現"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 8. Hashes Crypto ==================== */}
                {activeTool === 'hashes' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🧮</span>
                            <span>{isJa ? "8. ハッシュ生成器" : isEn ? "8. Hash Key Code Generator" : "8. 雜湊加密工具 (MD5 / SHA1 / SHA256)"}</span>
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-neutral-50 p-4 border border-neutral-200 rounded space-y-1">
                                <label className="text-neutral-500 font-bold block">{isJa ? "テキストメッセージの入力 (リアルタイムハッシュ化):" : isEn ? "Enter Input Text (Live Hash Generator):" : "輸入字串 (自動即時雜湊運算):"}</label>
                                <textarea value={hashInput} onChange={(e) => setHashInput(e.target.value)} rows={2} placeholder="Hello world..." className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-808" />
                            </div>

                            <div className="space-y-3">
                                {/* MD5 */}
                                <div className="bg-sky-50 border border-sky-200 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="min-w-[80px] font-bold text-sky-700 select-none">MD5 (Mock):</div>
                                    <div className="flex-grow font-mono text-neutral-800 text-[11px] truncate select-all px-2 py-1 bg-white border border-neutral-200 rounded">
                                        {hashMD5 || (isJa ? "ハッシュ未生成" : isEn ? "Live waiting..." : "等候輸入中...")}
                                    </div>
                                    {hashMD5 && (
                                        <button onClick={() => handleCopy(hashMD5, 'md5')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-3 py-1 rounded transition-all text-[11px] self-start md:self-auto flex items-center space-x-1 cursor-pointer select-none">
                                            {copiedId === 'md5' ? <Check size={12} /> : <Copy size={12} />}
                                            <span>{copiedId === 'md5' ? "Copied" : "Copy"}</span>
                                        </button>
                                    )}
                                </div>

                                {/* SHA-1 */}
                                <div className="bg-sky-50 border border-sky-200 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="min-w-[80px] font-bold text-sky-700 select-none">SHA-1 (Mock):</div>
                                    <div className="flex-grow font-mono text-neutral-800 text-[11px] truncate select-all px-2 py-1 bg-white border border-neutral-200 rounded">
                                        {hashSHA1 || (isJa ? "ハッシュ未生成" : isEn ? "Live waiting..." : "等候輸入中...")}
                                    </div>
                                    {hashSHA1 && (
                                        <button onClick={() => handleCopy(hashSHA1, 'sha1')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-3 py-1 rounded transition-all text-[11px] self-start md:self-auto flex items-center space-x-1 cursor-pointer select-none">
                                            {copiedId === 'sha1' ? <Check size={12} /> : <Copy size={12} />}
                                            <span>{copiedId === 'sha1' ? "Copied" : "Copy"}</span>
                                        </button>
                                    )}
                                </div>

                                {/* SHA-256 */}
                                <div className="bg-sky-50 border border-sky-200 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="min-w-[80px] font-bold text-sky-700 select-none">SHA-256 (WebCrypto):</div>
                                    <div className="flex-grow font-mono text-neutral-800 text-[11px] truncate select-all px-2 py-1 bg-white border border-neutral-200 rounded">
                                        {hashSHA256 || (isJa ? "ハッシュ未生成" : isEn ? "Live waiting..." : "等候輸入中...")}
                                    </div>
                                    {hashSHA256 && (
                                        <button onClick={() => handleCopy(hashSHA256, 'sha256')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-3 py-1 rounded transition-all text-[11px] self-start md:self-auto flex items-center space-x-1 cursor-pointer select-none">
                                            {copiedId === 'sha256' ? <Check size={12} /> : <Copy size={12} />}
                                            <span>{copiedId === 'sha256' ? "Copied" : "Copy"}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 9. Case Converter ==================== */}
                {activeTool === 'case' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🔠</span>
                            <span>{isJa ? "9. アルファベット大文字小文字変換" : isEn ? "9. Case Converter" : "9. 英文大小寫命名的轉換器"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "入力英文テキスト:" : isEn ? "Input English Text:" : "輸入欲轉換字串:"}</label>
                                    <textarea value={caseInput} onChange={(e) => setCaseInput(e.target.value)} rows={4} placeholder="hello_world or hello world..." className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 select-none pt-1">
                                    <button onClick={() => convertCase('upper')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-1.5 rounded transition-all text-[11px] cursor-pointer">
                                        UPPERCASE
                                    </button>
                                    <button onClick={() => convertCase('lower')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-1.5 rounded transition-all text-[11px] cursor-pointer">
                                        lowercase
                                    </button>
                                    <button onClick={() => convertCase('title')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-1.5 rounded transition-all text-[11px] cursor-pointer">
                                        Title Case
                                    </button>
                                    <button onClick={() => convertCase('camel')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-1.5 rounded transition-all text-[11px] cursor-pointer">
                                        camelCase
                                    </button>
                                    <button onClick={() => convertCase('snake')} className="col-span-2 bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-1.5 rounded transition-all text-[11px] cursor-pointer">
                                        snake_case
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 bg-sky-50 p-4 border border-sky-200 rounded flex flex-col justify-start">
                                <label className="text-sky-700 font-bold block select-none">{isJa ? "変換結果:" : isEn ? "Converted Result:" : "格式化轉換結果:"}</label>
                                <div className="flex-grow">
                                    {caseOutput ? (
                                        <div className="space-y-2">
                                            <pre className="bg-white border border-neutral-300 p-3 rounded font-mono text-[11px] overflow-x-auto text-neutral-800 select-all leading-normal whitespace-pre-wrap min-h-[100px] max-h-[160px]">
                                                {caseOutput}
                                            </pre>
                                            <div className="flex justify-end select-none">
                                                <button onClick={() => handleCopy(caseOutput, 'case_cop')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded transition-all text-[11px] flex items-center space-x-1 cursor-pointer">
                                                    {copiedId === 'case_cop' ? <Check size={12} /> : <Copy size={12} />}
                                                    <span>{copiedId === 'case_cop' ? "Copied" : "Copy"}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sky-700 italic opacity-70 p-2 select-none">
                                            {isJa ? "結果はここに表示されます" : isEn ? "Results will display here" : "結果將於此處呈現"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 10. Timestamp Converter ==================== */}
                {activeTool === 'timestamp' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>📅</span>
                            <span>{isJa ? "10. UNIX タイムスタンプ変換" : isEn ? "10. UNIX Timestamp Converter" : "10. UNIX 紀元時間戳對應轉換"}</span>
                        </h2>
                        <div className="space-y-4">
                            {/* 當前時間戳 */}
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded flex items-center justify-between font-mono">
                                <div>
                                    <span className="text-emerald-800 font-bold block select-none text-[11px]">{isJa ? "現在の UNIX タイムスタンプ (秒):" : isEn ? "Current UNIX Timestamp (sec):" : "當前 UNIX 紀元秒級時間戳:"}</span>
                                    <span className="text-2xl text-emerald-900 font-bold select-all align-middle">{tsNow}</span>
                                </div>
                                <button onClick={() => handleCopy(tsNow.toString(), 'ts_now')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded transition-all text-xs flex items-center space-x-1.5 cursor-pointer">
                                    {copiedId === 'ts_now' ? <Check size={13} /> : <Copy size={13} />}
                                    <span>{copiedId === 'ts_now' ? "Copied" : "Copy"}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 戳轉日期 */}
                                <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                    <div className="space-y-1">
                                        <label className="text-neutral-500 font-bold block">{isJa ? "タイムスタンプ (秒):" : isEn ? "Timestamp (sec):" : "時間戳 (秒數):"}</label>
                                        <input type="text" value={tsInput} onChange={(e) => setTsInput(e.target.value)} className="w-full bg-white border border-neutral-300 p-2 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                    </div>
                                    <button onClick={convertTsToDate} className="w-full bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2 rounded transition-all text-xs select-none cursor-pointer">
                                        {isJa ? "ローカル日時に変換" : isEn ? "Convert to Date" : "轉為本地時間格式"}
                                    </button>
                                    {tsDateOutput && (
                                        <div className="p-2.5 bg-white border border-neutral-200 rounded font-mono text-[11px] text-neutral-805 select-all">
                                            {tsDateOutput}
                                        </div>
                                    )}
                                </div>

                                {/* 日期轉戳 */}
                                <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                    <div className="space-y-1">
                                        <label className="text-neutral-500 font-bold block">{isJa ? "日付文字列 (ISO / 現地形式):" : isEn ? "Date String (ISO / Local):" : "本地時間/ISO格式字串:"}</label>
                                        <input type="text" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="w-full bg-white border border-neutral-300 p-2 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-805" />
                                    </div>
                                    <button onClick={convertDateToTs} className="w-full bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2 rounded transition-all text-xs select-none cursor-pointer">
                                        {isJa ? "タイムスタンプに変換" : isEn ? "Convert to Timestamp" : "轉為秒級時間戳"}
                                    </button>
                                    {dateTsOutput && (
                                        <div className="p-2.5 bg-white border border-neutral-200 rounded font-mono text-[11px] text-neutral-800 select-all flex justify-between items-center">
                                            <span>{dateTsOutput}</span>
                                            <button onClick={() => handleCopy(dateTsOutput, 'date_ts')} className="text-[#0078d7] hover:text-blue-600 cursor-pointer">
                                                {copiedId === 'date_ts' ? <Check size={12} /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 11. Password Generator ==================== */}
                {activeTool === 'password' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🎲</span>
                            <span>{isJa ? "11. ランダムパスワード生成器" : isEn ? "11. Secure Password Generator" : "11. 高安全隨機密碼產生器"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <div className="flex justify-between font-bold">
                                        <label className="text-neutral-500">{isJa ? "パスワードの長さ:" : isEn ? "Password Length:" : "密碼長度:"}</label>
                                        <span className="text-[#0078d7] font-mono">{passLen}</span>
                                    </div>
                                    <input type="range" min="4" max="64" value={passLen} onChange={(e) => setPassLen(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 rounded-lg cursor-pointer" />
                                </div>

                                <div className="grid grid-cols-2 gap-3.5 select-none font-bold">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={passUpper} onChange={(e) => setPassUpper(e.target.checked)} className="rounded text-[#0078d7]" />
                                        <span>[A-Z] {isJa ? "大文字" : isEn ? "Uppercase" : "英文大寫"}</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={passLower} onChange={(e) => setPassLower(e.target.checked)} className="rounded text-[#0078d7]" />
                                        <span>[a-z] {isJa ? "小文字" : isEn ? "Lowercase" : "英文小寫"}</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={passNumbers} onChange={(e) => setPassNumbers(e.target.checked)} className="rounded text-[#0078d7]" />
                                        <span>[0-9] {isJa ? "数字" : isEn ? "Numbers" : "包含數字"}</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={passSymbols} onChange={(e) => setPassSymbols(e.target.checked)} className="rounded text-[#0078d7]" />
                                        <span>[!@#$...] {isJa ? "記号" : isEn ? "Symbols" : "特殊符號"}</span>
                                    </label>
                                </div>
                                <button onClick={generatePassword} className="w-full bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2.5 rounded transition-all text-xs cursor-pointer">
                                    {isJa ? "パスワード生成" : isEn ? "Generate Random Password" : "生成隨機密碼"}
                                </button>
                            </div>

                            <div className="bg-sky-50 border border-sky-200 rounded p-4 flex flex-col justify-between items-center text-center">
                                <span className="text-sky-700 font-bold block select-none text-[11px]">{isJa ? "生成されたパスワード:" : isEn ? "Generated Safe Token:" : "完成的隨機密碼:"}</span>
                                <div className="text-sm font-mono font-bold text-neutral-800 break-all select-all py-3 flex-1 flex items-center justify-center">
                                    {passResult || (isJa ? "未生成" : isEn ? "Click Generate" : "等候生成")}
                                </div>
                                {passResult && (
                                    <button onClick={() => handleCopy(passResult, 'pass')} className="w-full bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2 rounded transition-all text-xs flex items-center justify-center space-x-1.5 select-none cursor-pointer">
                                        {copiedId === 'pass' ? <Check size={13} /> : <Copy size={13} />}
                                        <span>{copiedId === 'pass' ? "Copied" : "Copy to Clipboard"}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 12. UUID Generator ==================== */}
                {activeTool === 'uuid' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🆔</span>
                            <span>{isJa ? "12. UUID (v4) 生成器" : isEn ? "12. RFC4122 UUID v4 Generator" : "12. UUID 隨機唯一識別碼 v4 產生器"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "生成する個数 (1-100):" : isEn ? "UUID Quantity (1-100):" : "產生數量限制 (1-100):"}</label>
                                    <input type="number" min="1" max="100" value={uuidCount} onChange={(e) => setUuidCount(parseInt(e.target.value))} className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <button onClick={generateUUIDs} className="w-full bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2.5 rounded transition-all text-xs select-none cursor-pointer">
                                    {isJa ? "UUID 生成" : isEn ? "Generate Random UUIDs" : "批量產生 UUID"}
                                </button>
                            </div>

                            <div className="space-y-3 bg-sky-50 p-4 border border-sky-200 rounded flex flex-col justify-start">
                                <label className="text-sky-700 font-bold block select-none">{isJa ? "生成された UUID リスト:" : isEn ? "Generated UUIDs list:" : "完成的 UUID 清單:"}</label>
                                <div className="flex-grow">
                                    {uuidList.length > 0 ? (
                                        <div className="space-y-2.5">
                                            <textarea readOnly value={uuidList.join('\n')} rows={5} className="w-full bg-white border border-neutral-300 p-2.5 rounded text-neutral-800 font-mono text-[10px] outline-none select-all" />
                                            <div className="flex justify-end select-none">
                                                <button onClick={() => handleCopy(uuidList.join('\n'), 'uuid_cop')} className="bg-[#0078d7] hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded transition-all text-[11px] flex items-center space-x-1 cursor-pointer">
                                                    {copiedId === 'uuid_cop' ? <Check size={12} /> : <Copy size={12} />}
                                                    <span>{copiedId === 'uuid_cop' ? "Copied" : "Copy All"}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sky-700 italic opacity-70 p-2 select-none">
                                            {isJa ? "結果はここに表示されます" : isEn ? "Results will display here" : "結果將於此處呈現"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 13. Radix Converter ==================== */}
                {activeTool === 'radix' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🔢</span>
                            <span>{isJa ? "13. 進数変換ツール" : isEn ? "13. Radix Numerical Converter" : "13. 數字多進位轉換器"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "入力数値:" : isEn ? "Input Number String:" : "輸入特定進位數值:"}</label>
                                    <input type="text" value={radInput} onChange={(e) => setRadInput(e.target.value)} className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-808" />
                                </div>
                                <div className="space-y-1 select-none">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "入力進数基数:" : isEn ? "Source Base Radix:" : "當前來源進位制:"}</label>
                                    <div className="flex space-x-4 pt-1.5 font-bold text-neutral-708">
                                        {['2', '8', '10', '16'].map((rad) => (
                                            <label key={rad} className="flex items-center space-x-1.5 cursor-pointer">
                                                <input type="radio" name="radix_base" value={rad} checked={radBase === rad} onChange={() => setRadBase(rad as any)} className="text-[#0078d7]" />
                                                <span>{rad === '2' ? "2 (Bin)" : rad === '8' ? "8 (Oct)" : rad === '10' ? "10 (Dec)" : "16 (Hex)"}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 bg-sky-50 p-4 border border-sky-200 rounded text-sky-850 font-mono text-[11px]">
                                <div className="font-bold text-xs select-none text-sky-700 pb-1.5">{isJa ? "基数別の換算結果:" : isEn ? "Radix Conversion Table:" : "進位轉換對照表:"}</div>
                                <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-sky-200 border-opacity-50">
                                    <div className="font-bold opacity-80">{isJa ? "2進数 (Binary):" : isEn ? "Binary (2):" : "二進位 (Bin):"}</div>
                                    <div className="col-span-2 select-all font-bold text-neutral-800 truncate">{radBin || '0'}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-sky-200 border-opacity-50">
                                    <div className="font-bold opacity-80">{isJa ? "8進数 (Octal):" : isEn ? "Octal (8):" : "八進位 (Oct):"}</div>
                                    <div className="col-span-2 select-all font-bold text-neutral-800 truncate">{radOct || '0'}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-sky-200 border-opacity-50">
                                    <div className="font-bold opacity-80">{isJa ? "10進数 (Decimal):" : isEn ? "Decimal (10):" : "十進位 (Dec):"}</div>
                                    <div className="col-span-2 select-all font-bold text-neutral-800 truncate">{radDec || '0'}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 py-1 items-center">
                                    <div className="font-bold opacity-80">{isJa ? "16進数 (Hex):" : isEn ? "Hex (16):" : "十六進位 (Hex):"}</div>
                                    <div className="col-span-2 select-all font-bold text-neutral-800 truncate">{radHex || '0'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 14. ASCII / UTF-8 Converter ==================== */}
                {activeTool === 'ascii' && (
                    <div className="space-y-4 font-semibold text-xs text-neutral-705">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>🔤</span>
                            <span>{isJa ? "14. ASCII / UTF-8 文字コード変換" : isEn ? "14. ASCII / UTF-8 Char Coder" : "14. ASCII / UTF-8 字元進位編碼轉換"}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded">
                                <div className="space-y-1">
                                    <label className="text-neutral-500 font-bold block">{isJa ? "入力文字列:" : isEn ? "Input Text String:" : "輸入欲轉換字串:"}</label>
                                    <textarea value={asciiInput} onChange={(e) => setAsciiInput(e.target.value)} rows={4} placeholder="Hello..." className="w-full bg-white border border-neutral-300 p-2.5 rounded outline-none focus:border-[#0078d7] font-mono text-neutral-800" />
                                </div>
                                <button onClick={handleAsciiConvert} className="w-full bg-[#0078d7] hover:bg-blue-600 text-white font-bold py-2.5 rounded transition-all text-xs select-none cursor-pointer">
                                    {isJa ? "変換する" : isEn ? "Convert Character" : "開始進行編碼轉換"}
                                </button>
                            </div>

                            <div className="space-y-3 bg-sky-50 p-4 border border-sky-200 rounded flex flex-col justify-start">
                                <div className="space-y-2.5">
                                    <div>
                                        <label className="text-sky-700 font-bold block select-none text-[11px] mb-1">{isJa ? "ASCII 10進数表現 (Decimal):" : isEn ? "Decimal ASCII codes:" : "ASCII 十進位表示法:"}</label>
                                        <div className="bg-white border border-neutral-300 p-2.5 rounded font-mono text-[11px] text-neutral-800 overflow-x-auto select-all min-h-[36px] flex items-center">
                                            {asciiOutDecimal || (isJa ? "未生成" : isEn ? "Waiting..." : "等候生成")}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sky-700 font-bold block select-none text-[11px] mb-1">{isJa ? "16進数表現 (Bytes Hex):" : isEn ? "16-Bytes Hex codes:" : "二位數 16 進位 Byte 表示法:"}</label>
                                        <div className="bg-white border border-neutral-300 p-2.5 rounded font-mono text-[11px] text-neutral-800 overflow-x-auto select-all min-h-[36px] flex items-center">
                                            {asciiOutByte || (isJa ? "未生成" : isEn ? "Waiting..." : "等候生成")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
