const CURRENT_SCHEMA_VERSION = 1;

function createEmptyStore(){
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    appVersion: "1.0.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    events: [],
    recipes: [],
    study: [],
    books: [],
    work: [],
    family: [],
    todo: [],
    money: 0,
    inventory: [],
    room: { items: [] },
    gacha: { history: [] },
    settings: { soundEnabled: true, bgmEnabled: true, reducedMotion: false }
  };
}

function migrateStore(raw){
  if(!raw || typeof raw !== "object") return createEmptyStore();
  const base = createEmptyStore();
  const migrated = {...base, ...raw};
  for(const key of ["events","recipes","study","books","work","family","todo","inventory"]){
    if(!Array.isArray(migrated[key])) migrated[key] = [];
  }
  if(!migrated.room || typeof migrated.room !== "object") migrated.room = {items:[]};
  if(!Array.isArray(migrated.room.items)) migrated.room.items = [];
  if(!migrated.gacha || typeof migrated.gacha !== "object") migrated.gacha = {history:[]};
  if(!Array.isArray(migrated.gacha.history)) migrated.gacha.history = [];
  if(!migrated.settings || typeof migrated.settings !== "object") migrated.settings = base.settings;
  migrated.settings = {...base.settings, ...migrated.settings};
  migrated.money = Number.isFinite(Number(migrated.money)) ? Number(migrated.money) : 0;
  migrated.schemaVersion = CURRENT_SCHEMA_VERSION;
  migrated.appVersion = "1.0.0";
  migrated.updatedAt = new Date().toISOString();
  return migrated;
}
