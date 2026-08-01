# 品質檢核報告

檢核日期：2026-08-01　版本：v1.1.1

## 自動建置

- `npm install`：通過；0 個已知套件漏洞。
- `node --check`：`app.js`、`navigation.js`、`interactions.js`、`quiz.js` 通過。
- JSON：`content.json`、`quiz.json`、`resources.json` 可解析。
- `npm run build`：Vite 7.3.6 建置成功，19 個模組完成轉換；六張生活應用 WebP 均進入正式輸出。
- GitHub Pages 公開網址驗證時發現原本的執行期 JSON 路徑未進入 `dist`；已改為建置期匯入 JSON，重新建置與部署後確認互動資料載入。

## 桌機瀏覽器

- Chrome／agent-browser，1260px 寬：頁面載入、內容非空白、無 Vite 錯誤覆蓋層。
- 主控台只有 Vite 連線除錯訊息，無 JavaScript error／warning。
- 八頁籤、上一站／下一站與進度條正常。
- 原理控制 3 個、濾材卡與表格各 10 筆、配置預設 5 層。
- 證據紀錄表 3 組 × 3 次，共 9 筆。
- 生活應用 6 卡與 6 張 Image 2.0 圖片一致；0 個舊 SVG、6 張圖片皆完成載入且自然寬度為 1536px。
- 自主學習 14 筆，教師文件 4 筆。
- 闖關 10 題完成測試；10/10 結果與 localStorage 最佳成績 10 正常。

## 手機與視覺

- 390 × 844：文件寬度與 viewport 都是 390px，無水平溢出。
- 頁籤可橫向捲動並保持目前章節可見。
- 生活應用卡改為單欄；3:2 圖片完整落在卡片內，未變形、未被底部導覽遮住。
- 切換頁籤會回到章節頂端；已修正 sticky 頁籤造成的舊捲動位置殘留。
- 截圖：`desktop-home.png`、`desktop-builder-fixed.png`、`desktop-applications-image2.png`、`mobile-applications-image2.png`。

## 無障礙基本檢核

- `html` 語言為 `zh-Hant-TW`。
- 0 個重複 ID、0 張生活應用圖片缺少 `alt`、0 個無名稱按鈕。
- 所有新視窗外部連結均有 `rel="noopener"`。
- 頁籤使用 `tablist`／`tab`／`tabpanel`、方向鍵、Home、End 鍵操作。
- 動畫提供播放、暫停、重播，並支援 `prefers-reduced-motion`。
- 色彩之外另有文字、數值、符號與標籤表意。

## 社群分享預覽

- `social-preview.png` 為 1200×630 RGB PNG，使用專案自有 Image 2.0 主視覺重新構圖。
- 本機圖片請求回傳 HTTP 200、`image/png`，檔案大小 589,296 bytes。
- Open Graph 包含 type、URL、title、description、image、尺寸與替代文字；Twitter Card 使用 `summary_large_image`。
- 1440×1000 瀏覽器檢查：頁面有內容、無錯誤覆蓋層、無 JavaScript 錯誤，頁尾顯示 v1.1.1。

## 內容與安全

- 清楚區分沉澱、篩濾、吸附與消毒。
- 不以濁度、顏色或氣味推論可飲用。
- 每個頁籤均保留「不可飲用」脈絡；安全契約與對話框可重複查看。
- 模擬污水排除真實污水、池塘水、病原體、油、清潔劑、重金屬及未知化學物。
- 活性碳說明包含預洗、選擇性、容量飽和與不能保證去除病原體等限制。
- 課綱代碼未杜撰，標示由教師依正式手冊確認。

## 已知限制

- 配置分數是形成假設用的教學模型，不是實測 NTU 或飲用水安全判定；網站已在模擬器旁明示。
- Markdown 教師文件在瀏覽器可能以純文字呈現；下載或於 GitHub 閱讀可獲得完整排版。
- 外部網站可能日後改版，建議教師授課前再次確認連結。
