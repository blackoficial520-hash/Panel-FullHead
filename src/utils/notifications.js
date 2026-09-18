import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

const NOTIF_TEXTS = {
  panelActivo: {
    title: "✅ Panel FullHead Activo",
    body: "Tu panel está funcionando correctamente en segundo plano.",
  },
  bienvenido: {
    title: "🎯 FullHead Panel",
    body: "Bienvenido de vuelta. Tu sesión está activa.",
  },
};

export async function solicitarPermisoNotificaciones() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const permiso = await Notification.requestPermission();
  return permiso === "granted";
}

export async function registrarTokenFCM(userId, messagingInstance) {
  if (!messagingInstance || !VAPID_KEY) return null;

  try {
    const swReg = await navigator.serviceWorker.getRegistration("/");
    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token && userId) {
      await setDoc(
        doc(db, "usuarios", userId, "tokens", "fcm"),
        {
          token,
          plataforma: "web",
          actualizadoEn: serverTimestamp(),
        },
        { merge: true }
      );
      console.log("✅ Token FCM registrado en Firestore");
    }

    return token;
  } catch (error) {
    console.warn("⚠️ No se pudo obtener token FCM:", error.message);
    return null;
  }
}

export function escucharNotificacionesEnPrimerPlano(messagingInstance) {
  if (!messagingInstance) return;

  onMessage(messagingInstance, (payload) => {
    const title = payload.notification?.title || payload.data?.title;
    const body = payload.notification?.body || payload.data?.body;
    mostrarNotificacionLocal(
      title || NOTIF_TEXTS.panelActivo.title,
      body || NOTIF_TEXTS.panelActivo.body
    );
  });
}

export function mostrarNotificacionLocal(titulo, cuerpo) {
  if (!("serviceWorker" in navigator)) return;
  if (Notification.permission !== "granted") return;

  navigator.serviceWorker.ready.then((reg) => {
    reg.showNotification(titulo, {
      body: cuerpo,
      icon: "/favicon.png",
      badge: "/favicon.png",
      tag: "fullhead-panel-activo",
      renotify: false,
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: { url: "/" },
      actions: [{ action: "abrir", title: "Abrir Panel" }],
    });
  });
}

export function activarNotificacionSegundoPlano() {
  let temporizador = null;

  const alCambiarVisibilidad = () => {
    if (document.visibilityState === "hidden") {
      temporizador = setTimeout(() => {
        mostrarNotificacionLocal(
          NOTIF_TEXTS.panelActivo.title,
          NOTIF_TEXTS.panelActivo.body
        );
      }, 3000);
    } else {
      if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
      }
    }
  };

  document.addEventListener("visibilitychange", alCambiarVisibilidad);

  return () => {
    document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    if (temporizador) clearTimeout(temporizador);
  };
}

export async function inicializarNotificaciones(userId, messagingInstance) {
  const permitido = await solicitarPermisoNotificaciones();
  if (!permitido) {
    console.warn("🔕 El usuario no otorgó permisos de notificación.");
    return;
  }

  await registrarTokenFCM(userId, messagingInstance);
  escucharNotificacionesEnPrimerPlano(messagingInstance);
  activarNotificacionSegundoPlano();

  console.log("🔔 Sistema de notificaciones inicializado.");
}
