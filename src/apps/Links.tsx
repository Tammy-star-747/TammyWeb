import React from 'react';
import { ArrowRight, GalleryThumbnailsIcon, Globe } from 'lucide-react';

interface LinksProps {
    lang: 'zh' | 'en' | 'ja'; // 多語言參數傳入
}

interface LinkItem {
    title: string;       // 中文名稱
    titleEn: string;     // 英文名稱
    titleJa: string;     // 日文名稱
    desc: string;        // 中文敘述
    descEn: string;      // 英文敘述
    descJa: string;      // 日文敘述
    url: string;         // 網址
    iconName: string;    // 表示 Emojis
    color: string;       // 配色漸層
}

/**
 * Links 元件：常用連結導航看板
 * 集成使用者指定的 5 大實用程式設計與素材站點，支援中英日多語言自適應切換，配高對比明亮模式
 */
export const Links: React.FC<LinksProps> = ({ lang }) => {
    const isEn = lang === 'en';
    const isJa = lang === 'ja';

    // 配置指定的五個核心常用連結
    const list: LinkItem[] = [
        {
            title: "聯絡Tammy",
            titleEn: "Contact Tammy",
            titleJa: "Tammyに連絡",
            desc: "聯絡我Happy10209@gmail.com",
            descEn: "Contact me Happy10209@gmail.com",
            descJa: "連絡してください Happy10209@gmail.com",
            url: "https://reurl.cc/6Gmvq5",
            iconName: "gmail",
            color: "from-amber-100 to-amber-200 border-amber-300 text-amber-900"
        },
        {
            title: "ASCII Art Generator",
            titleEn: "ASCII Art Archive",
            titleJa: "ASCIIアート生成器",
            desc: "一個蒐集並產生精美純文字 ASCII 藝術畫作的古董寶庫站點，提供豐富的主題圖案。",
            descEn: "A massive, classic text-based ASCII art archive. Packs retro font categories, illustrations, and ASCII symbols.",
            descJa: "テキストベースの美しいASCIIアート作品を集めたクラシックなアーカイブサイト。レトロな文字などを生成します。",
            url: "https://ascii.co.uk/art/",
            iconName: "🎨",
            color: "from-amber-100 to-amber-200 border-amber-300 text-amber-900"
        },
        {
            title: "Simple Icons",
            titleEn: "Simple Icons Logo Kit",
            titleJa: "シンプルアイコンズ (Simple Icons)",
            desc: "提供上千種熱門商標與主流技術的 SVG 開源向量圖標庫，均有標誌官方色碼校正。",
            descEn: "Provides over 3000 free SVG icons for popular brands and tech, completely curated with official hex color codes.",
            descJa: "数千種類の人気ブランドのロゴやSVGアイコンベクトル素材を提供するライブラリ。公式のカラーコード付き。",
            url: "https://simpleicons.org/",
            iconName: "💎",
            color: "from-sky-100 to-sky-200 border-sky-300 text-sky-900"
        },
        {
            title: "CyberChef",
            titleEn: "CyberChef Data Cooker",
            titleJa: "サイバーシェフ (CyberChef)",
            desc: "由 GCHQ 開源的強大網路數據加密、編碼及格式分析工具，被稱為網路業的「萬能數據軍刀」。",
            descEn: "An exceptionally powerful web app to decode, encrypt, parse, and analyze cyber data. Designed by GCHQ.",
            descJa: "暗号化、エンコード、データの解析などをブラウザ上で高速実行できるGCHQ製の万能Webデータナイフツール。",
            url: "https://gchq.github.io/CyberChef/",
            iconName: "🍳",
            color: "from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-900"
        },
        {
            title: "Discord 開發者入口",
            titleEn: "Discord Developer Portal",
            titleJa: "Discord開発者ポータル",
            desc: "用以發佈並管理 Discord 機器人 (Bots)、應用程式及 OAuth2 安全金鑰的微軟集成控制看板。",
            descEn: "Officiating portal to configure Discord applications, manage webhooks, set bot permissions, and review API quotas.",
            descJa: "DiscordのBot、統合アプリ、OAuth2認証などを構築・管理できる公式デベロッパーダッシュボード。",
            url: "https://discord.com/developers/applications",
            iconName: "💬",
            color: "from-indigo-100 to-indigo-200 border-indigo-300 text-indigo-900"
        },
        {
            title: "日本免費素材集 (Irasutoya)",
            titleEn: "Irasutoya Illust Asset Collection",
            titleJa: "いらすとや (Irasutoya素材集)",
            desc: "極受大師歡迎的日本免費可愛插圖設計素材集，無數溫馨的插畫圖片可自由下載運用。",
            descEn: "An iconic Japanese archive of warm, cute hand-drawn free cliparts. Highly essential for web design decorations.",
            descJa: "とても人気のある日本の無料イラスト素材集サイト。温かみのある手描きイラスト素材を自由にダウンロード可能。",
            url: "https://www.irasutoya.com/",
            iconName: "🧸",
            color: "from-pink-100 to-pink-200 border-pink-300 text-pink-900"
        }
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 select-text text-sm pb-10 text-neutral-855 font-win">

            {/* 頂部橫幅描述 */}
            <div className="flex flex-col space-y-2 border-b border-neutral-200 pb-5 select-none animate-once">
                <h1 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                    <span>🔗</span>
                    <span>
                        {isJa ? "おすすめWebリンク一覧"
                            : isEn ? "Useful Web Navigation Links"
                                : "常用連結"}
                    </span>
                </h1>
                <p className="text-xs text-neutral-500 font-bold">
                    {isJa
                        ? "開発、デザイン、アセットに非常に役立つおすすめの5大外部ツール統合ウェブサイト。"
                        : isEn
                            ? "A handpicked selection of premium utilities, developer applications, and free assets websites verified for engineering workflows."
                            : "此頁面收錄了高效率的線上 ASCII 產生器、商標圖圖標組、高級數據分析工具、Discord API 及日本可愛素材，助您輕鬆上網。"
                    }
                </p>
            </div>

            {/* 常用連結 5 大卡片網格展示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((proj, idx) => (
                    <a
                        key={idx}
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col justify-between border border-neutral-200 bg-neutral-50 p-5 rounded hover:border-[#0078d7] hover:bg-neutral-100 hover:shadow-md transition-all duration-200 shadow-sm"
                    >
                        <div className="space-y-3">
                            {/* 卡片頂部 Emojis 圖示 */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3.5">
                                    <div className={`p-2 rounded bg-gradient-to-tr ${proj.color} shadow-sm w-10 h-10 flex items-center justify-center text-xl shrink-0 select-none`}>
                                        {proj.url === "https://reurl.cc/6Gmvq5" ? (
                                            <img
                                                src="/google_mail_gmail_logo_icon_159346.webp"
                                                alt="Gmail"
                                                className="w-7 h-7 object-contain select-none pointer-events-none"
                                            />
                                        ) : (
                                            proj.iconName
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 group-hover:text-[#0078d7] transition-colors text-xs select-none font-win">
                                            {isJa ? proj.titleJa : isEn ? proj.titleEn : proj.title}
                                        </h3>
                                        <span className="text-[9px] text-[#0078d7] font-extrabold uppercase select-none tracking-wider">
                                            {proj.url.replace('https://', '').split('/')[0]}
                                        </span>
                                    </div>
                                </div>

                                <span className="text-neutral-400 group-hover:text-[#0078d7] transition-colors select-none self-center">
                                    <ArrowRight size={16} className="transform group-hover:translate-x-1 duration-150" />
                                </span>
                            </div>

                            {/* 中文或英文或日文敘述 */}
                            <p className="text-xs text-neutral-500 font-bold leading-relaxed min-h-[46px] pt-1">
                                {isJa ? proj.descJa : isEn ? proj.descEn : proj.desc}
                            </p>
                        </div>

                        {/* 卡片底端外連 UI 表示 */}
                        <div className="flex items-center space-x-1.5 text-[10px] text-neutral-450 pt-3 border-t border-neutral-200 border-opacity-60 mt-1 font-mono font-medium select-all">
                            <Globe size={11} className="shrink-0 text-neutral-400" />
                            <span className="truncate">{proj.url}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
