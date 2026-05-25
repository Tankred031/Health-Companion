// Čitamo iz pohrane ili postavljamo zadano na 'memorija' ako ništa još nije odabrano
export const DATA_SOURCE = localStorage.getItem('dataSource') || 'memorija';

export const RouteNames = {
    HOME: '/',
    KALKULATORI: '/kalkulatori',
    PRIRODA: '/priroda',
    MJESEC: '/mjesec',
    KRETANJE: '/kretanje',
    PRACENJE: '/pracenje'
};
