/*
 * bag.js — 내 가방
 *
 * 로그인한 회원마다 가방 속 물품(이름+개수)을 직접 입력해서 모아둔다.
 * myBag은 지금 로그인한 회원의 물품 배열이고(Auth.getBagItems로 불러옴),
 * showMyBag()이 반복문으로 그 내용을 화면(#bagList)에 한 줄씩 그려준다.
 */
var myBag = [];

// 지금 로그인한 회원의 물품 목록을 다시 불러온다
function loadMyBag() {
    var user = window.Auth && Auth.currentUser();
    myBag = user ? Auth.getBagItems(user.userId) : [];
}

// myBag을 지금 로그인한 회원 계정에 저장한다
function saveMyBagItems() {
    var user = window.Auth && Auth.currentUser();
    if (!user) return { ok: false };
    return Auth.saveBagItems(user.userId, myBag);
}

// myBag 내용을 반복문으로 화면(#bagList)에 그려준다
function showMyBag() {
    loadMyBag();

    var listEl = document.getElementById("bagList");
    var totalEl = document.getElementById("bagTotal");
    var totalCount = 0;

    listEl.innerHTML = "";

    if (myBag.length === 0) {
        var empty = document.createElement("li");
        empty.className = "bag-empty";
        empty.textContent = "아직 넣은 물품이 없습니다. 아래에서 추가해 보세요.";
        listEl.appendChild(empty);
    }

    for (var i = 0; i < myBag.length; i++) {
        var item = myBag[i];

        var li = document.createElement("li");

        var text = document.createElement("span");
        text.textContent = item.name + " — " + item.count + "개";

        var delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "bag-del-btn";
        delBtn.textContent = "삭제";
        delBtn.addEventListener("click", makeDeleteHandler(i));

        li.appendChild(text);
        li.appendChild(delBtn);
        listEl.appendChild(li);

        totalCount += item.count;
    }

    totalEl.textContent = myBag.length
        ? "물품 " + myBag.length + "종 · 총 " + totalCount + "개"
        : "";
}

// 반복문 안에서 i를 그대로 쓰면 클릭할 때마다 마지막 값으로 바뀌어 있으니
// 함수를 하나 더 감싸서 클릭 시점의 i를 기억해 둔다
function makeDeleteHandler(index) {
    return function () {
        myBag.splice(index, 1);
        saveMyBagItems();
        showMyBag();
    };
}

// 이름/개수를 받아 물품을 하나 추가한다. 성공하면 true, 잘못된 입력이면 false.
function addBagItem(name, count) {
    name = (name || "").trim();
    count = Number(count);

    if (!name || isNaN(count) || count <= 0) return false;

    myBag.push({ name: name, count: count });
    saveMyBagItems();
    showMyBag();
    return true;
}
