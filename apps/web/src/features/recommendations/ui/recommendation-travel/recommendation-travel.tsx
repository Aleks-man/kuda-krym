import type { RecommendationResponse } from "@kuda-krym/contracts";
import {
  formatTravelDistance,
  formatTravelDuration,
} from "../../model/travel-labels";
import styles from "./recommendation-travel.module.css";

type RecommendationTravelProps = {
  travel: RecommendationResponse["data"][number]["travel"];
};

export function RecommendationTravel({ travel }: RecommendationTravelProps) {
  return (
    <div className={styles.travel} aria-label="Дорога до пляжа">
      <div>
        <span>В пути</span>
        <strong>{formatTravelDuration(travel.durationMinutes)}</strong>
      </div>
      <div>
        <span>Расстояние</span>
        <strong>{formatTravelDistance(travel.distanceMeters)}</strong>
      </div>
    </div>
  );
}
