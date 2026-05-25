import healthCompanionServiceLocalStorage from '/healthCompanionServiceLocalStorage';
import healthCompanionServiceMemorija from '/healthCompanionServiceMemorija';
import { DATA_SOURCE } from '../../constants';

// Odabiremo aktivni spremnik na temelju onoga što je zapisano u konfiguraciji
const aktivniSpremnik = DATA_SOURCE === 'local' 
  ? healthCompanionServiceLocalStorage 
  : healthCompanionServiceMemorija;

const storageService = {
  save: (key, value) => {
    aktivniSpremnik.save(key, value);
  },
  get: (key) => {
    return aktivniSpremnik.get(key);
  },
  remove: (key) => {
    aktivniSpremnik.remove(key);
  },
  // Vraća string 'local' ili 'memorija' kako bismo znali što je trenutno aktivno
  getTrenutniNacin: () => {
    return DATA_SOURCE;
  }
};

export default storageService;
