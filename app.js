const $=id=>document.getElementById(id);
let viewDate=new Date(),selectedDate=fmt(new Date()),modalMode="",recipeCategory="main";
function fmt(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function pdate(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)}
function jp(s){const d=pdate(s),w=["日","月","火","水","木","金","土"][d.getDay()];return `${d.getFullYear()}年 ${d.getMonth()+1}月 ${d.getDate()}日（${w}）`}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]))}
function uid(){return crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random())}
function persistAll(){
 data.schemaVersion=SCHEMA_VERSION;data.updatedAt=new Date().toISOString();
 localStorage.setItem(MASTER_KEY,JSON.stringify(data));
 for(const [name,key] of Object.entries(LEGACY_KEYS)) localStorage.setItem(key,JSON.stringify(data[name]||[]));
}
function save(k){persistAll()}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1500)}
function showScreen(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");window.scrollTo(0,0);renderAll()}
document.querySelectorAll("[data-screen]").forEach(b=>b.onclick=()=>showScreen(b.dataset.screen));
document.querySelectorAll(".back-btn").forEach(b=>{
  if(!b.id) b.onclick=()=>showScreen("homeScreen");
});
$("recipeBackHome").onclick=()=>showScreen("homeScreen");
$("recipeBackRestaurant").onclick=()=>showScreen("recipeScreen");

function renderCards(target,list,type){
 const el=$(target);el.innerHTML=list.length?"":"<div class='empty'>まだ きろくが ありません。</div>";
 list.forEach(item=>{
  const c=document.createElement("div");c.className="card";
  let meta="",title="",note="";
  if(type==="events"||type==="family"){meta=`${item.date}${item.time?" "+item.time:""}`;title=item.name;note=item.note}
  if(type==="study"){meta=`${item.date} ／ ${item.minutes}分`;title=item.subject;note=item.note}
  if(type==="books"){meta=item.date;title=item.title;note=item.author}
  if(type==="work"){meta=item.date;title=item.title;note=item.note}
  c.innerHTML=`<div><div class="card-meta">${esc(meta)}</div><div class="card-title">${esc(title)}</div>${note?`<div class="card-note">${esc(note)}</div>`:""}</div><div><button class="small-btn danger">けす</button></div>`;
  c.querySelector("button").onclick=()=>{if(confirm("けしますか？")){data[type]=data[type].filter(x=>x.id!==item.id);save(type);renderAll()}};
  el.appendChild(c)
 })
}

function renderRecipes(){
 const labels={main:"メイン",side:"副菜",soup:"汁物"};
 $("recipeListTitle").textContent=`${labels[recipeCategory]}のメモ`;
 const list=data.recipes.filter(r=>r.category===recipeCategory).slice().reverse();
 const el=$("recipeList");el.innerHTML=list.length?"":"<div class='empty'>まだ レシピメモが ありません。</div>";
 list.forEach(item=>{
  const c=document.createElement("div");c.className="card";
  c.innerHTML=`<div><div class="card-meta">${esc(item.date)}</div><div class="card-title">${esc(item.title)}</div>${item.note?`<div class="card-note">${esc(item.note)}</div>`:""}</div><div><button class="small-btn danger">けす</button></div>`;
  c.querySelector("button").onclick=()=>{if(confirm("このレシピメモを けしますか？")){data.recipes=data.recipes.filter(x=>x.id!==item.id);save("recipes");renderRecipes()}};
  el.appendChild(c)
 })
}
document.querySelectorAll("[data-recipe-category]").forEach(b=>b.onclick=()=>{
  recipeCategory=b.dataset.recipeCategory;
  renderRecipes();
  showScreen("recipeListScreen");
});

function renderCalendar(){
 const y=viewDate.getFullYear(),m=viewDate.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0);
 $("monthTitle").textContent=`${y}年 ${m+1}月`;$("calendarDays").innerHTML="";
 for(let i=0;i<first.getDay();i++){const e=document.createElement("div");e.className="day";e.style.opacity=".15";$("calendarDays").appendChild(e)}
 for(let day=1;day<=last.getDate();day++){
  const key=fmt(new Date(y,m,day)),list=data.events.filter(e=>e.date===key).sort((a,b)=>(a.time||"99").localeCompare(b.time||"99"));
  const cell=document.createElement("button");cell.className="day";if(key===fmt(new Date()))cell.classList.add("today");if(key===selectedDate)cell.classList.add("selected");
  cell.innerHTML=`<span class="day-number">${day}</span>`;list.slice(0,2).forEach(ev=>{const x=document.createElement("span");x.className="event-dot";x.textContent=`${ev.time?ev.time+" ":""}${ev.name}`;cell.appendChild(x)});
  cell.onclick=()=>{selectedDate=key;renderCalendar()};$("calendarDays").appendChild(cell)
 }
 $("detailTitle").textContent=jp(selectedDate);renderCards("eventList",data.events.filter(x=>x.date===selectedDate),"events")
}
function renderAll(){
 renderCalendar();renderRecipes();updateDataInfo();
 const today=fmt(new Date());renderCards("todayList",data.events.filter(x=>x.date===today),"events");
 renderCards("studyList",data.study.slice().reverse(),"study");
 $("studyTotal").textContent=data.study.reduce((a,b)=>a+Number(b.minutes||0),0);$("studyCount").textContent=data.study.length;
 renderCards("readingList",data.books.slice().reverse(),"books");$("readingCount").textContent=data.books.length;$("readingProgress").style.width=Math.min(100,data.books.length)+"%";
 renderCards("workList",data.work.slice().reverse(),"work");
 renderCards("familyList",data.family.slice().sort((a,b)=>a.date.localeCompare(b.date)),"family")
}
$("prevMonth").onclick=()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);selectedDate=fmt(viewDate);renderCalendar()}
$("nextMonth").onclick=()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);selectedDate=fmt(viewDate);renderCalendar()}

