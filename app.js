let selectedDate = "";

// 手入力切替
document.getElementById("manual").addEventListener("change", function() {
  document.getElementById("manualBox").style.display =
    this.checked ? "block" : "none";
});

// 計算
function calc() {
  const manual = document.getElementById("manual").checked;

  if (manual) {
    document.getElementById("result").innerText =
      document.getElementById("manualPay").value + " 円";
    return;
  }

  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const base = Number(document.getElementById("type").value);

  let s = new Date("2000-01-01 " + start);
  let e = new Date("2000-01-01 " + end);

  let total = 0;

  while (s < e) {
    total += base * 0.25;
    s.setMinutes(s.getMinutes() + 15);
  }

  document.getElementById("result").innerText =
    Math.round(total) + " 円";
}

// 保存
function saveData() {
  if (!selectedDate) return alert("日付選択");

  const val = Number(document.getElementById("result").innerText.replace(" 円",""));

  let data = JSON.parse(localStorage.getItem("salaryData") || "[]");
  data.push({ date: selectedDate, value: val });
  localStorage.setItem("salaryData", JSON.stringify(data));

  renderList();

  // リセット
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  document.getElementById("manual").checked = false;
  document.getElementById("manualBox").style.display = "none";
  document.getElementById("manualPay").value = "";
  document.getElementById("result").innerText = "";
}

// 一覧
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("salaryData") || "[]");

  data.sort((a,b)=> new Date(a.date)-new Date(b.date));

  let total = 0;

  data.forEach((item,index)=>{
    total += item.value;

    const li = document.createElement("li");
    li.className = "list-item";

    li.innerHTML = `
      <span>${item.date} : ${item.value}円</span>
      <div class="button-group">
        <button class="small-btn" onclick="deleteData(${index})">削除</button>
      </div>
    `;

    list.appendChild(li);
  });

  document.getElementById("total").innerText = total + " 円";
}

// 削除
function deleteData(i){
  let data = JSON.parse(localStorage.getItem("salaryData") || "[]");
  data.splice(i,1);
  localStorage.setItem("salaryData", JSON.stringify(data));
  renderList();
}

// ページ切替
function showPage(p){
  document.getElementById("calcPage").style.display = p==="calc"?"block":"none";
  document.getElementById("reportPage").style.display = p==="report"?"block":"none";
  if(p==="report") loadReport();
}

// レポート
function loadReport(){
  const year = document.getElementById("yearPicker").value || new Date().getFullYear();

  let data = JSON.parse(localStorage.getItem("salaryData") || "[]");

  let monthly = Array(12).fill(0);
  let total = 0;

  data.forEach(d=>{
    const date = new Date(d.date);
    if(date.getFullYear()==year){
      monthly[date.getMonth()] += d.value;
      total += d.value;
    }
  });

  document.getElementById("yearTotal").innerText = year+"年 合計："+total+"円";

  const chart = document.getElementById("chart");
  chart.innerHTML = "";

  monthly.forEach((v,i)=>{
    const div = document.createElement("div");
    div.className="bar";
    div.style.width = (v/50000*100)+"%";
    div.innerText = (i+1)+"月 "+v+"円";
    div.onclick = ()=>showMonthDetail(year,i);
    chart.appendChild(div);
  });
}

// 月詳細
function showMonthDetail(year,month){
  let data = JSON.parse(localStorage.getItem("salaryData") || "[]");

  const list = document.getElementById("reportList");
  list.innerHTML = "";

  data.forEach(d=>{
    const date = new Date(d.date);
    if(date.getFullYear()==year && date.getMonth()==month){
      const li = document.createElement("li");
      li.innerText = d.date+" : "+d.value+"円";
      list.appendChild(li);
    }
  });

  document.getElementById("backBtn").style.display="block";
}

// 戻る
function backToReport(){
  document.getElementById("reportList").innerHTML="";
  document.getElementById("backBtn").style.display="none";
}