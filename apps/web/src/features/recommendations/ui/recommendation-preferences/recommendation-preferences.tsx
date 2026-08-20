import {
  companyOptions,
  dateOptions,
  originOptions,
  priorityOptions,
  surfaceOptions,
  timeOptions,
} from "../../model/preference-options";
import { PreferenceChoice } from "../preference-choice/preference-choice";
import styles from "./recommendation-preferences.module.css";

export function RecommendationPreferences() {
  return (
    <section className={styles.section} id="preferences">
      <div className={styles.intro}>
        <p>Персональный подбор</p>
        <h2>Расскажите, какой день у моря вам нужен</h2>
        <span>
          Эти параметры станут входными данными для понятной рекомендации, а
          не просто фильтрами каталога.
        </span>
      </div>

      <form className={styles.form}>
        <div className={styles.row}>
          <label className={styles.selectField}>
            <span>Откуда выезжаем</span>
            <select defaultValue="simferopol" name="origin">
              {originOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset className={styles.fieldset}>
            <legend>Когда</legend>
            <div className={styles.twoColumns}>
              {dateOptions.map((option, index) => (
                <PreferenceChoice
                  defaultChecked={index === 0}
                  key={option.value}
                  label={option.label}
                  name="date"
                  value={option.value}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset className={styles.fieldset}>
          <legend>В какое время</legend>
          <div className={styles.threeColumns}>
            {timeOptions.map((option, index) => (
              <PreferenceChoice
                defaultChecked={index === 1}
                detail={option.detail}
                key={option.value}
                label={option.label}
                name="time"
                value={option.value}
              />
            ))}
          </div>
        </fieldset>

        <div className={styles.row}>
          <fieldset className={styles.fieldset}>
            <legend>Кто едет</legend>
            <div className={styles.threeColumns}>
              {companyOptions.map((option, index) => (
                <PreferenceChoice
                  defaultChecked={index === 0}
                  key={option.value}
                  label={option.label}
                  name="company"
                  value={option.value}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Покрытие пляжа</legend>
            <div className={styles.threeColumns}>
              {surfaceOptions.map((option, index) => (
                <PreferenceChoice
                  defaultChecked={index === 0}
                  key={option.value}
                  label={option.label}
                  name="surface"
                  value={option.value}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset className={styles.fieldset}>
          <legend>Что важнее всего</legend>
          <div className={styles.threeColumns}>
            {priorityOptions.map((option, index) => (
              <PreferenceChoice
                defaultChecked={index === 0}
                icon={option.icon}
                key={option.value}
                label={option.label}
                name="priority"
                value={option.value}
              />
            ))}
          </div>
        </fieldset>

        <div className={styles.footer}>
          <button disabled type="button">
            Подобрать пляж
          </button>
          <p>
            Подключим расчёт рекомендаций на следующем этапе. Сейчас можно
            проверить состав и удобство формы.
          </p>
        </div>
      </form>
    </section>
  );
}
