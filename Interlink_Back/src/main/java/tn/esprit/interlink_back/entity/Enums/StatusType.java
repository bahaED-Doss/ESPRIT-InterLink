package tn.esprit.interlink_back.entity.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.text.Normalizer;
import java.util.Locale;

public enum StatusType {
    PLANIFIE("planifié"),
    REALISE("réalisé"),
    ANNULE("annulé");

    private final String value;

    StatusType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static StatusType fromValue(String value) {
        if (value == null) {
            return null;
        }

        // Convertir en minuscules, supprimer les accents et comparer
        String normalizedValue = normalize(value);
        for (StatusType type : StatusType.values()) {
            if (normalize(type.value).equals(normalizedValue)) {
                return type;
            }
        }

        throw new IllegalArgumentException("Valeur invalide pour StatusType : " + value);
    }

    private static String normalize(String input) {
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .toLowerCase(Locale.ROOT);
    }
}
