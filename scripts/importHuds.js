import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
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

  const file = path.resolve("huds.json");
  const raw = fs.readFileSync(file, "utf-8");
  const huds = JSON.parse(raw);

  let ok = 0;

  for (const h of huds) {
    const id = `${slug(h.brand)}_${slug(h.model)}_${slug(h.profile)}`;

    await setDoc(doc(db, "huds", id), {
      brand: h.brand,
      model: h.model,
      profile: h.profile,
      fingers: h.fingers ?? "2 dedos",
      description: h.description ?? "",
      steps: h.steps ?? "",
      imageUrl: h.imageUrl ?? "",
      notes: h.notes ?? "",
      isPremium: Boolean(h.isPremium ?? false),
      updatedAt: new Date(),
    });

    ok++;
    console.log(`✅ HUD importado: ${id}`);
  }

  console.log(`\n🎉 Finalizado. Total HUDs importados: ${ok}`);
}

main().catch((e) => {
  console.error("❌ Erro:", e);
  process.exit(1);
});
