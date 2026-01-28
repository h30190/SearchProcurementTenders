export interface TenderItem {
    案號: string;
    標案名稱: string;
    招標機關名稱: string;
    招標機關代碼: string;
    公告類別: string;
    預算金額: string | number;
    截止投標時間: string;
}
export declare function fetchAndFilterTenders(keyword: string): Promise<any[] | "目前政府平台尚未提供 JSON 資料。" | "抓取標案資料時發生錯誤，可能政府平台連線不穩，請稍後再試。">;
//# sourceMappingURL=tender-service.d.ts.map