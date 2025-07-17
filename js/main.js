"use strict";

/*---------- 幕開け ----------*/
function start() {
  document.querySelector(".start").classList.add("is-disable");
  // document.getElementById("don-sound").play();

  // setTimeout(() => {
  document.getElementById("intro-overlay").style.display = "none";
  document.getElementById("checkin").classList.add("is-active");
  // }, 2000); // 2秒後に切り替え
}

window.addEventListener("DOMContentLoaded", () => {
  // 明るくして本文表示
  document.getElementById("fadein-overlay").classList.add("is-active");
  document.querySelector(".letter").classList.toggle("is-active");
  setTimeout(() => {
    document.getElementById("fadein-overlay").remove();
  }, 500);
});


/*-------- カードキースキャン ---------*/
function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", "cardKey");
}

function handleDrop(event, n) {
  const data = event.dataTransfer.getData("text/plain");
  if (data === "cardKey" && n === 1) {
    // カードリーダーの見た目変化
    const reader = document.getElementById("reader" + n);
    const result = document.getElementById("resultEl");
    reader.style.background = "#4c4";
    reader.style.border = "solid 1px  var(--black-color)";
    reader.textContent = "Success";
    result.textContent = "これでボタンが押せそうだ。";

    // ボタン有効化
    document.querySelectorAll(".top_el-btn").forEach((btn) => {
      btn.disabled = false;
      btn.classList.add("is-active");
    });
  }

  if (data === "cardKey" && n === 2) {
    // カードリーダーの見た目変化
    const reader = document.getElementById("reader" + n);
    const answer = document.getElementById("answerDo");
    const result = document.getElementById("resultDo");
    reader.style.background = "#4c4";
    reader.style.border = "solid 1px  var(--black-color)";
    reader.textContent = "Success";
    answer.classList.remove("is-disable");
    result.textContent = "これで解除コードが入力できるみたい。";

    // ボタン有効化
    document.querySelectorAll(".top_el-btn").forEach((btn) => {
      btn.disabled = false;
      btn.classList.add("is-active");
    });
  }
}

/*-------- カードキー裏返し ---------*/
function flipCard() {
  document.querySelectorAll(".js_card").forEach((card) => {
    card.classList.toggle("flip");
    setTimeout(() => {
      card.classList.toggle("is-active");
    }, 500);
  });
}

/*-------- 回答アクション ---------*/
function checkAnswer(num) {
  const input = document
    .getElementById("answer" + num)
    .value.trim()
    .toLowerCase();
  const result = document.getElementById("result" + num);

  // ch
  if (num === "Ch") {
    if (input === "room" || input === "ルーム") {
      result.textContent = "チェックイン完了！エレベーターに乗ろう。";
      setTimeout(() => {
        // 次のセクションへ
        document.getElementById("checkin").classList.remove("is-active");
        document.getElementById("elevator").classList.add("is-active");
      }, 2000);
    } else {
      result.textContent =
        "受付嬢「暗証コード【" + input + "】では登録されていません」";
    }
  }

  //el
  if (num === "El") {
    const resultEln = document.getElementById("resultEln");
    resultEln.textContent = "";
    result.textContent = "よし、これで上がれる。";
    setTimeout(() => {
      // 次のセクションへ
      document.getElementById("elevator").classList.remove("is-active");
      document.getElementById("door").classList.add("is-active");
    }, 2000);
  }
  if (num === "Eln") {
    result.textContent = ".";
    setTimeout(() => {
      result.textContent = "「泊まる部屋は、この階じゃない。」";
    }, 50);
  }

  // do
  if (num === "Do") {
    const today = new Date();
    const mmdd =
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");
    const answer = document.getElementById("answerDo");
    if (answer.classList.contains("is-disable")) {
      result.textContent = "暗証番号を入力しないと...";
    } else {
      if (input === mmdd) {
        result.textContent = "カチッ… 部屋のロックが解除された。";
        setTimeout(() => {
          // 次のセクションへ
          window.location.href = "room.html"; // ← ここを遷移先に変更
        }, 2000);
      } else {
        result.textContent = "違うようだ…";
      }
    }
  }
}

// function openhint() {
//   const hint = document.getElementById("q4_hint_1");
//   hint.classList.add("is-active");
// }


/*---------- ハンバーガーメニュー ----------*/
const hamburger = document.querySelector(".js_hamburger");
const navigation = document.querySelector(".js_nav");
const body = document.querySelector(".js_body");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("is-active");
  navigation.classList.toggle("is-active");
  // body.classList.toggle("is-active");
  if (body.classList.contains("is-active")) {
    enableScroll();
  } else {
    disableScroll();
  }
});

// PC幅でナビゲーションをクリックしても"is-active"がつかないようにします
navigation.addEventListener("click", () => {
  if (window.innerWidth < 1080) {
    hamburger.classList.toggle("is-active");
    navigation.classList.toggle("is-active");
    // body.classList.toggle("is-active");
    if (body.classList.contains("is-active")) {
      enableScroll();
    } else {
      disableScroll();
    }
  }
});

// スマホ（ハンバーガーメニューをクリック）→PC→スマホに画面幅が変更されたとき、強制的に"is-active"を外す
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1080) {
    hamburger.classList.remove("is-active");
    navigation.classList.remove("is-active");
    body.classList.remove("is-active");
  }
});

/*---------- スライドによるヘッダの表示 ----------*/
let lastScrollY = window.scrollY;
let threshold = 500; // 500px 上から以上スクロールしたら反応
let timeout;
let isFooterVisible = false;
const footer = document.querySelector(".l_footer");
const header = document.querySelector(".js_header");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  // フッターが見えていたらスクロール判定はしない
  if (isFooterVisible) return;

  clearTimeout(timeout); // 既存のタイマーをリセット

  if (currentScrollY > lastScrollY && currentScrollY > threshold) {
    header.classList.add("is-active");
  } else {
    header.classList.remove("is-active");
  }

  lastScrollY = currentScrollY;

  // スクロールが止まったら 1 秒後にヘッダーを表示
  timeout = setTimeout(() => {
    // フッターが見えていたら表示しない
    if (isFooterVisible) return;
    header.classList.remove("is-active");
  }, 1000);
});

// フッターの可視状態を監視
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("フッターが見えた！ヘッダーを隠す");
        isFooterVisible = true;
        header.classList.add("is-active");
      } else {
        console.log("フッターが見えなくなった！スクロール判定を再開");
        isFooterVisible = false;
      }
    });
  },
  {
    root: null, // ビューポート（画面）基準
    threshold: 0.1, // 10% 見えたら発動
  }
);

observer.observe(footer);

let scrollY;

function disableScroll() {
  scrollY = window.scrollY;

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  body.style.paddingRight = `${scrollbarWidth}px`;
  body.style.top = `-${scrollY}px`;
  body.classList.add("is-active");
}

function enableScroll() {
  body.style.paddingRight = "";
  body.style.top = "";
  window.scrollTo(0, scrollY);
  body.classList.remove("is-active");
}
