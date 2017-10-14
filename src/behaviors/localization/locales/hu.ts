import { IPartialLocaleValues } from "../interfaces/values";

/**
 * locale : Hungarian (hu)
 * author : Zoltán Tóth : https://github.com/ojji
 */

const hu:IPartialLocaleValues = {
    datepicker: {
        months: [
            "január", "február", "március", "április", "május",
            "június", "július", "augusztus", "szeptember", "október", "november", "december"
        ],
        monthsShort: [
            "jan", "febr", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"
        ],
        weekdays: [
            "vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"
        ],
        weekdaysShort: [
            "V", "H", "K", "Sze", "Cs", "P", "Szo"
        ],
        weekdaysNarrow: [
            "V", "H", "K", "Sze", "Cs", "P", "Szo"
        ],
        formats: {
            time: "HH:mm",
            datetime: "YYYY. MMMM D. HH:mm",
            date: "YYYY. MMMM D.",
            month: "YYYY. MMMM",
            year: "YYYY"
        },
        firstDayOfWeek: 1
    },
    search: {
        placeholder: "Keresés...",
        noResults: {
            header: "Nincs találat",
            message: "A keresés eredménytelen volt."
        }
    },
    select: {
        noResultsMessage: "Nincs találat",
        single: {
            placeholder: "Válasszon egyet"
        },
        multi: {
            placeholder: "Válasszon...",
            maxSelectedMessage: "Max. #{max} kiválasztott elem",
            selectedMessage: "#{count} kiválasztott elem"
        }
    }
};

export default hu;
