import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "panelfreefire-f90aa.firebaseapp.com",
  projectId: "panelfreefire-f90aa",
  storageBucket: "panelfreefire-f90aa.firebasestorage.app",
  messagingSenderId: "788453326370",
  appId: "1:788453326370:web:b53c27d2fe493e1e9c547b",
  measurementId: "G-W8BTPFCFW4"
};

function slug(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const file = path.resolve("configs.json");
  const raw = fs.readFileSync(file, "utf-8");
  const configs = JSON.parse(raw);

  let ok = 0;

  for (const c of configs) {
    const id = `${slug(c.brand)}_${slug(c.model)}_${slug(c.profile)}`;

    await setDoc(doc(db, "configs", id), {
      brand: c.brand,
      model: c.model,
      profile: c.profile,
      dpi: Number(c.dpi ?? 0),
      fireButton: c.fireButton ?? "",
      aimButton: c.aimButton ?? "",
      graphics: c.graphics ?? "",
      highFps: c.highFps ?? "",
      shadow: c.shadow ?? "",
      filters: c.filters ?? "",
      tips: c.tips ?? "",
      notes: c.notes ?? "",
      isPremium: Boolean(c.isPremium ?? false),
      updatedAt: new Date(),
    });

    ok++;
    console.log(`✅ Config importada: ${id}`);
  }

  console.log(`\n🎉 Finalizado. Total configs importadas: ${ok}`);
}

main().catch((e) => {
  console.error("❌ Erro:", e);
  process.exit(1);
});
