import fs from "fs";
import path from "path";
import { initialVehicles } from "@/db/seed";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "vehicles.json");

function ensureStoreExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    const defaultList = initialVehicles.map((item, idx) => ({
      ...item,
      id: idx + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    fs.writeFileSync(FILE_PATH, JSON.stringify(defaultList, null, 2), "utf-8");
  }
}

export function getLocalVehicles() {
  ensureStoreExists();
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return initialVehicles.map((item, idx) => ({
      ...item,
      id: idx + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
}

export function addLocalVehicle(data: Record<string, any>) {
  ensureStoreExists();
  const list = getLocalVehicles();
  const maxId = list.reduce((max: number, v: any) => Math.max(max, Number(v.id) || 0), 0);
  const newCar = {
    ...data,
    id: maxId + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  list.unshift(newCar);
  fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  return newCar;
}

export function updateLocalVehicle(id: number, updateData: Record<string, any>) {
  ensureStoreExists();
  const list = getLocalVehicles();
  const index = list.findIndex((v: any) => Number(v.id) === Number(id));
  if (index === -1) return null;
  list[index] = {
    ...list[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  return list[index];
}

export function deleteLocalVehicle(id: number) {
  ensureStoreExists();
  const list = getLocalVehicles();
  const filtered = list.filter((v: any) => Number(v.id) !== Number(id));
  fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
