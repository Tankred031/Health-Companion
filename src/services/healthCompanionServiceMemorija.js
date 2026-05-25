// Lokalni objekt koji glumi memorijski spremnik
const memorijskiSef = {};

const healthCompanionServiceMemorija = {
  save: (key, value) => {
    memorijskiSef[key] = String(value);
    return {success: true};
  },
  get: (key) => {
    return memorijskiSef[key] || null;
  },
  remove: (key) => {
    delete memorijskiSef[key];
    return { success: true };
  }
};

export default healthCompanionServiceMemorija;
