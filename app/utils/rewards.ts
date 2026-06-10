/**
 * Utilitários para gerenciar e rastrear recompensas de pontos
 * Evita múltiplas concessões para o mesmo evento
 */

import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../src/services/firebase";

/**
 * Estados possíveis de uma recompensa
 */
export enum RewardStatus {
  PENDING = "pending", // Ainda não recompensado
  AWARDED = "awarded", // Já recebeu os pontos
  CLAIMED = "claimed", // Usuário confirmou que recebeu
}

/**
 * Tipos de recompensas
 */
export enum RewardType {
  COLLECTION_POINT_DELIVERY = "collection_point_delivery", // Entrega em ponto (20 pontos)
  HOME_PICKUP = "home_pickup", // Coleta domiciliar (baseada em ecoPoints)
}

/**
 * Verifica se uma entrega em ponto já foi recompensada
 * @param collectionPointId - ID do ponto de coleta
 * @param userId - ID do usuário
 * @returns true se já foi recompensado, false caso contrário
 */
export async function hasBeenAwarded(
  collectionPointId: string,
  userId: string
): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    // Verifica se existe um array de deliveries recompensados
    const awardedDeliveries = userData?.awardedPointDeliveries || [];
    return awardedDeliveries.includes(collectionPointId);
  } catch (error) {
    console.error("[REWARDS] Erro ao verificar recompensa:", error);
    return false;
  }
}

/**
 * Marca uma entrega em ponto como recompensada e adiciona pontos
 * @param collectionPointId - ID do ponto de coleta
 * @param userId - ID do usuário
 * @param points - Número de pontos a adicionar (padrão 20)
 * @returns true se foi bem-sucedido, false caso contrário
 */
export async function awardDeliveryPoints(
  collectionPointId: string,
  userId: string,
  points: number = 20
): Promise<boolean> {
  try {
    console.log("[AWARDS] Iniciando award de", points, "para entrega", collectionPointId);

    // Verifica se já foi recompensado
    const alreadyAwarded = await hasBeenAwarded(collectionPointId, userId);
    if (alreadyAwarded) {
      console.warn("[AWARDS] Entrega já foi recompensada:", collectionPointId);
      return false;
    }

    const userRef = doc(db, "users", userId);

    // Usa transação para garantir atomicidade
    await updateDoc(userRef, {
      pointsBalance: increment(points),
      awardedPointDeliveries: (await getDoc(userRef)).data()?.awardedPointDeliveries || [],
    });

    // Adiciona o ID do ponto à lista de deliveries recompensados
    const userData = (await getDoc(userRef)).data();
    const currentDeliveries = userData?.awardedPointDeliveries || [];

    if (!currentDeliveries.includes(collectionPointId)) {
      await updateDoc(userRef, {
        awardedPointDeliveries: [...currentDeliveries, collectionPointId],
      });
    }

    console.log("[AWARDS] Award concluído com sucesso");
    return true;
  } catch (error) {
    console.error("[AWARDS] Erro ao adicionar pontos de entrega:", error);
    throw error;
  }
}

/**
 * Adiciona pontos de coleta domiciliar (com proteção de duplicidade via scheduleId)
 * @param scheduleId - ID do agendamento
 * @param userId - ID do usuário
 * @param ecoPoints - Número de pontos a adicionar
 * @returns true se foi bem-sucedido
 */
export async function awardPickupPoints(
  scheduleId: string,
  userId: string,
  ecoPoints: number
): Promise<boolean> {
  try {
    console.log("[AWARDS] Adicionando", ecoPoints, "pontos para coleta", scheduleId);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      pointsBalance: increment(ecoPoints),
      lastAwardedSchedule: scheduleId,
      lastAwardedAt: new Date(),
    });

    console.log("[AWARDS] Pontos de coleta adicionados");
    return true;
  } catch (error) {
    console.error("[AWARDS] Erro ao adicionar pontos de coleta:", error);
    throw error;
  }
}
