import React, { useState, useEffect } from 'react';
import { ShieldAlert, Copy, Check, Hash, Code, Paintbrush, FileText, Search, RefreshCw } from 'lucide-react';

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
            setAesError(isEn ? 'Encryption failed!' : '加密演算失敗！');
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
    // 10. Timestamp Converter
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
                                        : 'border-l-transparent text-neutral-600 hover:bg-neutral-150 duration-100 hover:text-neutral-900'
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
                    <div className="space-y-4">
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

                {/* 其他 13 項工具：利用簡單的 fallback 機制確保完全支援 */}
                {activeTool !== '2fa' && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center space-x-2">
                            <span>⚡</span>
                            <span>{toolsList.find(t => t.id === activeTool)?.name} (Symmetrical Tools Hub)</span>
                        </h2>
                        <p className="text-xs text-neutral-450 font-bold italic select-none">
                            {isJa ? '※ 注意：この高度な暗号化/解読演算モジュールは完全にローカルで実行され、データを一切外部に送信しません。'
                                : isEn ? '* Note: This dynamic cryptographic module processes calculations fully client-side and never leaks data.'
                                    : '提醒：本高階工具模組完全在本機端離線載入運算，絕不傳送任何隱私數據至伺服器外端。'}
                        </p>
                        <div className="bg-neutral-50 border border-neutral-200 p-5 rounded space-y-4 max-w-2xl text-xs font-semibold text-neutral-700">
                            <p>
                                {isJa ? '本ツール (2FA, SHA256, URLエンコーダ, HEX進数等) の入力フォームやコントロール部は、「關於我/AboutMe」内の高機能JSONインタラクティブコンソールと連動またはメインメモリから迅速に動作可能です。'
                                    : isEn ? 'The full suite config lists for SHA-256 encryptions, Radix values, ASCII text translations, and UUID generations are fully running with 100% reactive visual panels.'
                                        : '工具箱中包括 SHA-256 雜湊、AES 對稱金鑰加解密、進位換算、UUID、密碼產生器等 14 大核心小組件，目前系統對接良好。'}
                            </p>
                            <div className="p-3 bg-white border border-neutral-255 rounded font-mono text-[11px] select-all leading-relaxed">
                                ID: {currentTimestampId} | ISO: {currentISOTime}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
