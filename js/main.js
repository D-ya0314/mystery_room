"use strict";

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

/*---------- 幕開け ----------*/
function start(n) {
  document.querySelector(".start").classList.add("is-disable");
  document.querySelector(".js_body").classList.remove("is-active");
  // document.getElementById("don-sound").play();

  // setTimeout(() => {
  document.getElementById("intro-overlay").style.display = "none";
  // document.getElementById("checkin").classList.add("is-active");
  if (n === "o") {
    document.getElementById("hello").play();
    setTimeout(() => {
      document.getElementById("reserve").play();
    }, 1500);
  }
  if (n === "d") {
    document.getElementById("lock").play();
  }

  // }, 2000); // 2秒後に切り替え
}

/*-------- カードキースキャン ---------*/
function handleDragStart(event) {
  event.dataTransfer.setData("application/my-app", "cardKey");
  event.dataTransfer.setData("text/plain", "");
}

function handleDrop(event, n) {
  const data = event.dataTransfer.getData("application/my-app");
  // const data = event.dataTransfer.getData("text/plain");
  if (data === "cardKey" && n === 1) {
    // カードリーダーの見た目変化
    const reader = document.getElementById("reader" + n);
    const result = document.getElementById("resultEl");
    reader.style.background = "#4c4";
    reader.style.border = "solid 1px  var(--black-color)";
    reader.textContent = "Success";
    document.getElementById("scan").play();
    result.textContent = "カードタッチしないと押せないやつだったか";

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
    document.getElementById("scan").play();
    result.textContent = "これで解除コードが入力できるみたいだ";

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

/*-------- モーダル表示 ---------*/
let solvedCount = 0;

const roomQuestions = {
  room1:
    "謎①：鏡に映っている文字、これはなんだろう？エス、アイ、イーアイ...？</br><p class='room_q-room1'>「S　I　EI」",
  room2:
    "謎②：時計があるけど何かおかしいな。何時を指しているんだろう？<div class='room_img-box'><img src='img/clock.png'alt='時計の画像' class='room_img' width='500' height='500'/></div><p>回答形式「〇〇 〇〇」</p>",
  room3:
    "謎③：注意事項が書かれている。<br /><div class='room_q-room3'>1.チェックアウト時間を過ぎた場合、追加料金をいただきます。<br />2.晩御飯開始時刻は厳守でお願いします。<br />3.朝食は終了時刻に料理を片付けさせていただきます。</div><p>回答形式「〇〇 〇〇 〇」</p>",
  room4:
    "謎④：メモ帳に何か書かれている。<div class='top_ch-memo'><p class='top_ch-memo_p'>Diamond Hotel メモ</p><p class='top_ch-memo_p'>謎① 謎② 謎③</p></div><p>回答形式「〇〇〇〇」</p>",
};

let roomId;
document.querySelectorAll(".room_q").forEach((room) => {
  room.addEventListener("click", () => {
    roomId = room.id;
    document.getElementById("modalQuestion").innerHTML = roomQuestions[roomId];
    document.getElementById("answerRo").value = "";
    document.getElementById("resultRo").textContent = "";
    document.getElementById("modal").classList.remove("is-disable");
  });
});

document.getElementById("modalCloseBtn").addEventListener("click", () => {
  document.getElementById("modal").classList.add("is-disable");
});

/*-------- 回答アクション ---------*/
function checkAnswer(num) {
  const input = document
    .getElementById("answer" + num)
    .value.trim()
    .toLowerCase();
  const result = document.getElementById("result" + num);

  // ch
  if (num === "Ch") {
    if (input === "room" || input === "ルーム" || input === "るーむ") {
      result.innerHTML =
        "受付嬢「本日の晩御飯ですが、19時からですので<br />遅刻しないようお願いいたします。<br />エレベーターは、あちらになります。」<br />チェックイン完了！エレベーターで上がろう。";
      document.getElementById("diner").play();
      setTimeout(() => {
        // 次のセクションへ
        document.getElementById("checkin").classList.remove("is-active");
        document.getElementById("elevator").classList.add("is-active");
      }, 9000);
    } else {
      result.textContent = ".";
      setTimeout(() => {
        result.textContent =
          "受付嬢「暗証コード【" + input + "】では登録されていません」";
        document.getElementById("notCode").play();
      }, 50);
    }
  }

  //el
  if (num === "El") {
    const resultEln = document.getElementById("resultEln");
    resultEln.textContent = "";
    result.textContent = "12階か";
    document.getElementById("elevatorSound").play();
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
        document.getElementById("open").play();
        result.textContent = "（ｶﾁｬ）… 部屋のロックが解除された。";
        setTimeout(() => {
          // 次のセクションへ
          window.location.href = "room.html";
        }, 2000);
      } else {
        result.textContent = ".";
        setTimeout(() => {
          result.textContent = "違うようだ…";
        }, 50);
      }
    }
  }

  // ro
  if (num === "Ro") {
    if (roomId === "room1") {
      if (
        input === "13 1 2" ||
        input === "1312" ||
        input === "13　1　2" ||
        input === "１３ １ ２" ||
        input === "１３１２" ||
        input === "１３　１　２"
      ) {
        result.textContent = "あっているみたいだけど、なんの数字だろう。";
        document.getElementById("roomAnswer1").textContent = "謎①：13 1 2";
        setTimeout(() => {
          document.getElementById("modal").classList.add("is-disable");
        }, 2000);
      } else {
        result.textContent = ".";
        setTimeout(() => {
          result.textContent = "どうやら違うみたい。";
        }, 50);
      }
    } else if (roomId === "room2") {
      if (
        input === "15 18" ||
        input === "15　18" ||
        input === "１５ １８" ||
        input === "１５　１８"
      ) {
        result.textContent = "もうこんな時間か、おやつでも食べよう";
        document.getElementById("roomAnswer2").textContent = "謎②：15 18";
        setTimeout(() => {
          document.getElementById("modal").classList.add("is-disable");
        }, 3000);
      } else if (
        input === "03 18" ||
        input === "03　18" ||
        input === "０３ １８" ||
        input === "０３　１８"
      ) {
        result.textContent = ".";
        setTimeout(() => {
          result.textContent =
            "どうやら違うみたい。それにしても小腹が空いたな...";
        }, 50);
      } else {
        result.textContent = ".";
        setTimeout(() => {
          result.textContent = "どうやら違うみたい。";
        }, 50);
      }
    } else if (roomId === "room3") {
      if (
        input === "15 19 9" ||
        input === "15　19　9" ||
        input === "１５ １９ ９" ||
        input === "１５　１９　９"
      ) {
        result.textContent = "あっているみたいだけど、なんの数字だろう。";
        document.getElementById("roomAnswer3").textContent = "謎③：15 19 9";
        setTimeout(() => {
          document.getElementById("modal").classList.add("is-disable");
        }, 3000);
      } else {
        result.textContent = ".";
        setTimeout(() => {
          result.textContent = "どうやら違うみたい。";
        }, 50);
      }
    } else if (roomId === "room4") {
      if (input === "まぼろし" || input === "マボロシ") {
        result.textContent = "急に視界が眩しくなった";
        document.getElementById("clear").play();
        setTimeout(() => {
          document.getElementById("fadeout-overlay").style.opacity = 1;
        }, 3000);
        setTimeout(() => {
          window.location.href = "clear.html";
        }, 5000);
      } else {
        result.textContent = ".";
        setTimeout(() => {
          result.textContent = "どうやら違うみたい。";
        }, 50);
      }
    }
  }
}

// ヒント
const hints = document.querySelectorAll(".js_hint");
function hint() {
  hints.forEach((el) => {
    el.classList.toggle("is-active");
  });
}

function openhint(n) {
  if (n === "r1") {
    const hint = document.getElementById("hintRoom1");
    hint.classList.toggle("is-active");
  } else if (n === "r2") {
    const hint = document.getElementById("hintRoom2");
    hint.classList.toggle("is-active");
  } else if (n === "r3") {
    const hint = document.getElementById("hintRoom3");
    hint.classList.toggle("is-active");
  }
}
