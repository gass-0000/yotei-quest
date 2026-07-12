const APP_VERSION = "1.0.0";
const SCHEMA_VERSION = CURRENT_SCHEMA_VERSION;
const MASTER_KEY = "yoteiquest_data_v1";
const PREVIOUS_MASTER_KEYS = ["yoteiQuestData"];
const LEGACY_KEYS = {
  events:"yq_events_v2", study:"yq_study_v2", books:"yq_books_v2",
  work:"yq_work_v2", family:"yq_family_v2", recipes:"yq_recipes_v4"
};

function safeParse(text, fallback){
  try{return JSON.parse(text)}catch{return fallback}
}

function readLegacy(){
  const legacy = createEmptyStore();
  for(const [name,key] of Object.entries(LEGACY_KEYS)){
    legacy[name] = safeParse(localStorage.getItem(key)||"[]", []);
  }
  return legacy;
}

function loadStore(){
  const current = safeParse(localStorage.getItem(MASTER_KEY)||"null", null);
  if(current) return migrateStore(current);

  for(const oldKey of PREVIOUS_MASTER_KEYS){
    const oldMaster = safeParse(localStorage.getItem(oldKey)||"null", null);
    if(oldMaster){
      const migrated = migrateStore(oldMaster);
      localStorage.setItem(MASTER_KEY, JSON.stringify(migrated));
      return migrated;
    }
  }

  const legacy = migrateStore(readLegacy());
  localStorage.setItem(MASTER_KEY, JSON.stringify(legacy));
  return legacy;
}

let data = loadStore();

function persistAll(){
  data = migrateStore(data);
  localStorage.setItem(MASTER_KEY, JSON.stringify(data));
  // One release of compatibility writes keeps rollback safe.
  localStorage.setItem("yoteiQuestData", JSON.stringify(data));
  for(const [name,key] of Object.entries(LEGACY_KEYS)){
    localStorage.setItem(key, JSON.stringify(data[name]||[]));
  }
}

function save(){persistAll()}