function openModal(mode){
 modalMode=mode;let title="",fields="";
 if(mode==="events"){title="よていを とうろく";fields=`<label>ひづけ</label><input id="fDate" type="date" value="${selectedDate}" required><div class="form-grid"><div><label>じかん</label><input id="fTime" type="time"></div><div><label>しゅるい</label><select id="fCat"><option>かぞく</option><option>しごと</option><option>びょういん</option><option>ほいくえん</option><option>じぶん</option></select></div></div><label>なまえ</label><input id="fTitle" required><label>メモ</label><textarea id="fNote"></textarea>`}
 if(mode==="study"){title="べんきょうを きろく";fields=`<label>ひづけ</label><input id="fDate" type="date" value="${fmt(new Date())}" required><label>かもく</label><input id="fTitle" required><label>じかん（分）</label><input id="fMinutes" type="number" min="1" value="30" required><label>メモ</label><textarea id="fNote"></textarea>`}
 if(mode==="books"){title="本を とうろく";fields=`<label>よみおえた日</label><input id="fDate" type="date" value="${fmt(new Date())}" required><label>本の名前</label><input id="fTitle" required><label>著者</label><input id="fAuthor">`}
 if(mode==="work"){title="アイデアを とうろく";fields=`<label>ひづけ</label><input id="fDate" type="date" value="${fmt(new Date())}" required><label>タイトル</label><input id="fTitle" required><label>内容</label><textarea id="fNote"></textarea>`}
 if(mode==="family"){title="子どもの予定を とうろく";fields=`<label>ひづけ</label><input id="fDate" type="date" value="${fmt(new Date())}" required><label>じかん</label><input id="fTime" type="time"><label>よてい</label><input id="fTitle" required><label>メモ</label><textarea id="fNote"></textarea>`}
 if(mode==="recipes"){const labels={main:"メイン",side:"副菜",soup:"汁物"};title=`${labels[recipeCategory]}のレシピメモ`;fields=`<label>ひづけ</label><input id="fDate" type="date" value="${fmt(new Date())}" required><label>料理名</label><input id="fTitle" placeholder="れい：照り焼きチキン" required><label>材料・作り方・メモ</label><textarea id="fNote" placeholder="材料や手順、次回の改善点など"></textarea>`}
 $("modalTitle").textContent=title;$("modalFields").innerHTML=fields;$("genericModal").classList.add("show")
}
$("addEvent").onclick=()=>openModal("events");$("addStudy").onclick=()=>openModal("study");$("addBook").onclick=()=>openModal("books");$("addWork").onclick=()=>openModal("work");$("addFamily").onclick=()=>openModal("family");$("addRecipe").onclick=()=>openModal("recipes");
$("cancelModal").onclick=()=>$("genericModal").classList.remove("show");
$("genericForm").onsubmit=e=>{
 e.preventDefault();let item={id:uid()};
 if(modalMode==="events")item={...item,date:$("fDate").value,time:$("fTime").value,category:$("fCat").value,name:$("fTitle").value.trim(),note:$("fNote").value.trim()};
 if(modalMode==="study")item={...item,date:$("fDate").value,subject:$("fTitle").value.trim(),minutes:Number($("fMinutes").value),note:$("fNote").value.trim()};
 if(modalMode==="books")item={...item,date:$("fDate").value,title:$("fTitle").value.trim(),author:$("fAuthor").value.trim()};
 if(modalMode==="work")item={...item,date:$("fDate").value,title:$("fTitle").value.trim(),note:$("fNote").value.trim()};
 if(modalMode==="family")item={...item,date:$("fDate").value,time:$("fTime").value,name:$("fTitle").value.trim(),note:$("fNote").value.trim()};
 if(modalMode==="recipes")item={...item,date:$("fDate").value,title:$("fTitle").value.trim(),note:$("fNote").value.trim(),category:recipeCategory};
 data[modalMode].push(item);save(modalMode);$("genericModal").classList.remove("show");renderAll();toast("とうろくしました。")
};

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
renderAll();
