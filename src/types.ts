export interface WindowState {
    id: string;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    icon?: string; // Optional icon class/name
    minWidth?: number;
    minHeight?: number;
}

export interface DesktopIconDef {
    id: string;
    title: string;
    iconName: string;
    x?: number;
    y?: number;
}

export interface GuestbookEntry {
    id: string;
    name: string;
    content: string;
    date: string;
}
