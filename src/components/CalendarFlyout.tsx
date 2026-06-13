import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarFlyoutProps {
    isOpen: boolean;    // 控制日曆面板是否展開
    onClose: () => void; // 關閉面板的回呼
}

/**
  * CalendarFlyout 元件：模擬 Windows 10 右下角時間日曆彈窗
  * 支援實時時鐘顯示與多月份日曆切換
  */
export const CalendarFlyout: React.FC<CalendarFlyoutProps> = ({ isOpen, onClose }) => {
    // 當前系統時間狀態（實時更新）
    const [currentTime, setCurrentTime] = useState(new Date());
    // 月曆切換參考時間（使用者瀏覽用）
    const [calendarDate, setCalendarDate] = useState(new Date());

    // 時間更新計時器：每秒觸飾一次，刷新大時鐘與秒數表示
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!isOpen) return null;

    // 格式化輸出大時鐘（例如 14:05:08）與完整日期
    const timeString = currentTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dateFullString = currentTime.toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // 取得月曆繪製所需數值：當前瀏覽年、月
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    // 計算月曆網格：當月第一天為星期幾 (0代表星期日)、當月總天數、上月總天數
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // 補齊月曆網格空隙，置入上個月最後幾天的剩餘數值
    const prevMonthDays = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        prevMonthDays.push(daysInPrevMonth - i);
    }

    // 置入當月 1 號到最後一天的天數陣列
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDays.push(i);
    }

    // 補齊網格空隙，置入下個月開始的幾天天數以滿足六行網格 (共 42 宮格)
    const nextMonthDays = [];
    const totalSlots = 42;
    const remainingSlots = totalSlots - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingSlots; i++) {
        nextMonthDays.push(i);
    }

    // 切換至上一個月份
    const handlePrevMonth = () => {
        setCalendarDate(new Date(year, month - 1, 1));
    };

    // 切換至下一個月份
    const handleNextMonth = () => {
        setCalendarDate(new Date(year, month + 1, 1));
    };

    // 判斷該天是否即為當下現實之「今天」日期
    const isToday = (day: number, isCurrentMonth: boolean) => {
        const today = new Date();
        return (
            isCurrentMonth &&
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const monthNames = [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-12 right-0 w-[360px] max-w-[95vw] shadow-winStart border border-neutral-300 bg-white bg-opacity-95 text-neutral-800 flex flex-col z-[9999] p-4 font-win animate-window-open text-sm shadow-xl"
        >
            {/* 頂端時鐘大字標題 */}
            <div className="border-b border-neutral-200 pb-4 mb-4">
                <h1 className="text-4xl font-light tracking-wide text-neutral-900 tabular-nums">
                    {timeString}
                </h1>
                <p className="text-xs text-blue-600 mt-1 hover:underline cursor-pointer font-semibold">
                    {dateFullString}
                </p>
            </div>

            {/* 月份與年份導航切換器 */}
            <div className="flex items-center justify-between px-1 mb-4 select-none">
                <span className="font-semibold text-[15px] text-neutral-950">
                    {year}年 {monthNames[month]}
                </span>
                <div className="flex space-x-3">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-600 duration-100"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-600 duration-100"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* 星期幾的標頭排列 */}
            <div className="grid grid-cols-7 gap-1 text-center font-semibold mb-2 text-neutral-500 text-xs">
                {weekdays.map((d) => (
                    <div key={d} className="h-8 flex items-center justify-center">
                        {d}
                    </div>
                ))}
            </div>

            {/* 宮格月曆本體數字表 */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* 指向上月的剩餘天數 (呈灰階淺字) */}
                {prevMonthDays.map((d, index) => (
                    <div
                        key={`prev-${index}`}
                        className="h-8 flex items-center justify-center text-neutral-300 font-normal hover:bg-neutral-100 hover:border hover:border-neutral-300 transition-all border border-transparent rounded-sm cursor-default"
                    >
                        {d}
                    </div>
                ))}

                {/* 當月份的天數 (支援判斷今日發光色) */}
                {currentMonthDays.map((d) => {
                    const active = isToday(d, true);
                    return (
                        <div
                            key={`curr-${d}`}
                            className={`h-8 flex items-center justify-center transition-all border rounded-sm font-semibold cursor-default ${active
                                    ? 'bg-[#0078d7] border-blue-400 text-white font-bold'
                                    : 'hover:bg-neutral-100 text-neutral-800 border-transparent hover:border-neutral-300'
                                }`}
                        >
                            {d}
                        </div>
                    );
                })}

                {/* 下月補位的開始天數 (呈灰階淺字) */}
                {nextMonthDays.map((d, index) => (
                    <div
                        key={`next-${index}`}
                        className="h-8 flex items-center justify-center text-neutral-300 font-normal hover:bg-neutral-100 hover:border hover:border-neutral-300 transition-all border border-transparent rounded-sm cursor-default"
                    >
                        {d}
                    </div>
                ))}
            </div>

            <div className="border-t border-neutral-200 mt-4 pt-3 flex items-center justify-between text-xs text-neutral-500 font-semibold select-none">
                <span>今日行程</span>
            </div>
            <div className="text-xs text-neutral-400 italic mt-2 text-center p-1 select-none">
                微軟小幫手提示：今天沒有安排日程項目。
            </div>
        </div>
    );
};
