import { defineTranslations } from '../index'

export default defineTranslations(() => ({
  SearchUnavailableContent: {
    NoLabel: 'Κανένα αποτέλεσμα',
    Label: 'Κανένα αποτέλεσμα για «{search}»',
    Description: 'Ελέγξτε την ορθογραφία ή δοκιμάστε μια νέα αναζήτηση.',
  },
  ButtonRole: {
    Cancel: 'Ακύρωση',
    Close: 'Κλείσιμο',
    Confirm: 'Τέλος',
    Destructive: 'Διαγραφή',
    OK: 'OK',
  },
}))
