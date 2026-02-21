// script.js

async function setLinkTextFromPage(a) {
  if (!a || !a.getAttribute("href")) return;

  // 已經有自訂文字就不改（保留你寫的）
  const original = (a.textContent || "").trim();
  const placeholder =
    original === "" ||
    original.includes("前一篇") ||
    original.includes("下一篇");

  try {
    const res = await fetch(a.getAttribute("href"), { cache: "no-store" });
    if (!res.ok) return;
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, "text/html");

    // 優先抓頁面 h1，沒有就用 title
    const h1 = doc.querySelector("h1")?.textContent?.trim();
    const title = doc.querySelector("title")?.textContent?.trim();
    const name = h1 || title;

    if (!name) return;

    // 只在 placeholder 狀態才覆蓋文字
    if (placeholder) a.textContent = name;
  } catch (e) {
    // 讀不到就保持原樣
  }
}

async function initPrevNext() {
  const pagers = document.querySelectorAll(".pager");
  for (const pager of pagers) {
    await setLinkTextFromPage(pager.querySelector("a.prev"));
    await setLinkTextFromPage(pager.querySelector("a.next"));
  }
}

// ✅ 新增：自動讓外部連結開新分頁
function initExternalLinks() {
  const links = document.querySelectorAll("a[href^='http']");
  links.forEach(link => {
    try {
      const url = new URL(link.href);
      if (url.hostname !== location.hostname) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } catch (e) {
      // 無效 URL 就忽略
    }
  });
}

// 統一初始化入口
document.addEventListener("DOMContentLoaded", function () {
  initPrevNext();
  initExternalLinks();
});