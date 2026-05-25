const healthCompanionServiceLocalStorage = {
  save: (key, value) => {
    localStorage.setItem(key, value);
    return { success: true };
  },
  get: (key) => {
    const data = localStorage.getItem(key);
    return localStorage.getItem(key);
  },
  remove: (key) => {
    localStorage.removeItem(key);
    return  {success: true};
  }
};

export default healthCompanionServiceLocalStorage;
