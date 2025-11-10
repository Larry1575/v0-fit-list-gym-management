import { db } from "./index";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore/lite";

// Small wrapper service that exposes server-safe functions for Next.js API routes.
// Important contract:
// - Inputs: plain JS objects for member data, string IDs
// - Outputs: objects (including `id` when relevant) or throws Error on failure
// - Error mode: throws Error with a short message

export async function getMembers(includeDeleted = false) {
  try {
    const membersCollection = collection(db, "members");
    const membersSnapshot = await getDocs(membersCollection);
    let membersList = membersSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    if (!includeDeleted) {
      membersList = membersList.filter((m) => !(m as any).deleted);
    }

    // Obtener todas las membresías activas para calcular el status
    const membershipsCollection = collection(db, "memberships");
    const membershipsSnapshot = await getDocs(membershipsCollection);
    const activeMemberships = membershipsSnapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((ms: any) => !ms.deleted && ms.status === "active");

    // Crear un Set de member_ids que tienen membresías activas
    const activeMemberIds = new Set(
      activeMemberships.map((ms: any) => ms.member_id)
    );

    // Actualizar el status de cada miembro basado en sus membresías
    membersList = membersList.map((member: any) => ({
      ...member,
      status: activeMemberIds.has(member.id) ? "active" : "inactive",
    }));

    return membersList;
  } catch (error) {
    // preserve message for debugging in server logs
    throw new Error("Failed to fetch members");
  }
}

export async function getMemberById(id: string, includeDeleted = false) {
  try {
    const memberRef = doc(db, "members", id);
    const memberSnap = await getDoc(memberRef);
    if (!memberSnap.exists()) return null;
    const data = { id: memberSnap.id, ...memberSnap.data() } as any;
    if (!includeDeleted && data.deleted) return null;

    // Verificar si el miembro tiene membresías activas
    const membershipsCollection = collection(db, "memberships");
    const q = query(
      membershipsCollection,
      where("member_id", "==", id),
      where("status", "==", "active")
    );
    const membershipsSnapshot = await getDocs(q);
    const activeMemberships = membershipsSnapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((ms: any) => !ms.deleted);

    // Actualizar status basado en membresías activas
    data.status = activeMemberships.length > 0 ? "active" : "inactive";

    return data;
  } catch (error) {
    throw new Error("Failed to fetch member");
  }
}

export async function createMember(data: Record<string, any>) {
  try {
    const membersCollection = collection(db, "members");
    // Establecer status inicial como inactive (se activará cuando tenga membresía)
    const memberData = {
      ...data,
      status: "inactive",
      created_at: new Date().toISOString(),
    };
    const docRef = await addDoc(membersCollection, memberData);
    return { id: docRef.id, ...memberData };
  } catch (error) {
    throw new Error("Failed to create member");
  }
}

export async function updateMember(id: string, data: Record<string, any>) {
  try {
    const memberRef = doc(db, "members", id);
    // Using setDoc with merge behaviour could be considered; updateDoc isn't in lite, so using setDoc
    await setDoc(memberRef, data, { merge: true } as any);
    return { id, ...data };
  } catch (error) {
    throw new Error("Failed to update member");
  }
}

export async function deleteMember(id: string) {
  try {
    const memberRef = doc(db, "members", id);
    // Soft delete: mark document as deleted with timestamp. This is safer for NoSQL
    const now = new Date().toISOString();
    await setDoc(memberRef, { deleted: true, deleted_at: now }, {
      merge: true,
    } as any);
    return { id, deleted: true, deleted_at: now };
  } catch (error) {
    throw new Error("Failed to delete member");
  }
}

export default {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
