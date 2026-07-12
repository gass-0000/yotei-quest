function updateDataInfo(){
  if(document.getElementById("schemaVersionLabel")) document.getElementById("schemaVersionLabel").textContent=String(data.schemaVersion||SCHEMA_VERSION);
  if(document.getElementById("lastBackupLabel")) document.getElementById("lastBackupLabel").textContent=localStorage.getItem("yq_last_backup")||"まだありません";
}

function backupPayload(){
  return {
    app:"よていクエスト",
    appVersion:APP_VERSION,
    schemaVersion:SCHEMA_VERSION,
    exportedAt:new Date().toISOString(),
    data:migrateStore(data)
  };
}

function initBackupUI(){
  const exportButton=document.getElementById("exportBackup");
  const importButton=document.getElementById("importBackup");
  const fileInput=document.getElementById("backupFile");
  const repairButton=document.getElementById("repairData");
  if(!exportButton||!importButton||!fileInput||!repairButton) return;

  exportButton.onclick=()=>{
    const payload=backupPayload();
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    const stamp=new Date().toISOString().slice(0,10).replaceAll("-","");
    a.href=url;a.download=`yoteiquest_backup_${stamp}.json`;
    document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    const label=new Date().toLocaleString("ja-JP");
    localStorage.setItem("yq_last_backup",label);
    updateDataInfo();toast("バックアップを書き出しました。");
  };

  importButton.onclick=()=>fileInput.click();
  fileInput.onchange=async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{
      const parsed=JSON.parse(await file.text());
      const incoming=parsed.data||parsed;
      const restored=migrateStore(incoming);
      if(!confirm("現在のデータをバックアップ内容で置き換えますか？"))return;
      data=restored;persistAll();renderAll();updateDataInfo();toast("データを復元しました。");
    }catch(err){alert("バックアップを読み込めませんでした。JSONファイルを確認してください。")}
    e.target.value="";
  };

  repairButton.onclick=()=>{
    const legacy=readLegacy();let added=0;
    for(const key of ["events","study","books","work","family","recipes"]){
      const ids=new Set((data[key]||[]).map(x=>x.id).filter(Boolean));
      for(const item of legacy[key]||[]){
        if(!item.id||!ids.has(item.id)){
          data[key].push(item);if(item.id)ids.add(item.id);added++;
        }
      }
    }
    persistAll();renderAll();toast(added?`${added}件を修復しました。`:"修復が必要なデータはありません。");
  };
}

initBackupUI();
