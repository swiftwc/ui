import { defineTranslations } from '../index'

export default defineTranslations(() => ({
  SearchUnavailableContent: {
    NoLabel: 'Κανένα αποτέλεσμα',
    Label: 'Κανένα αποτέλεσμα για «{search}»',
    Description: 'Ελέγξτε την ορθογραφία ή δοκιμάστε μια νέα αναζήτηση.',
  },
  ButtonRole: {
    Default: {
      Cancel: 'Cancel',
      Close: 'Close',
      Confirm: 'Confirm',
      Destructive: 'Διαγραφή',
      OK: 'OK',
    },
  },
}))
