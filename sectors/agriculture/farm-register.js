// Farm register for the Global Agriculture Dashboard.
// Same calls as Firestore (collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc). When the page has a
// Firebase project, useFirestore() hands the real functions over and every call goes to Firestore. Without one, farms
// are kept in this browser's storage, so adding, editing and deleting farms works on this device.
let fs = null;
export function useFirestore(fns) { fs = fns; }

const KEY = 'fruitful.agri.register:';
const listeners = new Map(); // path -> Set of callbacks

function read(path) {
    try { return JSON.parse(localStorage.getItem(KEY + path) || '{}'); } catch (e) { return {}; }
}
function write(path, docs) {
    try { localStorage.setItem(KEY + path, JSON.stringify(docs)); } catch (e) { /* storage blocked: changes last for this visit */ }
    memory[path] = docs;
    (listeners.get(path) || []).forEach(cb => cb(snapshot(path)));
}
const memory = {};
function docs(path) { return memory[path] || (memory[path] = read(path)); }
function snapshot(path) {
    const all = Object.entries(docs(path)).map(([id, data]) => ({ id, data: () => data }));
    return { size: all.length, docs: all, forEach: fn => all.forEach(fn) };
}

export function collection(db, path) { return fs ? fs.collection(db, path) : { path }; }
export function query(ref, ...rest) { return fs ? fs.query(ref, ...rest) : ref; }
export function doc(db, path, id) { return fs ? fs.doc(db, path, id) : { path, id }; }
export function onSnapshot(q, next, error) {
    if (fs) return fs.onSnapshot(q, next, error);
    if (!listeners.has(q.path)) listeners.set(q.path, new Set());
    listeners.get(q.path).add(next);
    setTimeout(() => next(snapshot(q.path)), 0);
    return () => listeners.get(q.path).delete(next);
}
export async function addDoc(ref, data) {
    if (fs) return fs.addDoc(ref, data);
    const id = 'FARM-' + Date.now().toString(36).toUpperCase();
    write(ref.path, { ...docs(ref.path), [id]: data });
    return { id };
}
export async function updateDoc(ref, data) {
    if (fs) return fs.updateDoc(ref, data);
    const all = docs(ref.path);
    if (!all[ref.id]) throw new Error('farm not found');
    write(ref.path, { ...all, [ref.id]: { ...all[ref.id], ...data } });
}
export async function deleteDoc(ref) {
    if (fs) return fs.deleteDoc(ref);
    const all = { ...docs(ref.path) };
    delete all[ref.id];
    write(ref.path, all);
}
