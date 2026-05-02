/**
 * Native App Utilities
 * Funções para integración nativa de app
 */

// Detectar si está instalada como app nativo
export const isInstalledApp = () => {
  return window.navigator.standalone === true ||
         window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches;
};

// Detectar pantalla fullscreen
export const isFullscreen = () => {
  return document.fullscreenElement ||
         document.webkitFullscreenElement ||
         document.mozFullScreenElement;
};

// Solicitar instalación de app (Android)
export const requestInstallApp = () => {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt();
    window.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ App instalada');
      }
      window.deferredPrompt = null;
    });
  }
};

// Vibración haptica
export const vibrate = (pattern = 100) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// Solicitar notificaciones
export const requestNotifications = async () => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Mostrar notificación
export const showNotification = (title, options = {}) => {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/favicon.png',
          badge: '/favicon.svg',
          theme_color: '#fbbf24',
          ...options,
        });
      });
    }
  }
};

// Registrar service worker
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker no soportado');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });
    console.log('✅ Service Worker registrado:', registration);
    return registration;
  } catch (error) {
    console.error('❌ Error registrando Service Worker:', error);
    return null;
  }
};

// Verificar online status
export const isOnline = () => navigator.onLine;

// Escuchar cambios de conexión
export const onOnlineStatusChange = (callback) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
  
  return () => {
    window.removeEventListener('online', () => callback(true));
    window.removeEventListener('offline', () => callback(false));
  };
};

// Solicitar screen orientation
export const lockOrientation = (orientation = 'portrait-primary') => {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock(orientation).catch((error) => {
      console.warn('No se puede bloquear orientación:', error);
    });
  }
};

// Solicitar fullscreen
export const requestFullscreen = (element = document.documentElement) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
};

// Salir de fullscreen
export const exitFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen();
  }
};

// Inicializar app nativa
export const initNativeApp = async () => {
  console.log('🚀 Inicializando app nativa...');
  
  // Registrar service worker
  await registerServiceWorker();
  
  // Detectar instalación
  console.log('📱 App instalada:', isInstalledApp());
  
  // Bloquear orientación
  lockOrientation('portrait-primary');
  
  // Solicitar notificaciones
  const notificationsGranted = await requestNotifications();
  console.log('🔔 Notificaciones:', notificationsGranted ? 'permitidas' : 'denegadas');
  
  // Escuchar cambios de conexión
  onOnlineStatusChange((isOnline) => {
    console.log(isOnline ? '🟢 Online' : '🔴 Offline');
  });
};

// Detectar dispositivo
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  return {
    isIOS: /iPad|iPhone|iPod/.test(ua),
    isAndroid: /Android/.test(ua),
    isMobile: /Mobile|Android|iPhone/.test(ua),
    isTablet: /iPad|Android(?!.*Mobile)/.test(ua),
    isInstalled: isInstalledApp(),
    online: isOnline(),
  };
};
