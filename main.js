(() => {
  document.body.classList.add("js-enabled");

  // 追加時はこの配列にオブジェクトを1件追記するだけで表示されます。
  const releasedApps = [
    {
      name: "fe-study-app",
      catchCopy: "要点整理と反復学習をひとつにまとめたFE学習アプリ",
      description: "頻出テーマの確認、スキマ時間の見直し、学習進捗の把握をひとまとめにしやすいFE向け学習アプリ。短時間でも復習しやすい流れで、毎日の積み上げを続けやすくしています。",
      url: "",
      linkLabel: "公開リンク準備中",
      releaseDate: "2026-03-02",
      tags: ["FE学習", "問題演習", "進捗管理"],
      status: "公開中",
      isVisible: true,
      imageSrc: "images/fe_img_use.PNG",
      imageAlt: "fe-study-appの学習画面イメージ"
    },
    {
      name: "KeepProof",
      catchCopy: "レシートや保証書を画像からまとめて探せる管理アプリ",
      description: "レシート、保証書、取扱説明書の画像をまとめて取り込み、OCRで必要な情報をすぐ見つけやすくした保管アプリ。あとから店名や金額で探したい時にも、一覧で整理して確認できます。",
      url: "",
      linkLabel: "公開リンク準備中",
      releaseDate: "2026-03-01",
      tags: ["レシート", "保証書", "OCR管理"],
      status: "公開中",
      isVisible: true,
      imageSrc: "images/IMG_5769.PNG",
      imageAlt: "KeepProofのホーム画面イメージ"
    },
    {
      name: "2d-ai-chat",
      catchCopy: "2Dキャラと自然に話せる、やわらか会話アプリ",
      description: "表情や空気感まで伝わるビジュアルで、キャラクターとの雑談を心地よく続けられるAIチャット体験。気分に合わせて、ゆるく話したい時にも使いやすく整えています。",
      url: "",
      linkLabel: "公開リンク準備中",
      releaseDate: "2026-02-28",
      tags: ["AIチャット", "2D", "会話体験"],
      status: "公開中",
      isVisible: true,
      imageSrc: "images/IMG_5760.PNG",
      imageAlt: "2d-ai-chatの会話画面イメージ"
    },
    {
      name: "battle-app",
      catchCopy: "モンスター育成の進み具合をひと目で管理",
      description: "周回状況、到達ランク、日課の進捗をまとめて見渡せるバトル管理アプリ。毎日のプレイで確認したい情報だけを、すぐ読めるレイアウトにまとめています。",
      url: "",
      linkLabel: "公開リンク準備中",
      releaseDate: "2026-02-22",
      tags: ["育成", "バトル", "進捗管理"],
      status: "公開中",
      isVisible: true,
      imageSrc: "images/IMG_5761.PNG",
      imageAlt: "battle-appのホーム画面イメージ"
    },
    {
      name: "おたすけ買い物リスト",
      catchCopy: "無駄買いを防ぐメモアプリ",
      description: "買うものを共有して重複購入を防止。特売情報メモで買い忘れや無駄買いを減らせます。",
      url: "",
      linkLabel: "公開準備中",
      releaseDate: "2025-09-08",
      tags: ["買い物", "節約", "メモ"],
      status: "準備中",
      isVisible: false
    }
  ];

  const appList = document.getElementById("app-list");
  const appListAll = document.getElementById("app-list-all");
  const appListMore = document.getElementById("app-list-more");
  const years = Array.from(document.querySelectorAll("[data-year]"));
  const heroBear = document.getElementById("heroBear");
  const visibleApps = getVisibleApps(releasedApps);

  years.forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  if (heroBear) {
    heroBear.addEventListener("error", () => {
      const fallback = heroBear.dataset.fallback;
      if (fallback && heroBear.src.indexOf(fallback) === -1) {
        heroBear.src = fallback;
      }
    });
  }

  if (appList) {
    renderAppCards(appList, visibleApps.slice(0, 3));
  }

  if (appListMore) {
    renderAppListMore(appListMore, visibleApps.length);
  }

  if (appListAll) {
    renderAppCards(appListAll, visibleApps);
  }

  setupReveal();

  function renderAppCards(target, apps) {
    if (!apps.length) {
      target.innerHTML = '<p class="app-empty">公開中のアプリは準備中です。</p>';
      return;
    }

    target.innerHTML = apps.map((app) => createAppCard(app)).join("");
  }

  function renderAppListMore(target, appCount) {
    if (appCount <= 3) {
      target.hidden = true;
      target.innerHTML = "";
      return;
    }

    const olderCount = appCount - 3;
    target.hidden = false;
    target.innerHTML = `
      <div class="promo-card promo-card--soft">
        <div class="promo-card__body">
          <h3>続きのアプリも掲載中</h3>
          <p>トップに入りきらない ${escapeHtml(String(olderCount))} 件は、アプリ一覧ページでまとめて見られます。</p>
        </div>
        <div class="promo-card__actions">
          <a class="btn btn--primary" href="apps.html">アプリ一覧を見る</a>
        </div>
      </div>
    `;
  }

  function getVisibleApps(apps) {
    return apps
      .filter((app) => app.isVisible !== false)
      .sort((a, b) => toTimestamp(b.releaseDate) - toTimestamp(a.releaseDate));
  }

  function createAppCard(app) {
    const dateLabel = formatDate(app.releaseDate);
    const tags = Array.isArray(app.tags) ? app.tags : [];
    const url = typeof app.url === "string" ? app.url.trim() : "";
    const hasUrl = url.length > 0;
    const linkLabel = app.linkLabel || "アプリを見る";
    const imageSrc = typeof app.imageSrc === "string" ? app.imageSrc.trim() : "";
    const hasImage = imageSrc.length > 0;
    const imageAlt = app.imageAlt || `${app.name || "アプリ"}のイメージ`;

    return `
      <article class="app-card">
        ${hasImage
          ? `<div class="app-card__visual"><div class="app-card__phone"><div class="app-card__screen"><img class="app-card__image" src="${escapeAttribute(imageSrc)}" alt="${escapeAttribute(imageAlt)}" loading="lazy" /></div></div></div>`
          : ""}
        <div class="app-card__meta">
          <span class="app-card__date">${escapeHtml(dateLabel)}</span>
          <span class="app-card__status">${escapeHtml(app.status || "公開中")}</span>
        </div>
        <h3 class="app-card__title">${escapeHtml(app.name || "未設定アプリ")}</h3>
        <p class="app-card__catch">${escapeHtml(app.catchCopy || "")}</p>
        <p class="app-card__desc">${escapeHtml(app.description || "")}</p>
        <ul class="app-card__tags">${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>
        <div class="app-card__cta">
          ${hasUrl
            ? `<a class="btn btn--primary" href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">${escapeHtml(linkLabel)}</a>`
            : `<span class="btn btn--ghost" aria-disabled="true">${escapeHtml(linkLabel)}</span>`}
        </div>
      </article>
    `;
  }

  function setupReveal() {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 60, 220)}ms`;
      observer.observe(element);
    });
  }

  function toTimestamp(value) {
    const parsed = new Date(value);
    const time = parsed.getTime();
    return Number.isFinite(time) ? time : 0;
  }

  function formatDate(value) {
    const parsed = new Date(value);
    if (!Number.isFinite(parsed.getTime())) {
      return "公開日未設定";
    }

    const yearValue = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${yearValue}.${month}.${day}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replaceAll("`", "&#96;");
  }
})();
